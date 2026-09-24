import json
import sys
from playwright.sync_api import sync_playwright

WALLET = "FJDy9FDRy6bwGEUKuAC98bUtN8MkpE2pT7Dj7HE3Z7Q1"  # #1 do 30D: Unipcs

def main():
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

        api = []

        def on_response(response):
            if response.request.resource_type in ("xhr", "fetch"):
                u = response.url
                if any(k in u for k in [".css", ".js", ".png", ".webp", ".woff", "static/", "cdn-cgi", "sentry", "posthog", "google", "twitter", "telegram"]):
                    return
                if WALLET.lower() in u.lower():
                    try:
                        api.append({"url": u, "body": response.text()[:8000]})
                    except Exception:
                        pass

        page.on("response", on_response)
        page.bring_to_front()
        page.goto(f"https://gmgn.ai/sol/address/{WALLET}", wait_until="load", timeout=60000)
        page.wait_for_timeout(15000)
        page.remove_listener("response", on_response)

        print(f"URL: {page.url}", flush=True)
        print(f"APIS CAPTURADAS: {len(api)}", flush=True)
        for a in api[:20]:
            print(f"\n--- {a['url'][:230]}", flush=True)
            b = a["body"]
            # resumir campos uteis
            try:
                d = json.loads(b)
                s = json.dumps(d, ensure_ascii=False)
                print(s[:1500], flush=True)
            except Exception:
                print(b[:600], flush=True)

        page.screenshot(path="gmgn_test1.png", full_page=False)

if __name__ == "__main__":
    main()
