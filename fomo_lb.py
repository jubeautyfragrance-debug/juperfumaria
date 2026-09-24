import json
import sys
from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        api = []

        def on_response(response):
            if response.request.resource_type in ("xhr", "fetch"):
                u = response.url
                if any(k in u for k in ["privy", "featureassets", "prodregistry", "posthog", "flags", "analytics", "sentry"]):
                    return
                try:
                    body = response.text()
                except Exception:
                    body = "<no body>"
                api.append({"url": u[:250], "status": response.status, "body": body[:2000]})

        page.on("response", on_response)

        # tentar manter a rota /leaderboard (sem esperar redirect)
        try:
            page.goto("https://fomo.family/leaderboard", wait_until="commit", timeout=60000)
            page.wait_for_timeout(10000)
        except Exception as e:
            print(f"LOAD_WARNING: {e}", file=sys.stderr)

        print(f"FINAL_URL: {page.url}")
        text = page.inner_text("body")
        print("TEXT_HEAD: " + text[:400].replace("\n", " | "))
        print("API_CALLS:")
        for a in api[:20]:
            print(f"  [{a['status']}] {a['url']}")
            if a["body"] not in ("<no body>", ""):
                print(f"    body: {a['body'][:800]}")
        browser.close()

if __name__ == "__main__":
    main()
