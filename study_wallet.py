import json
import re
import sys
from playwright.sync_api import sync_playwright

WALLET = "4MMQY9bwkxxTtsK3W227Q5ABT6yFY8Pmn9Ze7wmAXKY8"

def main():
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp("http://localhost:9222")
        ctx = browser.contexts[0]
        page = ctx.new_page()
        captured = {}

        def on_response(resp):
            u = resp.url
            if WALLET in u and "prod-api.fomo.family" in u:
                try:
                    captured[re.sub(r"[^a-zA-Z]", "", u.split("/v2/")[-1])[:60]] = resp.text()[:6000]
                except Exception:
                    pass

        page.on("response", on_response)
        page.goto(f"https://fomo.family/profile/wallet/{WALLET}", wait_until="load", timeout=60000)
        page.wait_for_timeout(10000)
        if not captured:
            page.goto(f"https://fomo.family/wallet/{WALLET}", wait_until="load", timeout=60000)
            page.wait_for_timeout(8000)

        print("===APIs CAPTURADAS===", flush=True)
        for k, v in captured.items():
            print(f"--- {k}", flush=True)
            print(v[:2500], flush=True)

        body = page.inner_text("body")
        print("===PAGE TEXT===", flush=True)
        print(body[:3000].replace("\n", " | "), flush=True)
        page.screenshot(path="fomo_wallet_study.png", full_page=False)
        page.close()

if __name__ == "__main__":
    main()
