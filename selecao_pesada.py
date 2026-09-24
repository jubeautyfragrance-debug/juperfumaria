import json
from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp("http://localhost:9222")
        ctx = browser.contexts[0]
        page = ctx.new_page()
        captured = {}

        def on_response(response):
            u = response.url
            if "prod-api.fomo.family/v2/leaderboard" in u:
                for per in ["24h", "7d", "30d"]:
                    if f"/v2/leaderboard/{per}" in u:
                        try:
                            captured[per] = json.loads(response.text())
                        except Exception:
                            pass

        page.on("response", on_response)
        page.goto("https://fomo.family/leaderboard", wait_until="load", timeout=60000)
        page.wait_for_timeout(8000)
        try:
            page.get_by_text("30D", exact=True).first.click(timeout=3000)
            page.wait_for_timeout(4000)
        except Exception:
            pass
        page.remove_listener("response", on_response)
        page.close()

        out = {}
        for per in ["24h", "7d", "30d"]:
            lb = captured.get(per, {}).get("responseObject", {}).get("leaderboard", [])
            out[per] = [
                {
                    "rank": i + 1,
                    "name": t.get("displayName"),
                    "handle": t.get("userHandle"),
                    "address": t.get("address"),
                    "pnl": t.get(f"pnl{per.replace('24h','24h').replace('7d','7d').replace('30d','30d')}") or t.get("pnl24h") or t.get("pnl7d") or t.get("pnl30d"),
                    "numTrades": t.get("numTrades"),
                    "totalVolume": t.get("totalVolume"),
                    "followers": t.get("followers"),
                    "createdAt": t.get("createdAt"),
                    "averageHoldTimeSeconds": t.get("averageHoldTimeSeconds"),
                    "twitter": t.get("twitter"),
                }
                for i, t in enumerate(lb[:25])
            ]
        with open("fomo_top25.json", "w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False, indent=2)
        print("SALVO: fomo_top25.json")
        for per in out:
            print(f"{per}: {len(out[per])} traders")
            for t in out[per][:5]:
                print(f"  #{t['rank']} {t['name']}: {t['address']}")

if __name__ == "__main__":
    main()
