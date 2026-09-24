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
        page = ctx.new_page()
        page.goto("https://gmgn.ai/?chain=sol", wait_until="load", timeout=60000)
        page.wait_for_timeout(10000)
    print(f"URL: {page.url}")
    body = page.inner_text("body")
    logged_out = "sign up" in body.lower() or "log in" in body.lower()
    print(f"LOGIN_VISIVEL: {logged_out}")
    # mostrar trecho relevante
    idx = body.lower().find("not logged")
    if idx >= 0:
        print(f"AVISO: ...{body[max(0,idx-100):idx+150]}...")
    print("HEAD: " + body[:400].replace("\n", " | "))
