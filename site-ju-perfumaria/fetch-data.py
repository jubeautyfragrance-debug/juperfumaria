# -*- coding: utf-8 -*-
"""Extrai preco e notas reais dos produtos (Boticario + Natura).

- Boticario: busca oficial -> pagina do produto -> preco + piramide olfativa
- Natura: pagina de categoria -> pagina do produto -> preco
Roda de novo para continuar de onde parou. Resultado em .data/dados.json
"""

import json
import os
import re
import subprocess
import time
import urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, ".data")
os.makedirs(DATA, exist_ok=True)

RESULT = os.path.join(DATA, "dados.json")
if os.path.exists(RESULT):
    with open(RESULT, encoding="utf-8") as f:
        result = json.load(f)
else:
    result = {}

# (id, busca_boticario, tokens_url, busca_natura, categoria_natura, slug_natura)
PRODUCTS = [
    # ---------------- Boticario ----------------
    ("malbec", "malbec", ["malbec"], None, None, None),
    ("malbec-gold", "malbec gold", ["malbec", "gold"], None, None, None),
    ("malbec-magnetic", "malbec magnetic", ["malbec", "magnetic"], None, None, None),
    ("the-blend", "the blend", ["blend"], None, None, None),
    ("the-blend-cardamom", "the blend cardamom", ["blend", "cardamom"], None, None, None),
    ("egeo", "egeo", ["egeo"], None, None, None),
    ("egeo-dolce", "egeo dolce", ["egeo", "dolce"], None, None, None),
    ("egeo-bomb-black", "egeo bomb black", ["egeo", "bomb"], None, None, None),
    ("quasar-classic", "quasar", ["quasar"], None, None, None),
    ("quasar-rush", "quasar rush", ["quasar", "rush"], None, None, None),
    ("floratta-my-blue", "floratta my blue", ["floratta", "blue"], None, None, None),
    ("floratta-red", "floratta red", ["floratta", "red"], None, None, None),
    ("floratta-gold", "floratta gold", ["floratta", "gold"], None, None, None),
    ("lily", "lily", ["lily"], None, None, None),
    ("glamour", "glamour", ["glamour"], None, None, None),
    ("zaad", "zaad", ["zaad"], None, None, None),
    ("coffee-man", "coffee man", ["coffee"], None, None, None),
    # ---------------- Natura ----------------
    ("essencial", None, None, "https://www.natura.com.br/c/essencial", "essencial", None),
    ("essencial-sentir", None, None, "https://www.natura.com.br/c/essencial", "sentir", None),
    ("essencial-oud", None, None, "https://www.natura.com.br/c/essencial", "oud", None),
    ("essencial-unico", None, None, "https://www.natura.com.br/c/essencial", "unico", None),
    ("kaiak-aventura", None, None, "https://www.natura.com.br/c/kaiak", "kaiak-aventura", None),
    ("kaiak-urbe", None, None, "https://www.natura.com.br/c/kaiak", "kaiak-urbe", None),
    ("kaiak-radical", None, None, None, None, "https://www.natura.com.br/p/desodorante-colonia-kaiak-aventura-intensa-masculino-100-ml/natbra-171117"),
    ("natura-homem-essence", None, None, "https://www.natura.com.br/c/natura-homem", "homem-essence", None),
    ("natura-homem-sagaz", None, None, "https://www.natura.com.br/c/natura-homem", "homem-sagaz", None),
    ("una-tuberosa", None, None, None, None, "https://www.natura.com.br/p/una-senses-deo-parfum-75-ml/NATBRA-56161"),
    ("ekos-maracuja", None, None, None, None, "https://www.natura.com.br/p/ekos-frescor-maracuja-150-ml/NATBRA-73564"),
    ("ekos-castanha", None, None, None, None, "https://www.natura.com.br/p/desodorante-colonia-frescor-ekos-castanha-75-ml/NATBRA-159924"),
    ("luna", None, None, "https://www.natura.com.br/c/luna", "luna", None),
]

