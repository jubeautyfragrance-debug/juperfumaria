import json
import sys
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp("http://localhost:9222")
    ctx = browser.contexts[0]

    page = None
    for pg in ctx.pages:
        if "gmgn.ai" in pg.url:
            page = pg
            break
    if not page:
        print("NO_GMGN_PAGE", flush=True)
        sys.exit(1)

    page.bring_to_front()
    api = []

    def on_response(response):
        if response.request.resource_type in ("xhr", "fetch"):
            u = response.url
            if any(k in u for k in [".css", ".js", ".png", ".webp", "static/", "sentry", "posthog", "cdn-cgi"]):
                return
            try:
                body = response.text()
            except Exception:
                body = "<no body>"
            if any(k in u.lower() for k in ["account", "portfolio", "position", "balance", "wallet", "my", "user", "info"]):
                api.append({"url": u, "status": response.status, "body": body[:2500]})

    page.on("response", on_response)

    # clicar na aba Portfolio
    try:
        page.get_by_text("Portfolio", exact=True).first.click(timeout=5000)
        page.wait_for_timeout(8000)
        print(f"AFTER_CLICK_URL: {page.url}", flush=True)
    except Exception as e:
        print(f"CLICK_ERR: {e}", flush=True)
        # tentar clicar no icone da wallet no topo
        try:
            page.keyboard.press("Escape")
        except Exception:
            pass

    body = page.inner_text("body")
    print("TEXT: " + body[:3000].replace("\n", " | "), flush=True)
    page.screenshot(path="gmgn_portfolio.png", full_page=False)

    print("===APIS===", flush=True)
    for a in api[:20]:
        print(f"[{a['status']}] {a['url'][:180]}", flush=True)
        print(f"    {a['body'][:1000]}", flush=True)
