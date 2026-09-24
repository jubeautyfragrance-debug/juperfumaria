import json
import time
from datetime import datetime, timezone
from playwright.sync_api import sync_playwright

CRIT = {
    "win_rate_min": 50.0,
    "pnl30d_min": 10_000.0,
    "trades_min": 20,
    "hold_min_s": 5 * 3600,
    "hold_max_s": 24 * 3600,
}

def main():
    with open("fomo_top25.json", encoding="utf-8") as f:
        wallets = json.load(f)["30d"]

    results = []
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp("http://localhost:9222")
        ctx = browser.contexts[0]
        page = None
        for pg in ctx.pages:
            if "gmgn.ai" in pg.url:
                page = pg
                break
        if not page:
            page = ctx.new_page()
            page.goto("https://gmgn.ai/?chain=sol", wait_until="load", timeout=60000)
            page.wait_for_timeout(8000)

        for w in wallets:
            addr = w["address"]
            rec = {"rank": w["rank"], "name": w["name"], "handle": w["handle"], "address": addr}

            # --- metricas fomo ---
            pnl30d = w.get("pnl") or 0
            trades = w.get("numTrades") or 0
            hold_s = w.get("averageHoldTimeSeconds") or 0
            created = w.get("createdAt")
            vol = w.get("totalVolume") or 0

            # --- gmgn: common stat (dev-check, idade, risco) ---
            gmgn = {}
            try:
                r = page.evaluate(
                    """async (url) => { const res = await fetch(url, {credentials:'include'}); return {s: res.status, b: await res.text()}; }""",
                    f"https://gmgn.ai/api/v1/wallet_common_stat/sol/{addr}",
                )
                if r["s"] == 200:
                    j = json.loads(r["b"])
                    if j.get("code") == 0 and j.get("data"):
                        d = j["data"]
                        gmgn = {
                            "created_tokens": d.get("created_token_count") or 0,
                            "followers": d.get("follow_count") or 0,
                            "tags": d.get("tags") or [],
                            "created_at": d.get("created_at") or 0,
                            "remark": d.get("remark_count") or 0,
                        }
            except Exception as e:
                gmgn = {"err": str(e)[:100]}
            time.sleep(0.4)

            # --- avaliacao Selecao Pesada ---
            flags, na = [], []
            if pnl30d < CRIT["pnl30d_min"]:
                flags.append(f"PnL30D ${pnl30d:,.0f}<$10k")
            if trades < CRIT["trades_min"]:
                flags.append(f"{trades} trades<20")
            if hold_s:
                h = hold_s / 3600
                if not (CRIT["hold_min_s"] / 3600 <= h <= CRIT["hold_max_s"] / 3600):
                    if h < 5:
                        flags.append(f"hold {h:.1f}h<5h (HFT/bot)")
                    else:
                        flags.append(f"hold {h:.0f}h>24h (swing)")
            else:
                na.append("hold N/A")
            na.append("WR N/A (fomo oculta trades do GMGN)")
            na.append("diversificacao N/A")
            if gmgn.get("created_tokens", 0) > 0:
                flags.append(f"DEV: criou {gmgn['created_tokens']} tokens")
            if created:
                try:
                    c = datetime.fromisoformat(str(created).replace("Z", "+00:00"))
                    age = (datetime.now(timezone.utc) - c).days
                    if age < 15:
                        flags.append(f"conta {age}d<15d")
                except Exception:
                    pass

            rec.update({
                "pnl30d": pnl30d, "trades": trades, "hold_h": round(hold_s / 3600, 1) if hold_s else None,
                "volume": vol, "gmgn": gmgn,
                "status": "APROVADA" if not flags else "DESCARTADA",
                "flags": flags, "na": na,
            })
            results.append(rec)
            f = "; ".join(flags) if flags else "-"
            print(f"#{rec['rank']:>2} {rec['name'][:18]:<18} {rec['status']:<10} PnL=${pnl30d:>10,.0f} tr={trades:>5} hold={rec['hold_h'] if rec['hold_h'] else '--':>6}h | {f}", flush=True)

        with open("selecao_pesada_resultado.json", "w", encoding="utf-8") as f2:
            json.dump(results, f2, ensure_ascii=False, indent=2)

        aprov = [r for r in results if r["status"] == "APROVADA"]
        print(f"\n===RESUMO: {len(aprov)}/{len(results)} APROVADAS===", flush=True)
        for r in aprov:
            print(f"  #{r['rank']} {r['name']} (@{r['handle']}) PnL=${r['pnl30d']:,.0f} tr={r['trades']} hold={r['hold_h']}h", flush=True)
            print(f"     {r['address']}", flush=True)

if __name__ == "__main__":
    main()
