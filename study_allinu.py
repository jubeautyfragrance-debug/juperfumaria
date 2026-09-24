import json
import re
from playwright.sync_api import sync_playwright

CA = "4MMQY9bwkxxTtsK3W227Q5ABT6yFY8Pmn9Ze7wmAXKY8"

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp("http://localhost:9222")
    ctx = browser.contexts[0]
    page = ctx.new_page()
    captured = {}

    def on_response(resp):
        u = resp.url
        if "prod-api.fomo.family" in u:
            slug = re.sub(r"[^a-zA-Z0-9]", "_", u.split("fomo.family/")[-1])[:80]
            try:
                captured[slug] = resp.text()[:8000]
            except Exception:
                pass

    page.on("response", on_response)
    page.goto(f"https://fomo.family/tokens/solana/{CA}", wait_until="load", timeout=60000)
    page.wait_for_timeout(12000)
    page.remove_listener("response", on_response)

    print("===APIS FOMO (ALLINU)===")
    for k, v in captured.items():
        # pular tokens grandes de config
        if any(x in k for x in ["filterTokens", "verifiedTokens", "tokenAllowList", "config", "watchlist", "hodlers_friends"]):
            continue
        print(f"--- {k}")
        try:
            d = json.loads(v)
            s = json.dumps(d, ensure_ascii=False)
            print(s[:2000])
        except Exception:
            print(v[:800])
        print()

    # aba top traders / teses na pagina
    body = page.inner_text("body")
    idx = body.find("Tese")
    print("===TESES VISIVEIS===")
    print(body[max(0, idx-200):idx+2500].replace("\n", " | ") if idx >= 0 else "nenhuma secao Tese visivel")
    page.screenshot(path="allinu_study.png", full_page=False)
    page.close()