JINA_HDRS = {"X-Return-Format": "html", "X-No-Cache": "true", "X-Timeout": "20"}


def curl(url, headers=None, timeout=55):
    cmd = ["curl", "-sL", "--max-time", str(timeout)]
    for k, v in (headers or {}).items():
        cmd += ["-H", "%s: %s" % (k, v)]
    cmd.append(url)
    try:
        r = subprocess.run(cmd, capture_output=True, timeout=timeout + 10)
        return r.stdout.decode("utf-8", errors="replace") or ""
    except Exception:
        return ""


def jina(url):
    return curl("https://r.jina.ai/" + url, JINA_HDRS)


def price_from(html):
    # JSON-LD do produto principal
    for m in re.finditer(r'"@type"\s*:\s*"Product"', html):
        seg = html[m.start():m.start() + 30000]
        pm = re.search(r'"price"\s*:\s*"?([0-9]+(?:\.[0-9]+)?)"?', seg)
        if pm:
            try:
                return int(round(float(pm.group(1)) * 100))
            except Exception:
                pass
    # fallback: maior preco com decimal e >= R$ 40
    vals = [
        int(round(float(v) * 100))
        for v in re.findall(r'"price"\s*:\s*"?([0-9]+\.[0-9]+)"?', html)
    ]
    vals = [v for v in vals if v >= 4000]
    return max(vals) if vals else None


def clean_notes(s):
    s = re.sub(r"<[^>]+>", " ", s)
    s = re.sub(r"&[a-z]+;", " ", s)
    return re.sub(r"\s+", " ", s).strip(" .\n")


def pyramid_from(html):
    # limita a regiao da pirâmide olfativa (evita notas de produtos relacionados)
    start = html.find('olfactive-pyramid-region')
    if start == -1:
        start = html.find('Pirâmide Olfativa')
    if start == -1:
        start = html.find('pirâmide olfativa')
    region = html[start:start + 8000] if start != -1 else html
    m = re.search(r"Topo:\s*(.*?)\s*Corpo:\s*(.*?)\s*Fundo:\s*(.*?)(?=<|$)", region, re.I | re.S)
    if not m:
        return None
    top = clean_notes(m.group(1))
    heart = clean_notes(m.group(2))
    base = clean_notes(m.group(3))
    if not top or not base:
        return None
    return "Notas: " + top + " · " + heart + " · " + base


def family_from(html):
    m = re.search(r"Fam[ií]lia Olfativa:\s*([^<\"&]{2,40})", html, re.I)
    if m:
        return m.group(1).strip()
    return None


def nat_notes_from(html):
    # Natura: "notas de topo" ... <body>valor</body> (formato aninhado)
    m = re.findall(r"notas de (topo|corpo|fundo).*?<body>([^<]{3,150})</body>", html, re.I | re.S)
    if len(m) >= 3:
        parts = {k: clean_notes(v) for k, v in m}
        if parts.get("topo") and parts.get("fundo"):
            return "Notas: " + parts["topo"] + " · " + parts["corpo"] + " · " + parts["fundo"]
    # fallback: descricao da fragrancia em texto
    m = re.search(r"[Ff]ragr[âa]ncia:</strong></p>\s*<p>(.*?)(?:</p>|<strong>|\n\n)", html, re.S)
    if not m:
        m = re.search(r"[Ff]ragr[âa]ncia:</strong>\s*(.*?)(?:</p>|<strong>|\n\n)", html, re.S)
    if not m:
        m = re.search(r"[Ff]ragr[âa]ncia:([^<]{20,600}?)(?:<|$)", html, re.S)
    if not m:
        return None
    t = clean_notes(m.group(1))
    if len(t) < 25:
        return None
    return "Fragrância: " + t[:420]


