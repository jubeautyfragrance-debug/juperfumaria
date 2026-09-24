import sys
import time
from playwright.sync_api import sync_playwright

CA = sys.argv[1] if len(sys.argv) > 1 else "8bFvxaMqvf3kxNtuZwgiD4Sw8iqj6SWGonn3wvRwLMgY"  # $SPEED
AMOUNT = sys.argv[2] if len(sys.argv) > 2 else "0.00503"

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
    page.bring_to_front()

    # 1. abrir pagina do token
    page.goto(f"https://gmgn.ai/sol/token/{CA}", wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(10000)
    print(f"URL: {page.url}", flush=True)

    # 2. verificar se painel de compra tem valor preenchevel
    body = page.inner_text("body")
    need_connect = "connect" in body.lower() and "phantom" in body.lower()[:5000]
    print(f"CONNECT_HINT: {need_connect}", flush=True)

    # 3. tentar preencher o amount de SOL no painel de trade
    filled = False
    for sel in ["input[placeholder*='SOL']", "input[placeholder*='0.1']", "input[placeholder*='Amount']", "input[type='text']"]:
        try:
            inputs = page.locator(sel)
            for i in range(min(inputs.count(), 6)):
                inp = inputs.nth(i)
                ph = (inp.get_attribute("placeholder") or "").lower()
                if "sol" in ph or "amount" in ph or ph.startswith("0"):
                    inp.fill(AMOUNT, timeout=2000)
                    filled = True
                    print(f"AMOUNT_FILLED: {AMOUNT} (placeholder={ph})", flush=True)
                    break
            if filled:
                break
        except Exception:
            continue
    if not filled:
        print("AMOUNT_FILL_FALHOU: preencher manualmente", flush=True)

    page.screenshot(path="buy_prepare.png", full_page=False)
    print("SCREENSHOT: buy_prepare.png", flush=True)
    print("PROXIMO: clique no botao BUY na tela e confirme na Phantom", flush=True)
