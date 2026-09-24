# -*- coding: utf-8 -*-
"""Busca e baixa fotos reais dos produtos da Ju Perfumaria.

Fontes:
- Boticario: busca oficial via Jina Reader (CDN Cloudinary)
- Natura: paginas de categoria via Jina Reader (CDN Salesforce)
- Importados: Sephora BR via Jina Reader + Wikimedia Commons
Baixa para images/products/<id>.jpg. Roda de novo para continuar de onde parou.
"""

import json
import os
import re
import struct
import subprocess
import time
import urllib.parse

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images", "products")
os.makedirs(OUT, exist_ok=True)

# id, fonte, url de busca, tokens de conferencia, [tokens extras]
PRODUCTS = [
    # ---- Boticario (busca no site oficial) ----
    ("malbec", "boti", "https://www.boticario.com.br/busca/?q=malbec", ["malbec"]),
    ("malbec-gold", "boti", "https://www.boticario.com.br/busca/?q=malbec%20gold", ["malbec", "gold"]),
    ("malbec-magnetic", "boti", "https://www.boticario.com.br/busca/?q=malbec%20magnetic", ["malbec", "magnetic"], "malbec magnetic boticario eau de parfum"),
    ("the-blend", "boti", "https://www.boticario.com.br/busca/?q=the%20blend", ["blend"]),
    ("the-blend-cardamom", "boti", "https://www.boticario.com.br/busca/?q=the%20blend%20cardamom", ["blend", "cardamom"], "the blend cardamom boticario"),
    ("egeo", "boti", "https://www.boticario.com.br/busca/?q=egeo", ["egeo"]),
    ("egeo-dolce", "boti", "https://www.boticario.com.br/busca/?q=egeo%20dolce", ["egeo", "dolce"]),
    ("egeo-bomb-black", "boti", "https://www.boticario.com.br/busca/?q=egeo%20bomb%20black", ["egeo", "bomb"]),
    ("quasar-classic", "boti", "https://www.boticario.com.br/busca/?q=quasar", ["quasar"]),
    ("quasar-rush", "boti", "https://www.boticario.com.br/busca/?q=quasar%20rush", ["quasar", "rush"]),
    ("floratta-my-blue", "boti", "https://www.boticario.com.br/busca/?q=floratta%20my%20blue", ["floratta", "blue"]),
    ("floratta-red", "boti", "https://www.boticario.com.br/busca/?q=floratta%20red", ["floratta", "red"]),
    ("floratta-gold", "boti", "https://www.boticario.com.br/busca/?q=floratta%20gold", ["floratta", "gold"]),
    ("lily", "boti", "https://www.boticario.com.br/busca/?q=lily", ["lily"]),
    ("glamour", "boti", "https://www.boticario.com.br/busca/?q=glamour", ["glamour"]),
    ("zaad", "boti", "https://www.boticario.com.br/busca/?q=zaad", ["zaad"]),
    ("coffee-man", "boti", "https://www.boticario.com.br/busca/?q=coffee%20man", ["coffee"], "coffee man boticario"),
    # ---- Natura (categorias oficiais) ----
    ("essencial", "natura", "https://www.natura.com.br/c/essencial", ["essencial"]),
    ("essencial-sentir", "natura", "https://www.natura.com.br/c/essencial", ["essencial", "sentir"]),
    ("essencial-oud", "natura", "https://www.natura.com.br/c/essencial", ["essencial", "oud"]),
    ("essencial-unico", "natura", "https://www.natura.com.br/c/essencial", ["essencial", "unico"]),
    ("kaiak-aventura", "natura", "https://www.natura.com.br/c/kaiak", ["kaiak", "aventura"]),
    ("kaiak-urbe", "natura", "https://www.natura.com.br/c/kaiak", ["kaiak", "urbe"]),
    ("kaiak-radical", "natura", "https://www.natura.com.br/c/kaiak", ["kaiak", "radical"]),
    ("natura-homem-essence", "natura", "https://www.natura.com.br/c/natura-homem", ["homem", "essence"]),
    ("natura-homem-sagaz", "natura", "https://www.natura.com.br/c/natura-homem", ["homem", "sagaz"]),
    ("una-tuberosa", "natura", "https://www.natura.com.br/c/una", ["una", "tuberosa"]),
    ("ekos-maracuja", "natura", "https://www.natura.com.br/c/ekos", ["ekos", "maracuja"]),
    ("ekos-castanha", "natura", "https://www.natura.com.br/c/ekos", ["ekos", "castanha"]),
    ("luna", "natura", "https://www.natura.com.br/c/luna", ["luna"]),
    # ---- Importados (Sephora BR + Commons) ----
    ("jadore", "commons", "File:J\u2019adore Eau Lumiere.jpg", []),
    ("sauvage", "commons", "File:Dior Sauvage Verpackung.jpg", []),
    ("la-vie-est-belle", "amazon", "https://www.amazon.com.br/s?k=la+vie+est+belle+lancome+eua+de+parfum+perfume", [], None),
    ("good-girl", "amazon", "https://www.amazon.com.br/s?k=good+girl+carolina+herrera+eau+de+parfum", [], None),
    ("coco-mademoiselle", "commons", "File:Coco mademoiselle.jpg", []),
    ("libre", "amazon", "https://www.amazon.com.br/s?k=libre+ysl+eua+de+parfum", [], None),
    ("eros", "commons", "File:VersaceEros121.jpg", []),
    ("acqua-di-gio", "commons", "File:Acqua di Gio.jpg", []),
    ("1-million", "commons", "File:Paco Rabanne 1 Million Parfum - 2.jpg", []),
    ("scandal", "amazon", "https://www.amazon.com.br/s?k=scandal+jean+paul+gaultier+perfume", [], None),
]

