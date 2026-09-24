import sys
from playwright.sync_api import sync_playwright
from playwright._impl._errors import TargetClosedError

PROFILE_DIR = "./fomo_profile"
BASE = "https://fomo.family"

def is_logged(page):
    try:
        body = page.inner_text("body")
    except Exception:
        return False
    b = body.lower()
    if len(body) < 300:
        return False
    return ("start trading" not in b) and ("login" not in b)

def main():
    with sync_playwright() as p:
        try:
            ctx = p.chromium.launch_persistent_context(
                PROFILE_DIR,
                channel="chrome",
                headless=False,
                viewport={"width": 1440, "height": 900},
            )
        except Exception as e:
            print(f"BROWSER_ERROR: {e}", flush=True)
            sys.exit(2)

        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        try:
            page.goto(BASE, wait_until="load", timeout=60000)
        except TargetClosedError:
            print("WINDOW_CLOSED: janela fechada antes do login.", flush=True)
            sys.exit(2)
        page.wait_for_timeout(8000)

        if is_logged(page):
            print("ALREADY_LOGGED", flush=True)
        else:
            print("LOGIN_WAIT: faca login na janela aberta (Google/Apple/X). NAO feche a janela...", flush=True)
            logged = False
            try:
                for i in range(600):
                    if is_logged(page):
                        logged = True
                        print(f"LOGIN_DETECTED apos {i}s", flush=True)
                        break
                    u = page.url
                    if u.rstrip("/") not in (BASE,) and "fomo.family" in u:
                        b = page.inner_text("body").lower()
                        if b and "start trading" not in b and "doesn't exist" not in b:
                            logged = True
                            print(f"LOGIN_DETECTED (rota interna): {u}", flush=True)
                            break
                    page.wait_for_timeout(1000)
            except TargetClosedError:
                print("WINDOW_CLOSED: janela foi fechada durante o login.", flush=True)
                sys.exit(2)

            if not logged:
                print("LOGIN_TIMEOUT", flush=True)
                ctx.close()
                sys.exit(1)

        try:
            page.wait_for_timeout(5000)

            links = None
            for attempt in range(5):
                try:
                    links = page.eval_on_selector_all(
                        "a[href], [role=link], button",
                        "els => els.map(e => ({tag: e.tagName, text: (e.innerText||'').trim().slice(0,60), href: e.href||null}))",
                    )
                    break
                except Exception:
                    page.wait_for_timeout(3000)

            print(f"URL: {page.url}", flush=True)
            if links:
                seen = set()
                print("===LINKS/BOTOES===")
                for l in links:
                    key = (l["text"], l["href"])
                    if key in seen or not l["text"]:
                        continue
                    seen.add(key)
                    print(f"{l['tag']}: {l['text']!r} -> {l['href']}", flush=True)

            body = page.inner_text("body")
            print("===APP_TEXT===")
            print(body[:9000], flush=True)
            page.screenshot(path="fomo_logged.png", full_page=True)
            print("SCREENSHOT: fomo_logged.png", flush=True)

            for route in ["/leaderboard", "/ranking", "/top", "/feed"]:
                try:
                    page.goto(BASE + route, wait_until="load", timeout=60000)
                    page.wait_for_timeout(6000)
                    body = page.inner_text("body")
                    ok = ("doesn't exist" not in body) and (page.url.rstrip("/") != BASE)
                    print(f"ROUTE {route} -> {page.url} ok={ok}", flush=True)
                    if ok:
                        print(f"===TEXT_{route}===")
                        print(body[:12000], flush=True)
                        page.screenshot(path=f"fomo_{route.strip('/')}.png", full_page=True)
                except Exception as e:
                    print(f"ROUTE_ERROR {route}: {e}", flush=True)

            print("DONE: fechando navegador em 10s...", flush=True)
            page.wait_for_timeout(10000)
            ctx.close()
        except TargetClosedError:
            print("WINDOW_CLOSED: janela fechada apos login (sessao salva).", flush=True)
            sys.exit(0)

if __name__ == "__main__":
    main()
