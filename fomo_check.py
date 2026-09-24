import sys
from playwright.sync_api import sync_playwright

PROFILE_DIR = "./fomo_profile"
BASE = "https://fomo.family"

def is_logged(body):
    b = body.lower()
    if len(body) < 300:
        return False
    return ("start trading" not in b) and ("login" not in b)

def main():
    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            PROFILE_DIR,
            channel="chrome",
            headless=True,
            viewport={"width": 1440, "height": 900},
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        page.goto(BASE, wait_until="load", timeout=60000)
        page.wait_for_timeout(8000)
        try:
            body = page.inner_text("body")
        except Exception:
            body = ""
        print(f"URL: {page.url}")
        print(f"LOGGED: {is_logged(body)}")
        print("TEXT_HEAD: " + body[:300].replace("\n", " | "))
        ctx.close()

if __name__ == "__main__":
    main()
