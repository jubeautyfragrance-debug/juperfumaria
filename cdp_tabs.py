from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp("http://localhost:9222")
    for ci, ctx in enumerate(browser.contexts):
        print(f"===CONTEXT {ci}===")
        for i, page in enumerate(ctx.pages):
            title = ""
            try:
                title = page.title()[:60]
            except Exception:
                pass
            print(f"  [{i}] {page.url[:100]} | title: {title}")
