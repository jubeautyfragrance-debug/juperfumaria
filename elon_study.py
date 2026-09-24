import json
import re
from playwright.sync_api import sync_playwright

CA = "GY9mZfyPpxXxBXBxS2hB2XjhP3kfUsywTvgveozxpump"

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp("http://localhost:9222")
    ctx = browser.contexts[0]
    page = ctx.new_page()
    captured = {}

    def on_response(resp):
        u = resp.url
        if "prod-api.fomo.family" in u:
            slug = re.sub(r"[^a-zA-Z0-9]", "_", u.split("fomo.family/")[-1])[:70]
            try:
                captured[slug] = resp.text()
            except Exception:
                pass

    page.on("response", on_response)
    page.goto(f"https://fomo.family/tokens/solana/{CA}", wait_until="load", timeout=60000)
    page.wait_for_timeout(12000)
    page.remove_listener("response", on_response)

    # Teses ordenadas (quem tem posicao + PnL)
    for key in captured:
        if "sortedThesis" in key or "feed_token_thesis" in key:
            try:
                d = json.loads(captured[key])
                items = d.get("responseObject", {}).get("items", [])
                print(f"===TESES ({len(items)})===")
                for it in items[:12]:
                    t = it.get("trade") or {}
                    user = it.get("userHandle") or "?"
                    c = (it.get("comment") or {}).get("comment", "")[:120]
                    pnl = t.get("pnl") or t.get("pnlUsd")
                    entry = t.get("avgEntryMarketCap") or t.get("entryMarketCap")
                    print(f"- @{user} | pnl={pnl} | entryMC={entry} | {c}")
            except Exception as e:
                print(f"parse err: {e}")

    # Top holders
    for key in captured:
        if "hodlers_top" in key:
            try:
                d = json.loads(captured[key])
                arr = d.get("responseObject", [])
                for a in arr:
                    for h in (a.get("topHolders") or [])[:10]:
                        u2 = h.get("user", {})
                        trade = h.get("trade") or h
                        print(f"HOLDER: @{u2.get('userHandle')} amt={h.get('humanAmount')} val=${h.get('valueUsd') or h.get('value')} pnl={h.get('pnl')}")
            except Exception as e:
                print(f"holders err: {e}")

    # resumo token
    for key in captured:
        if "tokenDetails" in key:
            try:
                d = json.loads(captured[key])["responseObject"]
                print(f"===TOKEN: holders={d.get('holders')} top10={d.get('top10HoldersPercent')}% buys24={d.get('buyCount24')} sells24={d.get('sellCount24')}")
            except Exception:
                pass

    page.close()
