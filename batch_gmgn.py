import json
import re
import time
from playwright.sync_api import sync_playwright

CRIT = {
    "win_rate_min": 50.0,
    "pnl30d_min": 10_000.0,
    "trades_min": 20,
    "hold_min_s": 5 * 3600,
    "hold_max_s": 24 * 3600,
}

def load_wallets():
    with open("fomo_top25.json", encoding="utf-8") as f:
        data = json.load(f)
    return data["30d"]

def extract_profit(d):
    pd = d.get("pnl_detail", {}) or {}
    return {
        "realized_profit": float(d.get("realized_profit") or 0),
        "unrealized_profit": float(d.get("unrealized_profit") or 0),
        "buys": d.get("buy") or 0,
        "sells": d.get("sell") or 0,
        "winrate": float(pd.get("winrate") or 0),
        "token_num": pd.get("token_num") or 0,
        "avg_holding_s": int(d.get("avg_holding_period") or 0),
        "gt5x": pd.get("pnl_gt_5x_num") or 0,
        "risk": d.get("risk"),
        "last_active": d.get("last_active_timestamp") or 0,
    }

def evaluate(w, g30):
    flags = []
    notes = []
    wr = g30["winrate"]
    pnl = g30["realized_profit"] + g30["unrealized_profit"]
    trades = g30["buys"] + g30["sells"]
    hold = g30["avg_holding_s"]
    tokens = g30["token_num"]

    if wr < CRIT["win_rate_min"]:
        flags.append(f"WR {wr:.0f}%<50%")
    if pnl < CRIT["pnl30d_min"]:
        flags.append(f"PnL ${pnl:,.0f}<$10k")
    if trades < CRIT["trades_min"]:
        flags.append(f"{trades} trades<20")
    if hold and hold < CRIT["hold_min_s"]:
        flags.append(f"hold {hold//3600}h<5h (HFT?)")
    if tokens <= 1:
        flags.append("tiro-unico (insider?)")
    if g30["risk"]:
        notes.append(f"risk={json.dumps(g30['risk'])[:120]}")
    if w.get("createdAt"):
        try:
            from datetime import datetime, timezone
            created = datetime.fromisoformat(str(w["createdAt"]).replace("Z", "+00:00"))
            age_days = (datetime.now(timezone.utc) - created).total_seconds() / 86400
            if age_days < 15:
                flags.append(f"conta {age_days:.0f}d<15d")
        except Exception:
            pass
    return flags, notes, {"wr": wr, "pnl": pnl, "trades": trades, "hold_h": hold / 3600 if hold else 0, "tokens": tokens}

def main():
    wallets = load_wallets()
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

        for w in wallets:
            addr = w["address"]
            rec = {"rank": w["rank"], "name": w["name"], "address": addr, "fomo_trades": w["numTrades"], "fomo_pnl30d": w["pnl"], "status": "ERR"}
            try:
                captured = {}
                def on_response(resp, addr=addr):
                    u = resp.url
                    m = re.search(r"profit_stat/(7d|30d|all|1d)", u)
                    if m and addr.lower() in u.lower():
                        try:
                            j = json.loads(resp.text())
                            if j.get("code") == 0 and j.get("data"):
                                captured[m.group(1)] = extract_profit(j["data"])
                        except Exception:
                            pass
                    if f"wallet_common_stat/sol/{addr}" in u:
                        try:
                            j = json.loads(resp.text())
                            d = j.get("data", {})
                            captured["common"] = {"created_tokens": d.get("created_token_count"), "followers": d.get("follow_count"), "remark": d.get("remark_count")}
                        except Exception:
                            pass

                page.on("response", on_response)
                page.goto(f"https://gmgn.ai/sol/address/{addr}", wait_until="domcontentloaded", timeout=45000)
                # esperar profit_stat 7d (default) ate 10s
                for _ in range(10):
                    page.wait_for_timeout(1000)
                    if "7d" in captured:
                        break
                # clicar 30D
                try:
                    page.get_by_text("30D", exact=True).first.click(timeout=4000)
                    for _ in range(6):
                        page.wait_for_timeout(1000)
                        if "30d" in captured:
                            break
                except Exception:
                    pass
                page.remove_listener("response", on_response)

                g30 = captured.get("30d") or captured.get("7d") or {}
                if not g30:
                    rec["status"] = "SEM_DADOS"
                else:
                    flags, notes, m = evaluate(w, g30)
                    rec.update({"status": "APROVADA" if not flags else "DESCARTADA", "flags": flags, "notes": notes, **m, "gmgn_detail": {k: captured.get(k) for k in ("7d", "30d") if k in captured}})
                results.append(rec)
                print(f"#{rec['rank']:>2} {rec['name'][:18]:<18} {rec['status']:<10} WR={m.get('wr',0):.0f}% PnL=${m.get('pnl',0):,.0f} tr={m.get('trades',0)} hold={m.get('hold_h',0):.1f}h tok={m.get('tokens',0)} | {'; '.join(flags) if flags else ''}", flush=True)
            except Exception as e:
                page.remove_listener("response", on_response) if "on_response" in dir() else None
                rec["status"] = f"ERR: {str(e)[:80]}"
                results.append(rec)
                print(f"#{rec['rank']:>2} {rec['name'][:18]:<18} ERRO {str(e)[:60]}", flush=True)
            time.sleep(1)

        with open("gmgn_selecao_pesada_30d.json", "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        aprov = [r for r in results if r["status"] == "APROVADA"]
        print(f"\n===RESUMO: {len(aprov)}/{len(results)} APROVADAS===", flush=True)
        for r in aprov:
            print(f"  #{r['rank']} {r['name']} | WR={r['wr']:.0f}% PnL=${r['pnl']:,.0f} | {r['address']}", flush=True)

if __name__ == "__main__":
    main()
