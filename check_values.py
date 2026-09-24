import json
import re
import sys
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp("http://localhost:9222")
    ctx = browser.contexts[0]

    gmgn = None
    fomo = None
    for pg in ctx.pages:
        if "gmgn.ai" in pg.url and gmgn is None:
            gmgn = pg
        if "fomo.family" in pg.url and fomo is None:
            fomo = pg

    print("===GMGN: tentando endpoints de wallets===")
    if gmgn:
        endpoints = [
            "https://gmgn.ai/pf/api/v1/wallets/sol/wallet_holding_info",
            "https://gmgn.ai/pf/api/v1/wallets",
            "https://gmgn.ai/api/v1/wallets/sol",
        ]
        for ep in endpoints:
            try:
                r = gmgn.evaluate(
                    "async (url) => { const res = await fetch(url, {credentials:'include'}); const t = await res.text(); return {s: res.status, b: t.slice(0,3000)}; }",
                    ep,
                )
                print(f"[{r['s']}] {ep}")
                print(f"    {r['b'][:1500]}", flush=True)
            except Exception as e:
                print(f"ERR {ep}: {e}", flush=True)

        # storage pode conter enderecos
        try:
            ls = gmgn.evaluate("() => JSON.stringify(Object.fromEntries(Object.entries(localStorage).filter(([k,v]) => /addr|wallet|pubkey|account/i.test(k+v)).slice(0,20)))")
            print(f"LOCALSTORAGE_MATCH: {ls[:2000]}", flush=True)
        except Exception as e:
            print(f"LS_ERR: {e}", flush=True)

    print("===FOMO: balances atualizados===", flush=True)
    if fomo:
        try:
            r = fomo.evaluate(
                "async () => { const res = await fetch('https://prod-api.fomo.family/v2/users', {credentials:'include'}); return await res.text(); }",
            )
            data = json.loads(r)
            ro = data.get("responseObject", {})
            print(f"id: {ro.get('id')}", flush=True)
            print(f"sol address: {ro.get('address')}", flush=True)
            print(f"evm address: {ro.get('evmAddress')}", flush=True)
        except Exception as e:
            print(f"FOMO_USERS_ERR: {e}", flush=True)

        uid = None
        try:
            uid = ro.get("id")
        except Exception:
            pass
        if uid:
            for ep in [
                f"https://prod-api.fomo.family/v2/users/{uid}/balances",
                f"https://prod-api.fomo.family/v2/users/{uid}/wallets",
                f"https://prod-api.fomo.family/v2/connectedWallets",
            ]:
                try:
                    r = fomo.evaluate(
                        "async (url) => { const res = await fetch(url, {credentials:'include'}); return await res.text(); }",
                        ep,
                    )
                    print(f"--- {ep.split('/v2/')[1]}", flush=True)
                    print(r[:1200], flush=True)
                except Exception as e:
                    print(f"ERR {ep}: {e}", flush=True)
