import json
import sys
from playwright.sync_api import sync_playwright

CAS = {
    "PUSH": "8PwDJhSez3HhdZzJ9FqUu7BLdpMqdgLiDNn8anYKpump",
    "SPEED": "8bFvxaMqvf3kxNtuZwgiD4Sw8iqj6SWGonn3wvRwLMgY",
    "ILY": "6LDU8HoZ3oAJ2hxvYADh8boWmEZV3sfyUb5TyC5Rpump",
}

def main():
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

        for name, ca in CAS.items():
            captured = {}

            def on_response(resp, ca=ca):
                u = resp.url
                if ca.lower() in u.lower() and any(k in u.lower() for k in ["security", "holder", "stat", "top", "sniper", "dev"]):
                    try:
                        captured[u.split("/api/")[-1].split("?")[0][:80]] = resp.text()[:4000]
                    except Exception:
                        pass

            page.on("response", on_response)
            try:
                page.goto(f"https://gmgn.ai/sol/token/{ca}", wait_until="domcontentloaded", timeout=60000)
                page.wait_for_timeout(9000)
            except Exception as e:
                print(f"{name} ERR: {e}", flush=True)
            page.remove_listener("response", on_response)

            print(f"===== {name} =====", flush=True)
            for key, body in captured.items():
                try:
                    d = json.loads(body)
                    s = json.dumps(d, ensure_ascii=False)
                    # resumir campos-chave
                    import re
                    for pat in [r'"dev_hold[^,}]*', r'"top10_hold[^,}]*', r'"sniper[^,}]*', r'"rugged[^,}]*', r'"renounced[^,}]*', r'"frozen[^,}]*', r'"honeypot[^,}]*', r'"bundlers?[^,}]*', r'"insider[^,}]*', r'"rat[^,}]*', r'"lp_[^,}]*', r'"total_holders[^,}]*']:
                        for m in re.findall(pat, s)[:3]:
                            print(f"  [{key}] {m}", flush=True)
                except Exception:
                    pass

if __name__ == "__main__":
    main()
