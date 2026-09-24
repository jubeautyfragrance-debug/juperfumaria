from playwright.sync_api import sync_playwright

def is_logged(page):
    try:
        body = page.inner_text("body")
    except Exception:
        return False
    b = body.lower()
    if len(body) < 300:
        return False
    return ("start trading" not in b) and ("login" not in b)

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp("http://localhost:9222")
    ctx = browser.contexts[0]
    page = ctx.pages[0] if ctx.pages else ctx.new_page()
    print(f"URL_ATUAL: {page.url}")
    body = page.inner_text("body")[:300].replace("\n", " | ")
    print(f"LOGGED: {is_logged(page)}")
    print(f"TEXT: {body}")
