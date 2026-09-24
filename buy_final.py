import sys
import time
from playwright.sync_api import sync_playwright

CA = "8bFvxaMqvf3kxNtuZwgiD4Sw8iqj6SWGonn3wvRwLMgY"  # $SPEED
AMOUNT = "0.00503"

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp("http://localhost:9222")
    ctx = browser.contexts[0]
    page = ctx.new_page()
    page.bring_to_front()

    # navegacao com retry
    ok = False
    for attempt in range(3):
        try:
            page.goto(f"https://gmgn.ai/sol/token/{CA}", wait_until="domcontentloaded", timeout=45000)
            page.wait_for_timeout(9000)
            ok = True
            break
        except Exception as e:
            print(f"NAV_RETRY {attempt+1}: {str(e)[:80]}", flush=True)
            time.sleep(3)
    if not ok:
        print("NAV_FALHOU: abra manualmente https://gmgn.ai/sol/token/8bFvxaMqvf3kxNtuZwgiD4Sw8iqj6SWGonn3wvRwLMgY")
        sys.exit(1)

    print(f"URL: {page.url}", flush=True)

    # preencher amount
    filled = False
    for sel in ["input[placeholder*='SOL']", "input[placeholder*='0.1']", "input[placeholder*='0']", "input[type='text']"]:
        try:
            inputs = page.locator(sel)
            for i in range(min(inputs.count(), 6)):
                inp = inputs.nth(i)
                ph = (inp.get_attribute("placeholder") or "").lower()
                if "sol" in ph or "amount" in ph or ph.startswith("0"):
                    inp.fill(AMOUNT, timeout=2000)
                    filled = True
                    print(f"AMOUNT_FILLED: {AMOUNT} (ph={ph})", flush=True)
                    break
            if filled:
                break
        except Exception:
            continue
    print(f"FILLED: {filled}", flush=True)

    # clicar Buy
    clicked = False
    for label in ["Buy", "Comprar"]:
        try:
            btn = page.get_by_role("button", name=label).first
            btn.wait_for(state="visible", timeout=4000)
            btn.click(timeout=3000)
            clicked = True
            print(f"BUY_CLICKED: '{label}'", flush=True)
            break
        except Exception:
            continue
    if not clicked:
        try:
            page.get_by_text("Buy", exact=True).first.click(timeout=3000)
            clicked = True
            print("BUY_CLICKED (texto)", flush=True)
        except Exception as e:
            print(f"BUY_NAO_ACIONADO: {str(e)[:80]}", flush=True)

    page.wait_for_timeout(3000)
    page.screenshot(path="buy_final.png", full_page=False)
    print("SCREENSHOT: buy_final.png", flush=True)
    print(">>> Se abriu popup da Phantom: CONFIRME a transacao (0.00503 SOL ~ $0.49) <<<", flush=True)
