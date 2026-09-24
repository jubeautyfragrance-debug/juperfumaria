import sys
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp("http://localhost:9222")
    ctx = browser.contexts[0]
    page = None
    for pg in ctx.pages:
        if "gmgn.ai" in pg.url:
            page = pg
            break
    if not page:
        print("NO_GMGN_PAGE", flush=True)
        sys.exit(1)

    page.bring_to_front()

    # procurar enderecos de carteira solana (base58) visiveis na pagina
    body = page.inner_text("body")
    import re
    addrs = set(re.findall(r"\b[1-9A-HJ-NP-Za-km-z]{32,44}\b", body))
    print("===ENDERECOS_BASE58_VISIVEIS===", flush=True)
    for a in list(addrs)[:20]:
        print(f"  {a}", flush=True)

    # tentar clicar no botao da carteira (avatar/saldo no topo)
    clicked = False
    for sel in ["text=/^0$/", "text=SOL >> nth=0", "[class*=avatar]", "[class*=wallet] >> nth=0"]:
        try:
            page.locator(sel).first.click(timeout=2500)
            clicked = True
            page.wait_for_timeout(3000)
            break
        except Exception:
            continue
    print(f"DROPDOWN_CLICKED: {clicked}", flush=True)

    if clicked:
        body2 = page.inner_text("body")
        addrs2 = set(re.findall(r"\b[1-9A-HJ-NP-Za-km-z]{32,44}\b", body2))
        new = addrs2 - addrs
        print("===NOVOS_ENDERECOS_APOS_DROPDOWN===", flush=True)
        for a in list(new)[:20]:
            print(f"  {a}", flush=True)
        print("TEXT_DROPDOWN: " + body2[:1500].replace("\n", " | "), flush=True)
        page.screenshot(path="gmgn_dropdown.png", full_page=False)
        print("SCREENSHOT: gmgn_dropdown.png", flush=True)
