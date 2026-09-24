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
        page = ctx.new_page()
        page.goto("https://gmgn.ai/?chain=sol", wait_until="load", timeout=60000)

    page.bring_to_front()
    page.wait_for_timeout(10000)

    print(f"URL: {page.url}", flush=True)
    body = page.inner_text("body")
    print("TEXT: " + body[:3000].replace("\n", " | "), flush=True)
    page.screenshot(path="gmgn_logged.png", full_page=False)
    print("SCREENSHOT: gmgn_logged.png", flush=True)
