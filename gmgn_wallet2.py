import sys
from playwright.sync_api import sync_playwright

WALLET = "4AjoRzEbPoDYz6r69sdeabfs541KS1aPs5KQ9qR4Mf6x"

def main():
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp("http://localhost:9222")
        ctx = browser.contexts[0]
        page = ctx.new_page()
        api = []

        def on_response(response):
            if response.request.resource_type in ("xhr", "fetch"):
                u = response.url
                if any(k in u for k in ["sentry", "posthog", "analytics", "googletagmanager", "google-analytics", "doubleclick", "facebook", "twitter", "static/config", "static/cooking", "static/lpp"]):
                    return
                try:
                    body = response.text()
                except Exception:
                    body = "<no body>"
                if "gmgn.ai" in u:
                    api.append({"url": u, "status": response.status, "body": body[:2500]})

        page.on("response", on_response)

        page.goto(f"https://gmgn.ai/sol/address/{WALLET}", wait_until="load", timeout=60000)

        # esperar verificacao/spash passar (ate 40s)
        for i in range(20):
            page.wait_for_timeout(2000)
            try:
                url = page.url
                body = page.inner_text("body")
                if WALLET.lower() in url.lower():
                    break
            except Exception:
                continue

        print(f"FINAL_URL: {page.url}", flush=True)
        try:
            body = page.inner_text("body")
            print("TEXT: " + body[:2500].replace("\n", " | "), flush=True)
        except Exception as e:
            print(f"TEXT_ERR: {e}", flush=True)
        page.screenshot(path="gmgn_wallet2.png", full_page=False)

        print("===GMGN_APIS (dados)===", flush=True)
        for a in api[:25]:
            if any(k in a["url"] for k in ["address", "wallet", "pnl", "stat", "trades", "score", "quotation"]):
                print(f"[{a['status']}] {a['url'][:250]}", flush=True)
                print(f"    {a['body'][:1200]}", flush=True)

        page.close()

if __name__ == "__main__":
    main()
