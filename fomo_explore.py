import sys
from playwright.sync_api import sync_playwright

BASE = "https://fomo.family"

def on_response_factory(api):
    def on_response(response):
        if response.request.resource_type in ("xhr", "fetch"):
            u = response.url
            if any(k in u for k in ["privy", "featureassets", "prodregistry", "posthog", "flags", "analytics", "sentry", "status.fomo"]):
                return
            try:
                body = response.text()
            except Exception:
                body = "<no body>"
            api.append({"url": u[:250], "status": response.status, "body": body[:2500]})
    return on_response

def main():
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp("http://localhost:9222")
        ctx = browser.contexts[0]
        page = ctx.new_page()
        api = []
        page.on("response", on_response_factory(api))

        # 1. Home logada
        page.goto(BASE, wait_until="load", timeout=60000)
        page.wait_for_timeout(6000)
        print(f"HOME_URL: {page.url}", flush=True)
        print("HOME_TEXT: " + page.inner_text("body")[:600].replace("\n", " | "), flush=True)

        # 2. links visiveis da app logada
        try:
            links = page.eval_on_selector_all(
                "a[href], [role=link], button",
                "els => els.map(e => ({t: (e.innerText||'').trim().slice(0,40), h: e.href||null}))",
            )
            seen = set()
            print("===LINKS===")
            for l in links:
                k = (l["t"], l["h"])
                if k in seen or not l["t"]:
                    continue
                seen.add(k)
                print(f"  {l['t']!r} -> {l['h']}", flush=True)
        except Exception as e:
            print(f"LINKS_ERR: {e}", flush=True)

        # 3. tentar rotas de ranking
        for route in ["/leaderboard", "/ranking", "/top-traders", "/discover"]:
            try:
                api.clear()
                page.goto(BASE + route, wait_until="load", timeout=60000)
                page.wait_for_timeout(6000)
                body = page.inner_text("body")
                ok = ("doesn't exist" not in body) and (page.url.rstrip("/") != BASE)
                print(f"\nROUTE {route} -> {page.url} ok={ok}", flush=True)
                if ok:
                    print("TEXT: " + body[:2500].replace("\n", " | "), flush=True)
                    print("APIS:", flush=True)
                    for a in api[:12]:
                        print(f"  [{a['status']}] {a['url']}", flush=True)
                        if len(a["body"]) > 5 and a["body"] != "<no body>":
                            print(f"     {a['body'][:500]}", flush=True)
                    page.screenshot(path=f"fomo_{route.strip('/')}.png", full_page=False)
            except Exception as e:
                print(f"ROUTE_ERR {route}: {e}", flush=True)

        page.close()
        print("DONE", flush=True)

if __name__ == "__main__":
    main()
