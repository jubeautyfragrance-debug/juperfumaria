import sys
from playwright.sync_api import sync_playwright

URL = "https://fomo.family/"

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        try:
            page.goto(URL, wait_until="domcontentloaded", timeout=60000)
            page.wait_for_load_state("networkidle", timeout=30000)
        except Exception as e:
            print(f"LOAD_WARNING: {e}", file=sys.stderr)
        page.wait_for_timeout(4000)

        # Listar todos os links da página para achar ranking/leaderboard
        links = page.eval_on_selector_all(
            "a[href]",
            "els => els.map(e => ({text: e.innerText.trim(), href: e.href}))"
        )
        print("===ALL_LINKS===")
        for l in links:
            print(f"{l['text'][:60]!r} -> {l['href']}")

        # Procurar botoes/elementos com texto ranking ou leaderboard
        print("===CANDIDATES===")
        for l in links:
            t = l["text"].lower()
            h = l["href"].lower()
            if any(k in t or k in h for k in ["rank", "leaderboard", "top"]):
                print(f"CANDIDATE: {l['text'][:60]!r} -> {l['href']}")

        browser.close()

if __name__ == "__main__":
    main()