BOTI_EXCLUDE = {
    "malbec": ["gold", "magnetic", "flame", "black", "club", "intense", "leather", "combo", "kit", "refil", "body", "loção", "suflê"],
    "malbec-gold": ["magnetic", "flame", "black", "club", "combo", "kit", "refil", "body", "loção", "suflê"],
    "malbec-magnetic": ["gold", "flame", "black", "club", "combo", "kit", "refil", "body", "loção", "suflê"],
    "the-blend": ["cardamom", "vetiver", "patchouli", "cedar", "amber", "saffron", "combo", "kit", "refil", "loção", "body"],
    "the-blend-cardamom": ["vetiver", "patchouli", "cedar", "amber", "saffron", "combo", "kit", "refil", "loção", "body"],
    "egeo": ["dolce", "choc", "spicy", "bomb", "vanilla", "high", "fantasy", "combo", "kit", "refil", "body", "loção", "suflê", "vibe"],
    "egeo-dolce": ["choc", "spicy", "bomb", "vanilla", "high", "combo", "kit", "refil", "body", "loção", "suflê", "vibe"],
    "egeo-bomb-black": ["dolce", "choc", "spicy", "vanilla", "high", "combo", "kit", "refil", "body", "loção", "suflê", "vibe"],
    "quasar-classic": ["rush", "ice", "midnight", "club", "evolution", "combo", "kit", "refil", "body", "loção"],
    "quasar-rush": ["ice", "midnight", "club", "classic", "evolution", "combo", "kit", "refil", "body", "loção"],
    "floratta-my-blue": ["red", "gold", "black", "supreme", "combo", "kit", "refil", "body", "loção"],
    "floratta-red": ["my blue", "gold", "black", "supreme", "combo", "kit", "refil", "body", "loção"],
    "floratta-gold": ["my blue", "red", "black", "supreme", "combo", "kit", "refil", "body", "loção"],
    "lily": ["solei", "eau de lily", "combo", "kit", "refil", "body", "loção", "suflê"],
    "glamour": ["intense", "combo", "kit", "refil", "body", "loção", "suflê"],
    "zaad": ["combo", "kit", "refil", "body", "loção", "suflê"],
    "coffee-man": ["combo", "kit", "refil", "body", "loção", "suflê"],
}

GOOD_TERMS = ["desodorante colônia", "eau de parfum", "extrait", "perfume"]


def find_boti_url(html, tokens, pid):
    best, best_score = None, -1
    best_price = None
    excludes = BOTI_EXCLUDE.get(pid, [])
    pairs = re.findall(r'<a[^>]+href="(https://www\.boticario\.com\.br/[a-z0-9-]+/)"[^>]*>(.*?)</a>', html, re.S)
    for u, t in pairs:
        if "/busca" in u or "combo-" in u or "kit-" in u:
            continue
        t2 = re.sub(r"<[^>]+>", " ", t)
        t2 = re.sub(r"&[a-z]+;", " ", t2)
        low = t2.lower()
        score = sum(1 for tok in tokens if tok in low)
        if score <= 0:
            continue
        if any(x in low for x in excludes):
            continue
        if any(x in low for x in GOOD_TERMS):
            score += 2
        m = re.search(r"por\s*r\$\s*([0-9.,]+)", low)
        price = None
        if m:
            price = int(m.group(1).replace(".", "").replace(",", ""))
            score += 1
        if score > best_score:
            best, best_score, best_price = u, score, price
    return best, best_price


def price_from_text(html, pid):
    url, price = find_boti_url(html, BOTI_TOKENS.get(pid, []), pid)
    return price


NAT_EXCLUDE = {
    "essencial": ["oud"],
    "kaiak-radical": [],
    "ekos-maracuja": ["kit", "sabonete", "creme", "hidratante", "banho", "barra", "mãos", "maos", "óleo", "oleo"],
    "ekos-castanha": ["kit", "sabonete", "creme", "hidratante", "banho", "barra", "mãos", "maos", "óleo", "oleo"],
    "luna": ["nuit"],
    "una-tuberosa": ["velas", "difusor", "casa"],
    "natura-homem-essence": ["sagaz"],
    "natura-homem-sagaz": ["essence"],
}


