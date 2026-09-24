import json
import re
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
    captured = []

    def on_response(response):
        u = response.url
        if response.request.resource_type in ("xhr", "fetch") and "gmgn.ai" in u:
            if any(k in u for k in [".css", ".js", ".png", ".webp", "static/", "cdn-cgi", "sentry", "google"]):
                return
            if any(k in u.lower() for k in ["wallet", "portfolio", "holding", "pnl", "account/user"]):
                try:
                    captured.append({"url": u, "body": response.text()[:4000]})
                except Exception:
                    pass

    page.on("response", on_response)
    page.goto("https://gmgn.ai/portfolio?chain=sol", wait_until="load", timeout=60000)
    page.wait_for_timeout(12000)
    page.remove_listener("response", on_response)

    addrs = set()
    print("===WALLET_ENDPOINTS===", flush=True)
    for c in captured:
        print(f"URL: {c['url'][:160]}", flush=True)
        found = re.findall(r"\b[1-9A-HJ-NP-Za-km-z]{43,44}\b", c["body"])
        addrs.update(found)
        # mostrar campos relevantes
        try:
            data = json.loads(c["body"])
            s = json.dumps(data, ensure_ascii=False)
            for m in re.finditer(r'"(address|wallet_address|pubkey|name|tag|total_value|pnl|volume|token_count)":"?([^",}]+)"?', s[:4000]):
                print(f"   {m.group(1)}: {m.group(2)}", flush=True)
        except Exception:
            print(f"   body: {c['body'][:400]}", flush=True)

    print("===ENDERECOS_UNICOS===", flush=True)
    for a in addrs:
        print(f"  {a}", flush=True)

    if addrs:
        # consultar saldo SOL de cada endereco via RPC no contexto da pagina
        rpc = "https://api.mainnet-beta.solana.com"
        for a in addrs:
            try:
                r = page.evaluate(
                    """async ({addr, rpc}) => {
                        const res = await fetch(rpc, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({jsonrpc:'2.0',id:1,method:'getBalance',params:[addr]})});
                        const j = await res.json();
                        return j.result ? j.result.value : null;
                    }""",
                    {"addr": a, "rpc": rpc},
                )
                sol = (r or 0) / 1e9
                print(f"BALANCE {a[:10]}...: {sol} SOL (~${sol*97.69:.2f})", flush=True)
            except Exception as e:
                print(f"BAL_ERR {a[:10]}: {e}", flush=True)
