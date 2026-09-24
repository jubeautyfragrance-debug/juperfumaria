import json
import sys
import time
from urllib.parse import quote
from playwright.sync_api import sync_playwright

CDP = "http://localhost:9222"

# ==================== CRITERIOS (Selecao Pesada + nota 'como achar carteiras assertivas') ====================
CRITERIA = {
    "win_rate_min": 50.0,       # >= 50%
    "pnl30d_min": 10_000.0,     # >= $10k
    "trades_min": 20,           # >= 20 trades 30D
    "duration_min_h": 5.0,      # duracao media >= 5h (evita bots/HFT)
    "duration_max_h": 24.0,     # duracao media <= 24h
    "diversification_max_pct": 40.0,  # <= 40% do lucro em 1 token
}

def get_page(ctx, prefer_url_part=None):
    if prefer_url_part:
        for pg in ctx.pages:
            if prefer_url_part in pg.url:
                return pg
    return ctx.new_page()

def fetch_json(page, url):
    return page.evaluate(
        "async (url) => { const r = await fetch(url, {credentials:'include'}); return {status: r.status, body: await r.text()}; }",
        url,
    )

# ==================== FOMO ====================
def fomo_leaderboards(ctx, periods=("24h", "7d", "30d")):
    """Navega no UI do leaderboard e captura as respostas de rede do prod-api."""
    out = {}
    page = ctx.new_page()
    captured = {}

    def on_response(response):
        u = response.url
        for per in periods:
            if f"prod-api.fomo.family/v2/leaderboard/{per}" in u:
                try:
                    captured[per] = json.loads(response.text())
                except Exception:
                    pass

    page.on("response", on_response)
    page.goto("https://fomo.family/leaderboard", wait_until="load", timeout=60000)
    page.wait_for_timeout(8000)

    # clicar nos botoes de periodo para disparar as chamadas correspondentes
    for label, per in [("7D", "7d"), ("30D", "30d")]:
        try:
            page.get_by_text(label, exact=True).first.click(timeout=3000)
            page.wait_for_timeout(4000)
        except Exception:
            pass

    page.remove_listener("response", on_response)
    page.close()
    for per, data in captured.items():
        try:
            out[per] = data["responseObject"]["leaderboard"]
        except Exception:
            pass
    return out

def fomo_format(traders):
    lines = []
    for i, t in enumerate(traders[:25], 1):
        pnl = t.get("pnl24h") or t.get("pnl7d") or t.get("pnl30d") or t.get("pnlAll") or t.get("pnl") or 0
        lines.append(
            f"{i:>2}. {t.get('displayName','?')} (@{t.get('userHandle','?')}) "
            f"PnL=${pnl:,.0f} trades={t.get('numTrades','?')} vol=${t.get('totalVolume') or 0:,.0f} "
            f"sol={t.get('address','?')[:12]}..."
        )
    return "\n".join(lines)

# ==================== GMGN ====================
def gmgn_wallet_analysis(page, wallet):
    """Navega ate a pagina da carteira no GMGN logado e captura a API de metricas."""
    api = {}

    def on_response(response):
        if response.request.resource_type in ("xhr", "fetch"):
            u = response.url
            if wallet.lower() in u.lower() and any(k in u.lower() for k in ["address", "wallet", "stat", "pnl", "quotation", "score", "signal"]):
                try:
                    api[u] = response.text()[:6000]
                except Exception:
                    pass

    page.on("response", on_response)
    page.goto(f"https://gmgn.ai/sol/address/{wallet}", wait_until="load", timeout=60000)

    # esperar dados (ate 30s)
    for _ in range(15):
        page.wait_for_timeout(2000)
        if api:
            break
    page.wait_for_timeout(2000)
    page.remove_listener("response", on_response)

    result = {"wallet": wallet, "apis_captured": len(api)}
    for u, body in api.items():
        try:
            data = json.loads(body)
        except Exception:
            continue
        result.setdefault("endpoints", []).append({"url": u[:200], "data": data})
    return result

# ==================== AVALIACAO ====================
def evaluate(wallet_data):
    """Aplica criterios. Espera dict com metricas normalizadas quando disponiveis."""
    flags = []
    wr = wallet_data.get("win_rate")
    pnl = wallet_data.get("pnl30d")
    trades = wallet_data.get("trades")
    dur = wallet_data.get("avg_duration_h")
    div = wallet_data.get("concentration_pct")

    if wr is not None and wr < CRITERIA["win_rate_min"]:
        flags.append(f"WinRate {wr}% < {CRITERIA['win_rate_min']}%")
    if pnl is not None and pnl < CRITERIA["pnl30d_min"]:
        flags.append(f"PnL30D ${pnl:,.0f} < ${CRITERIA['pnl30d_min']:,.0f}")
    if trades is not None and trades < CRITERIA["trades_min"]:
        flags.append(f"Trades {trades} < {CRITERIA['trades_min']}")
    if dur is not None and not (CRITERIA["duration_min_h"] <= dur <= CRITERIA["duration_max_h"]):
        flags.append(f"Duracao {dur}h fora de 5-24h")
    if div is not None and div > CRITERIA["diversification_max_pct"]:
        flags.append(f"Concentracao {div}% > 40%")
    return flags

def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "fomo"
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(CDP)
        ctx = browser.contexts[0]

        if mode == "fomo":
            lbs = fomo_leaderboards(ctx)
            for per, traders in lbs.items():
                print(f"=====FOMO RANKING {per.upper()}=====")
                print(fomo_format(traders))
        elif mode == "gmgn":
            wallet = sys.argv[2]
            page = get_page(ctx, "gmgn.ai")
            if page not in ctx.pages:
                page = ctx.new_page()
            result = gmgn_wallet_analysis(page, wallet)
            print(json.dumps(result, indent=2, ensure_ascii=False)[:8000])
            page.close()

if __name__ == "__main__":
    main()
