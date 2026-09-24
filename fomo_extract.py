import json
import sys
import time
from playwright.sync_api import sync_playwright

BASE = "https://fomo.family"

def get_page(ctx):
    return ctx.pages[0] if ctx.pages else ctx.new_page()

def is_logged(page):
    try:
        body = page.inner_text("body")
    except Exception:
        return False
    b = body.lower()
    if len(body) < 300:
        return False
    return ("start trading" not in b) and ("login" not in b)

def extract(page, tag):
    print(f"URL: {page.url}", flush=True)
    try:
        links = page.eval_on_selector_all(
            "a[href], [role=link], button",
            "els => els.map(e => ({tag: e.tagName, text: (e.innerText||'').trim().slice(0,60), href: e.href||null}))",
        )
        seen = set()
        print("===LINKS/BOTOES===")
        for l in links:
            key = (l["text"], l["href"])
            if key in seen or not l["text"]:
                continue
            seen.add(key)
            print(f"{l['tag']}: {l['text']!r} -> {l['href']}", flush=True)
    except Exception as e:
        print(f"LINKS_ERROR: {e}", flush=True)

    try:
        body = page.inner_text("body")
        print(f"===TEXT_{tag}===")
        print(body[:12000], flush=True)
        page.screenshot(path=f"fomo_{tag}.png", full_page=True)
        print(f"SCREENSHOT: fomo_{tag}.png", flush=True)
    except Exception as e:
        print(f"TEXT_ERROR: {e}", flush=True)

def main():
    with sync_playwright() as p:
        try:
            browser = p.chromium.connect_over_cdp("http://localhost:9222")
        except Exception as e:
            print(f"CDP_ERROR: {e}", flush=True)
            print("Certifique-se de que o Chrome foi iniciado com: chrome.exe --remote-debugging-port=9222", flush=True)
            sys.exit(2)

        ctx = browser.contexts[0]
        page = get_page(ctx)

        page.goto(BASE, wait_until="load", timeout=60000)
        page.wait_for_timeout(8000)

        if not is_logged(page):
            print("NOT_LOGGED: faca login na janela do Chrome que abriu (Google/Apple/X).", flush=True)
            print("Esperando ate 10 min...", flush=True)
            logged = False
            for i in range(600):
                if is_logged(page):
                    logged = True
                    print(f"LOGIN_DETECTED apos {i}s", flush=True)
                    break
                page.wait_for_timeout(1000)
            if not logged:
                print("LOGIN_TIMEOUT", flush=True)
                sys.exit(1)

        print("LOGGED! Extraindo app...", flush=True)
        page.wait_for_timeout(5000)
        extract(page, "home_logged")

        # rotas de ranking
        for route in ["/leaderboard", "/ranking", "/top", "/feed"]:
            try:
                page.goto(BASE + route, wait_until="load", timeout=60000)
                page.wait_for_timeout(7000)
                body = page.inner_text("body")
                ok = ("doesn't exist" not in body) and (page.url.rstrip("/") != BASE)
                print(f"ROUTE {route} -> {page.url} ok={ok}", flush=True)
                if ok:
                    extract(page, route.strip("/"))
            except Exception as e:
                print(f"ROUTE_ERROR {route}: {e}", flush=True)

        print("DONE: deixando o Chrome aberto para voce explorar.", flush=True)

if __name__ == "__main__":
    main()
