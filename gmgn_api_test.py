import json
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
                if any(k in u for k in [".css", ".js", ".png", ".webp", ".mp4", "static/", "sentry", "posthog", "analytics"]):
                    return
                try:
                    body = response.text()
                except Exception:
                    body = "<no body>"
                api.append({"url": u, "status": response.status, "body": body[:1500]})

        page.on("response", on_response)

        page.goto(f"https://gmgn.ai/sol/address/{WALLET}", wait_until="load", timeout=60000)
        page.wait_for_timeout(15000)

        # tentar fetch direto de endpoints internos conhecidos do GMGN
        endpoints = [
            f"https://gmgn.ai/defi/quotation/v1/smartmoney/walletNew/sol/{WALLET}",
            f"https://gmgn.ai/defi/quotation/v1/smartmoney/walletActivity/sol/{WALLET}",
        ]
        for ep in endpoints:
            try:
                result = page.evaluate(
                    "async (url) => { const r = await fetch(url, {credentials:'include'}); const t = await r.text(); return {status: r.status, body: t.slice(0,2000)}; }",
                    ep,
                )
                print(f"===FETCH {ep.split('/v1/')[1] if '/v1/' in ep else ep}", flush=True)
                print(f"STATUS: {result['status']}", flush=True)
                print(f"BODY: {result['body'][:1200]}", flush=True)
            except Exception as e:
                print(f"FETCH_ERR {ep}: {e}", flush=True)

        print("===ALL_API_CAPTURED===", flush=True)
        for a in api[-30:]:
            print(f"[{a['status']}] {a['url'][:200]}", flush=True)

        page.close()

if __name__ == "__main__":
    main()
