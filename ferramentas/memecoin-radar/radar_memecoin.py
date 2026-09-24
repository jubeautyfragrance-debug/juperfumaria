#!/usr/bin/env python3
"""
Radar de memecoins (Solana) usando a API gratuita da DexScreener.

Pré-filtro automático baseado no "Método Passo a Passo" e "Seleção Pesada"
do vault Obsidian. NÃO substitui as verificações manuais no GMGN (dev
holdings, bundle, phishing check) — gera apenas uma shortlist ranqueada.

Endpoints gratuitos usados (sem API key):
  - token-profiles/latest/v1  -> tokens/carteiras recentes
  - token-boosts/top/v1       -> tokens impulsionados (top boosts)
  - latest/dex/pairs/{chain}/{addrs} -> métricas completas do par

Uso:
  python radar_memecoin.py                 # modo padrão (solana, graduados)
  python radar_memecoin.py --min-liq 50000 --min-vol 200000 --min-buy-ratio 1.2
  python radar_memecoin.py --top 20 --new   # inclui tokens mto novos (zona rug)
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from datetime import datetime, timezone
from typing import Any

import requests

API = "https://api.dexscreener.com"
CHAIN = "solana"
SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "memecoin-radar/1.0"})


# ---------------------------------------------------------------------------
# Fetchers
# ---------------------------------------------------------------------------

def _get(path: str, params: dict | None = None) -> Any:
    try:
        r = SESSION.get(f"{API}/{path}", params=params, timeout=20)
        r.raise_for_status()
        return r.json()
    except requests.RequestException as exc:
        return {"error": f"GET {path}: {exc}"}


def get_candidates() -> list[dict]:
    """Junta perfis recentes + boosts, filtrando para a chain alvo.

    Obs.: o tokenAddress é base58 case-sensitive — a versão em minúsculas que
    aparece na URL do perfil NÃO funciona na API. Guardamos o address original.
    """
    seen: dict[str, dict] = {}

    def add(item: dict, source: str) -> None:
        if item.get("chainId") != CHAIN:
            return
        addr = item.get("tokenAddress")
        if not addr:
            return
        seen[addr] = {
            "token": addr,
            "url": item.get("url"),
            "source": source,
        }

    for ep, src in (
        ("token-profiles/latest/v1", "profiles"),
        ("token-boosts/top/v1", "boosts"),
    ):
        data = _get(ep)
        if isinstance(data, list):
            for item in data:
                add(item, src)
        elif isinstance(data, dict) and data.get("error"):
            print(f"[aviso] {ep}: {data['error']}", file=sys.stderr)

    return list(seen.values())


def fetch_token_data(token_addrs: list[str]) -> dict[str, dict]:
    """Busca métricas completas de até 30 tokens de uma vez (pares de cada).

    ``token_addrs`` devem ser os endereços originais (case-sensitive).
    """
    if not token_addrs:
        return {}
    path = f"latest/dex/tokens/{','.join(token_addrs)}"
    data = _get(path)
    pairs = data.get("pairs") if isinstance(data, dict) else None
    if not pairs:
        return {}
    # Para cada token, escolhe o par com o melhor liquidez+volume (o principal).
    best: dict[str, dict] = {}
    for p in pairs:
        token = (p.get("baseToken") or {}).get("address", "")
        if not token:
            continue
        key = token.lower()
        cur = best.get(key)
        if cur is None or _pair_size(p) > _pair_size(cur):
            best[key] = p
    return best


def _pair_size(pair: dict) -> float:
    return 10 * _liquidity(pair) + _volume_24(pair)


# ---------------------------------------------------------------------------
# Filtros e scoring
# ---------------------------------------------------------------------------

def _usd(v: Any, default: float = 0.0) -> float:
    if isinstance(v, dict):
        # Envelope DexScreener: {"usd": ..., "value": ...} ou {"h24": ...}
        for k in ("usd", "value", "h24"):
            if k in v:
                try:
                    return float(v[k] or 0.0)
                except (TypeError, ValueError):
                    continue
        return default
    if isinstance(v, (int, float)):
        return float(v)
    return default


def _liquidity(pair: dict) -> float:
    return _usd(pair.get("liquidity"))


def _volume_24(pair: dict) -> float:
    v = pair.get("volume")
    if isinstance(v, dict) and "h24" in v:
        try:
            return float(v["h24"] or 0.0)
        except (TypeError, ValueError):
            return 0.0
    return _usd(v)


def _market_cap(pair: dict) -> float:
    v = pair.get("fdv") if pair.get("fdv") else pair.get("marketCap")
    try:
        return float(v or 0.0)
    except (TypeError, ValueError):
        return 0.0


def age_hours(pair: dict) -> float | None:
    # pairCreatedAt vem em epoch MILLISECONDS do DexScreener.
    ts = pair.get("pairCreatedAt")
    if not ts:
        return None
    try:
        ts = float(ts)
    except (TypeError, ValueError):
        return None
    return max(0.0, (time.time() * 1000.0 - ts) / 3600e3)


def score_pair(
    pair: dict,
    min_liq: float,
    min_vol: float,
    min_buy_ratio: float,
    min_mc: float,
    max_mc: float,
    min_age_h: float,
    max_age_h: float,
) -> dict | None:
    """Aplica os filtros e devolve o par com um score composto, ou None."""
    liq = _liquidity(pair)
    vol24 = _volume_24(pair)
    txns = pair.get("txns") or {}
    buys = _usd(txns.get("m5", {}).get("buys")) + _usd(txns.get("h1", {}).get("buys"))
    sells = _usd(txns.get("m5", {}).get("sells")) + _usd(txns.get("h1", {}).get("sells"))
    buy_ratio = (buys / sells) if sells > 0 else float("inf")
    pc = pair.get("priceChange") or {}
    ch5, ch1h, ch6h, ch24h = pc.get("m5", 0), pc.get("h1", 0), pc.get("h6", 0), pc.get("h24", 0)
    mc = _market_cap(pair)

    age = age_hours(pair)
    flags: list[str] = []

    if liq < min_liq:
        flags.append(f"liq baixa ${liq:,.0f}")
    if vol24 < min_vol:
        flags.append(f"vol baixo ${vol24:,.0f}")
    if buy_ratio < min_buy_ratio:
        flags.append(f"buy/sell {buy_ratio:.2f}")
    if mc < min_mc:
        flags.append(f"MC baixo ${mc:,.0f}")
    if max_mc and mc > max_mc:
        flags.append(f"MC alto ${mc:,.0f}")
    if min_age_h and age is not None and age < min_age_h:
        flags.append(f"novo demais {age:.1f}h")
    if max_age_h and age is not None and age > max_age_h:
        flags.append(f"velho demais {age:.1f}h")

    if flags:
        # Motivo do descarte para debug
        return {"drop": " | ".join(flags)}

    b = pair.get("boosts") or {}
    score = (
        min(vol24 / min_vol, 3.0) * 2.0
        + min(liq / min_liq, 3.0)
        + min(ch5, 50) / 10 * 1.5
        + min(ch1h, 100) / 20
        + min(ch6h, 300) / 60
        + (1.5 if ch24h >= 0 else -2.0)
        + min(buy_ratio, 3.0) / 3 * 1.5
        + (0.5 if b else 0.0)
    )

    return {
        "base": pair.get("baseToken") or {},
        "pair": pair.get("pairAddress"),
        "url": pair.get("url") or f"https://dexscreener.com/{CHAIN}/{pair.get('pairAddress')}",
        "price": pair.get("priceUsd"),
        "liq_usd": liq,
        "vol24_usd": vol24,
        "fdv": mc,
        "buys": int(buys),
        "sells": int(sells),
        "buy_ratio": buy_ratio,
        "ch_m5": ch5,
        "ch_h1": ch1h,
        "ch_h6": ch6h,
        "ch_h24": ch24h,
        "age_h": age,
        "boosted": bool(b),
        "score": round(score, 2),
    }


def render(row: dict, idx: int) -> str:
    base = row["base"]
    name = base.get("name") or "?"
    sym = base.get("symbol") or "?"
    age = f"{row['age_h']:.1f}h" if row["age_h"] is not None else "?"
    boost = " [boost]" if row["boosted"] else ""
    return (
        f"{idx:>2}. {name} ({sym})  "
        f"| ${row['price'] or 0}"
        f" | MC ${row['fdv'] or 0:,.0f}"
        f" | Liq ${row['liq_usd']:,.0f}"
        f" | Vol24 ${row['vol24_usd']:,.0f}"
        f" | B/S {row['buy_ratio']:.2f} ({row['buys']}/{row['sells']})"
        f" | 5m {row['ch_m5']:+.1f}% 1h {row['ch_h1']:+.1f}% 6h {row['ch_h6']:+.1f}% 24h {row['ch_h24']:+.1f}%"
        f" | idade {age}"
        f" | score {row['score']}"
        f"{boost}\n      {row['url']}"
    )


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> int:
    ap = argparse.ArgumentParser(description="Radar de memecoins Solana (DexScreener)")
    ap.add_argument("--min-liq", type=float, default=30000)
    ap.add_argument("--min-vol", type=float, default=150000)
    ap.add_argument("--min-buy-ratio", type=float, default=1.0)
    ap.add_argument("--min-mc", type=float, default=70000, help="MC mínimo (padrão $70k)")
    ap.add_argument("--max-mc", type=float, default=15000000, help="MC máximo (padrão $15M)")
    ap.add_argument("--min-age-h", type=float, default=1.0, help="idade mínima em horas (padrão 1h)")
    ap.add_argument("--max-age-h", type=float, default=24.0, help="idade máxima em horas (padrão 24h)")
    ap.add_argument("--top", type=int, default=10)
    ap.add_argument("--new", action="store_true", help="inclui tokens com qualquer idade")
    ap.add_argument("--json", action="store_true", help="saída JSON do resultado final")
    args = ap.parse_args()

    print(f"[radar] {datetime.now(timezone.utc):%H:%M:%S UTC} — buscando candidatos "
          f"{CHAIN} (liquidez > ${args.min_liq:,.0f}, vol 24h > ${args.min_vol:,.0f}, "
          f"buy/sell > {args.min_buy_ratio}, MC ${args.min_mc:,.0f}-${args.max_mc:,.0f}, "
          f"idade {args.min_age_h:g}-{args.max_age_h:g}h)...", file=sys.stderr)

    candidates = get_candidates()
    if not candidates:
        print("[erro] nenhum candidato retornado. Verifique a API.", file=sys.stderr)
        return 1

    addr_to_candidate = {}
    for c in candidates:
        ta = c["token"].lower()
        addr_to_candidate.setdefault(ta, c)

    addrs = [c["token"] for c in candidates]
    tokens = fetch_token_data(addrs)
    print(f"[radar] {len(tokens)}/{len(addrs)} tokens carregados", file=sys.stderr)

    results: list[dict] = []
    dropped: dict[str, int] = {}

    if args.new:
        min_age, max_age = 0.0, 24 * 365.0
    else:
        min_age, max_age = args.min_age_h, args.max_age_h

    for ta, pair in tokens.items():
        r = score_pair(
            pair,
            args.min_liq,
            args.min_vol,
            args.min_buy_ratio,
            args.min_mc,
            args.max_mc,
            min_age,
            max_age,
        )
        if not r:
            continue
        if "drop" in r:
            dropped.setdefault(r["drop"], 0)
            dropped[r["drop"]] += 1
            continue
        r["candidate"] = addr_to_candidate.get(ta, {})
        results.append(r)

    results.sort(key=lambda x: x["score"], reverse=True)

    for k, v in sorted(dropped.items(), key=lambda x: -x[1]):
        print(f"[filtro] descartados {v}: {k}", file=sys.stderr)

    if args.json:
        print(json.dumps(results[: args.top], indent=2))
    else:
        print(f"\n=== TOP {min(len(results), args.top)} SOLANA (score composto) ===\n")
        for i, r in enumerate(results[: args.top], 1):
            print(render(r, i))
        print("\n[aviso] Radar é pré-filtro. Sempre valide no GMGN: dev holdings, "
              "bundle/liquidez, phishing check e distribuição de holders antes de comprar.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())