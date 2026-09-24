import sys
from playwright.sync_api import sync_playwright

BASE = "https://fomo.family"

def main():
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp("http://localhost:9222")
        ctx = browser.contexts[0]
        page = ctx.new_page()
        api = []

        def on_response(response):
            if response.request.resource_type in ("xhr", "fetch"):
                u = response.url
                if any(k in u for k in ["datadoghq", "ddforward", "app-actions", "posthog", "privy", "featureassets", "prodregistry", "sentry", "status.fomo", "imagedelivery", "cloudflare"]):
                    return
                try:
                    body = response.text()
                except Exception:
                    body = "<no body>"
                # so nos interesa prod-api
                if "prod-api.fomo.family" in u:
                    api.append({"url": u, "status": response.status, "body": body[:3000]})

        page.on("response", on_response)

        # ir para leaderboard e esperar dados do ranking
        page.goto(BASE + "/leaderboard", wait_until="load", timeout=60000)
        page.wait_for_timeout(8000)

        # trocar periodo 7D se existir o botao
        try:
            btn = page.get_by_text("7D", exact=True).first
            btn.click(timeout=3000)
            page.wait_for_timeout(4000)
            print("CLICKED_7D", flush=True)
        except Exception as e:
            print(f"NO_7D_BUTTON: {e}", flush=True)

        print("===PROD_API_CALLS===", flush=True)
        for a in api:
            print(f"[{a['status']}] {a['url'][:150]}", flush=True)
            print(f"    {a['body'][:1200]}", flush=True)

        page.close()

if __name__ == "__main__":
    main()