BAD = ["logo", "icon", "banner", "favicon", "whatsapp", "pixel", "mainbanner",
       "vitrine", "brinde", "faixa", "menu_", "home-banner", "cabelo", "rosto-",
       "hidratante", "sabonete", "kit-", "desodorante", "perfume-masculino-", "corpo-"]
IMG_RE = re.compile(r"https://[^\"' ]+\.(?:jpg|jpeg|png|webp)", re.I)


def curl(url, headers=None, timeout=50):
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
    return curl("https://r.jina.ai/" + url,
                {"X-Return-Format": "html", "X-No-Cache": "true", "X-Timeout": "20"})


def pick_image(html, tokens, prod_id):
    best, best_score = None, -1
    for u in IMG_RE.findall(html):
        low = urllib.parse.unquote(u).lower()
        if any(b in low for b in BAD):
            continue
        if any(x in low for x in ["l_text", "stars_", "avalia", "free-shipping", "l_label"]):
            continue
        score = sum(2 for t in tokens if t in low)
        if prod_id in low:
            score += 3
        if "product" in low or "products" in low or "produto" in low:
            score += 2
        m = re.search(r"[,\/]w_(\d+)", low)
        if m:
            score += min(int(m.group(1)), 2000) / 1000.0
        if score > best_score:
            best, best_score = u, score
    return best if best_score > 0 else None


def rewrite(url):
    low = url.lower()
    if "cloudinary" in low and "/upload/" in url:
        return re.sub(r"/upload/[^?]*?/v1/", "/upload/w_700,f_auto,q_auto/v1/", url)
    if "m.media-amazon.com" in low:
        return re.sub(r"\._AC_[^./]*\.jpg", "._AC_UL1500_.jpg", url)
    if "demandware" in low or "na01.natura" in low or "sephora.com.br" in low:
        sep = "&" if "?" in url else "?"
        return url + sep + "sw=700&sh=700&sm=fit"
    return url


def jpeg_dims(path):
    try:
        with open(path, "rb") as f:
            d = f.read(64 * 1024)
        if d[:2] != b"\xff\xd8":
            return None, None
        i = 2
        while i < len(d) - 8:
            if d[i] != 0xFF:
                i += 1
                continue
            m = d[i + 1]
            if m in (0xC0, 0xC1, 0xC2, 0xC3):
                h, w = struct.unpack(">HH", d[i + 5:i + 9])
                return w, h
            i += 2 + struct.unpack(">H", d[i + 2:i + 4])[0]
    except Exception:
        return None, None
    return None, None


