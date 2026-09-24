import re
import sys
from playwright.sync_api import sync_playwright

PHANTOM = "chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa"

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp("http://localhost:9222")
    ctx = browser.contexts[0]

    print("===PAGES NO CONTEXTO===", flush=True)
    target = None
    for pg in ctx.pages:
        print(f"  {pg.url[:100]}", flush=True)
        if pg.url.startswith(PHANTOM):
            target = pg

    if not target:
        print("PHANTOM_NAO_ENCONTRADA_NAS_PAGES", flush=True)
        sys.exit(1)

    print(f"===PHANTOM POPUP: {target.url}===", flush=True)
    try:
        body = target.inner_text("body")
        print("TEXT:", flush=True)
        print(body[:3000], flush=True)
        # enderecos base58
        addrs = set(re.findall(r"\b[1-9A-HJ-NP-Za-km-z]{32,44}\b", body))
        if addrs:
            print("===ENDERECOS===", flush=True)
            for a in addrs:
                print(f"  {a}", flush=True)
        # valores em USD ou SOL
        vals = re.findall(r"[$]?\s?[\d.,]+\s?(?:USD|SOL)", body)
        if vals:
            print("===VALORES===", flush=True)
            for v in vals[:20]:
                print(f"  {v}", flush=True)
        target.screenshot(path="phantom_popup.png")
        print("SCREENSHOT: phantom_popup.png", flush=True)
    except Exception as e:
        print(f"ERR: {e}", flush=True)