def find_natura_url(html, slug, pid):
    excludes = NAT_EXCLUDE.get(pid, [])
    pat = '"url":"(https://www\\.natura\\.com\\.br/p/[^"]*)"'
    best, best_score = None, -1
    for m in re.finditer(pat, html):
        u = m.group(1)
        low = urllib.parse.unquote(u).lower()
        if slug not in low:
            continue
        if any(x in low for x in excludes):
            continue
        score = 1
        if "colônia" in low or "perfume" in low or "deo parfum" in low:
            score += 1
        if len(low) < 90:
            score += 1
        if score > best_score:
            best, best_score = u, score
    return best


for pid, bq, btokens, natcat, nslug, direct in PRODUCTS:
    if pid in result and result[pid].get("price"):
        continue

    entry = {"id": pid}
    html = None

    if bq is not None:
        cache = os.path.join(DATA, "boti-search-%s.html" % pid)
        if os.path.exists(cache):
            html = open(cache, encoding="utf-8", errors="replace").read()
        else:
            html = jina("https://www.boticario.com.br/busca/?q=" + urllib.parse.quote(bq))
            open(cache, "w", encoding="utf-8").write(html)
            time.sleep(1)
        url, price_txt = find_boti_url(html, btokens, pid)
        if url:
            pcache = os.path.join(DATA, "boti-page-%s.html" % pid)
            if os.path.exists(pcache):
                page = open(pcache, encoding="utf-8", errors="replace").read()
            else:
                page = jina(url)
                open(pcache, "w", encoding="utf-8").write(page)
                time.sleep(1)
            entry["price"] = price_txt or price_from(page)
            entry["notes"] = pyramid_from(page)
            entry["family"] = family_from(page)
            entry["url"] = url
            print("BOTI %-22s preco=%s notas=%s (%s)" % (pid, entry["price"], bool(entry["notes"]), url.split("/")[-2][:38]))
        else:
            print("BOTI %-22s URL nao encontrada" % pid)

    elif natcat is not None or direct is not None:
        if direct:
            url = direct
        else:
            cache = os.path.join(DATA, "nat-cat-%s.html" % pid.split("-")[0])
            if os.path.exists(cache):
                cat = open(cache, encoding="utf-8", errors="replace").read()
            else:
                cat = jina(natcat)
                open(cache, "w", encoding="utf-8").write(cat)
                time.sleep(1)
            url = find_natura_url(cat, nslug, pid)
        if url:
            pcache = os.path.join(DATA, "nat-page-%s.html" % pid)
            if os.path.exists(pcache):
                page = open(pcache, encoding="utf-8", errors="replace").read()
            else:
                page = jina(url)
                open(pcache, "w", encoding="utf-8").write(page)
                time.sleep(1)
            entry["price"] = price_from(page)
            entry["notes"] = nat_notes_from(page)
            entry["family"] = family_from(page)
            entry["url"] = url
            print("NAT  %-22s preco=%s notas=%s (%s)" % (pid, entry["price"], bool(entry["notes"]), url.split("/")[-2][:44]))
        else:
            print("NAT  %-22s URL nao encontrada" % pid)

    if entry.get("price"):
        result[pid] = {**result.get(pid, {}), **entry}
        with open(RESULT, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)

print("\n== Resumo ==")
for pid, _, _, _, _, _ in PRODUCTS:
    r = result.get(pid, {})
    if r.get("price"):
        print("  %-22s R$ %.2f  %s" % (pid, r["price"] / 100, (r.get("notes") or "")[:60]))
    else:
        print("  %-22s FALTOU" % pid)
