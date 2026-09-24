import json
import sys
from playwright.sync_api import sync_playwright

PROFILE_DIR = "./fomo_profile"
BASE = "https://fomo.family"

def main():
    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            PROFILE_DIR,
            channel="chrome",
            headless=False,
            viewport={"width": 1440, "height": 900},
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
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
                api.append({"url": u[:250], "status": response.status, "body": body[:1500]})

        page.on("response", on_response)
        page.goto(BASE, wait_until="load", timeout=60000)

        # esperar SPA estabilizar
        for _ in range(15):
            page.wait_for_timeout(2000)
            try:
                if page.inner_text("body"):
                    break
            except Exception:
                pass

        # tentar extrair links com retry (SPA pode navegar no meio)
        links = None
        for attempt in range(5):
            try:
                links = page.eval_on_selector_all(
                    "a[href], [role=link], button",
                    "els => els.map(e => ({tag: e.tagName, text: (e.innerText||'').trim().slice(0,50), href: e.href||null}))",
                )
                break
            except Exception as e:
                print(f"RETRY {attempt+1}: {e}", flush=True)
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

        try:
            body = page.inner_text("body")
            print("===HOME_LOGGED_TEXT===")
            print(body[:6000], flush=True)
        except Exception as e:
            print(f"TEXT_ERROR: {e}", flush=True)

        print("===API_CALLS===")
        for a in api[:20]:
            print(f"[{a['status']}] {a['url']}", flush=True)
            if a["body"] not in ("<no body>", ""):
                print(f"   {a['body'][:600]}", flush=True)

        ctx.close()

if __name__ == "__main__":
    main()
