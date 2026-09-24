import json
from playwright.sync_api import sync_playwright

W = "FJDy9FDRy6bwGEUKuAC98bUtN8MkpE2pT7Dj7HE3Z7Q1"

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

    for per in ["1d", "7d", "30d", "all"]:
        try:
            r = page.evaluate(
                "async ({url}) => { const res = await fetch(url, {credentials:'include'}); const t = await res.text(); return {s: res.status, b: t}; }",
                {"url": f"https://gmgn.ai/pf/api/v1/wallet/sol/{W}/profit_stat/{per}"},
            )
            print(f"=== {per}: status {r['s']}", flush=True)
            try:
                d = json.loads(r["b"])
                data = d.get("data", {})
                print(json.dumps({k: data.get(k) for k in ["realized_profit", "unrealized_profit", "total_profit", "buy", "sell", "avg_holding_period", "last_active_timestamp"]}, ensure_ascii=False), flush=True)
                print("pnl_detail:", json.dumps(data.get("pnl_detail", {}), ensure_ascii=False)[:500], flush=True)
                print("risk:", json.dumps(data.get("risk"), ensure_ascii=False)[:300], flush=True)
            except Exception as e:
                print(f"parse err: {e}; body: {r['b'][:300]}", flush=True)
        except Exception as e:
            print(f"{per} ERR: {e}", flush=True)
