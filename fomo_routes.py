import json
import sys
from playwright.sync_api import sync_playwright

ROUTES = [
    "https://fomo.family/ranking",
    "https://fomo.family/leaderboard",
    "https://fomo.family/top",
]

def probe(url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        api = []

        def on_response(response):
            if response.request.resource_type in ("xhr", "fetch"):
                u = response.url
                # filtrar telemetria
                if any(k in u for k in ["privy", "featureassets", "prodregistry", "posthog", "flags"]):
                    return
                try:
                    body = response.text()
                except Exception:
                    body = "<no body>"
                api.append({"url": u[:200], "status": response.status, "body": body[:1200]})

        page.on("response", on_response)
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=60000)
            page.wait_for_load_state("networkidle", timeout=20000)
        except Exception as e:
            print(f"LOAD_WARNING: {e}", file=sys.stderr)
        page.wait_for_timeout(5000)

        print(f"\n##### ROUTE: {url}")
        print(f"FINAL_URL: {page.url}")
        text = page.inner_text("body")
        print("TEXT_HEAD: " + text[:500].replace("\n", " | "))
        print("API_CALLS:")
        for a in api[:10]:
            print(f"  [{a['status']}] {a['url']}")
            print(f"    body: {a['body'][:600]}")
        browser.close()

if __name__ == "__main__":
    for r in ROUTES:
        probe(r)
