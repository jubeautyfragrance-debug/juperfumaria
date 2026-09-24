import json
import sys
from playwright.sync_api import sync_playwright

WALLET = "4AjoRzEbPoDYz6r69sdeabfs541KS1aPs5KQ9qR4Mf6x"  # propria carteira do usuario no fomo

def main():
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp("http://localhost:9222")
        ctx = browser.contexts[0]
        page = ctx.new_page()
        api = []

        def on_response(response):
            if response.request.resource_type in ("xhr", "fetch"):
                u = response.url
                if any(k in u for k in ["sentry", "posthog", "analytics", "googletagmanager", "google-analytics", "doubleclick", "facebook", "twitter"]):
                    return
                try:
                    body = response.text()
                except Exception:
                    body = "<no body>"
                if "gmgn.ai" in u and ("api" in u or u.endswith(".json") or "defi" in u):
                    api.append({"url": u, "status": response.status, "body": body[:2500]})

        page.on("response", on_response)

        # 1. pagina da carteira no GMGN
        print(f"===WALLET_PAGE: {WALLET}", flush=True)
        try:
            page.goto(f"https://gmgn.ai/sol/address/{WALLET}", wait_until="load", timeout=60000)
            page.wait_for_timeout(9000)
            body = page.inner_text("body")
            print("TEXT: " + body[:2000].replace("\n", " | "), flush=True)
            page.screenshot(path="gmgn_wallet.png", full_page=False)
            print("SCREENSHOT: gmgn_wallet.png", flush=True)
        except Exception as e:
            print(f"WALLET_ERR: {e}", flush=True)

        print("===GMGN_APIS===", flush=True)
        for a in api[:15]:
            print(f"[{a['status']}] {a['url'][:200]}", flush=True)
            if a["body"] not in ("<no body>", ""):
                print(f"    {a['body'][:800]}", flush=True)

        page.close()

if __name__ == "__main__":
    main()