def commons_url(title):
    api = ("https://commons.wikimedia.org/w/api.php?action=query&titles="
           + urllib.parse.quote(title)
           + "&prop=imageinfo&iiprop=url&iiurlwidth=700&format=json")
    txt = curl(api, {"User-Agent": "JuPerfumariaBot/1.0 (contato@example.com)"})
    try:
        d = json.loads(txt)
    except Exception:
        return None
    pages = d.get("query", {}).get("pages", {})
    if "-1" in pages:  # arquivo nao existe
        return None
    for p in pages.values():
        ii = p.get("imageinfo", [{}])[0]
        u = ii.get("thumburl") or ii.get("url")
        if u:
            return u.split("?")[0]
    return None


COMMONS_FALLBACK = {
    "jadore": ["File:J\u2019adore Eau Lumiere.jpg"],
    "1-million": ["File:Paco Rabanne 1 Million Parfum - 2.jpg",
                   "File:Paco Rabanne 1 Million Parfum - 1.jpg",
                   "File:2023 Woda toaletowa Paco Rabanne 1 Million.jpg"],
    "sauvage": ["File:Dior Sauvage Verpackung.jpg", "File:Eau Sauvage Christian Dior.jpg"],
    "coco-mademoiselle": ["File:Coco mademoiselle.jpg", "File:Coco Mademoiselle 2001.jpg"],
    "eros": ["File:VersaceEros121.jpg"],
    "acqua-di-gio": ["File:Acqua di Gio.jpg", "File:Armani acqua di Gio M.jpg"],
}


def download(url, path):
    subprocess.run(["curl", "-sL", "--max-time", "40", "-o", path, url],
                   capture_output=True)
    if not os.path.exists(path):
        return 0
    return os.path.getsize(path)


ok, fail, skipped = [], [], []
cache = {}

for entry in PRODUCTS:
    prod_id, source, url, tokens = entry[0], entry[1], entry[2], entry[3]
    path = os.path.join(OUT, prod_id + ".jpg")
    if os.path.exists(path) and os.path.getsize(path) > 5000:
        skipped.append(prod_id)
        continue

    img = None
    if source == "commons":
        for title in [url] + COMMONS_FALLBACK.get(prod_id, []):
            img = commons_url(title)
            if img:
                break
    elif source == "amazon":
        html = jina(url)
        found = re.findall(r"https://m\.media-amazon\.com/images/I/[^\"' ]+\.jpg", html)
        if found:
            from collections import Counter
            img = Counter(found).most_common(1)[0][0]
    elif prod_id.startswith("kaiak-"):
        # pagina de categoria -> URL do produto -> pagina do produto
        cat = jina("https://www.natura.com.br/c/kaiak")
        m = re.search(r'"url":"(https://www\.natura\.com\.br/p/[^"]*' + re.escape(prod_id) + r'[^"]*)"', cat)
        if m:
            page = jina(m.group(1))
            img = pick_image(page, tokens, prod_id)
        else:
            print("  (kaiak: link de produto nao encontrado)")
    else:
        html = jina(url)
        img = pick_image(html, tokens, prod_id)

    # fallback: tenta a Amazon quando a fonte principal nao achou nada
    if img is None and source in ("boti", "natura") and len(entry) > 4 and entry[4]:
        q = urllib.parse.quote(entry[4])
        html = jina("https://www.amazon.com.br/s?k=" + q)
        found = re.findall(r"https://m\.media-amazon\.com/images/I/[^\"' ]+\.jpg", html)
        if found:
            from collections import Counter
            img = Counter(found).most_common(1)[0][0]
            print("  (fallback Amazon para %s)" % prod_id)

    if img:
        img = rewrite(img)
        size = download(img, path)
        w, h = jpeg_dims(path)
        if size > 5000 and w and w >= 300 and h >= w * 0.6:
            ok.append(prod_id)
            print("OK  %-22s %s (%d KB, %sx%s)" % (prod_id, img[:70], size // 1024, w, h))
        else:
            fail.append(prod_id)
            print("FALHOU %-22s (%s, %d KB, %sx%s)" % (prod_id, img[:60], size // 1024, w, h))
            if os.path.exists(path):
                os.remove(path)
    else:
        fail.append(prod_id)
        print("SEM IMAGEM %s" % prod_id)

    time.sleep(1)

print("\n== Resumo ==")
print("ok(%d): %s" % (len(ok), ", ".join(ok)))
print("fail(%d): %s" % (len(fail), ", ".join(fail)))
print("ja existiam(%d): %s" % (len(skipped), ", ".join(skipped)))
