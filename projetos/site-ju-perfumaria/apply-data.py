# -*- coding: utf-8 -*-
"""Aplica preços e notas reais (dados.json) ao script.js, mantendo as demais
propriedades dos produtos (name, brand, origin, family, badge, top, bottom)."""

import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(HERE, ".data", "dados.json"), encoding="utf-8") as f:
    real = json.load(f)

with open(os.path.join(HERE, "script.js"), encoding="utf-8") as f:
    js = f.read()

changed = []
lines = js.split("\n")
for i, line in enumerate(lines):
    m = re.search(r'id:\s*"([^"]+)"', line)
    if not m:
        continue
    pid = m.group(1)
    if pid not in real:
        continue
    r = real[pid]
    new_line = line

    # atualiza price
    pm = re.search(r'price:\s*(\d+)', new_line)
    if pm and int(pm.group(1)) != r["price"]:
        new_line = new_line.replace(pm.group(0), "price: %d" % r["price"], 1)

    # atualiza notes (entre aspas, preservando aspas do JSON)
    nm = re.search(r'notes:\s*"([^"]*)"', new_line)
    if nm:
        note_txt = (r.get("notes") or "").replace("\\", "\\\\").replace('"', '\\"')
        new_line = new_line.replace(nm.group(0), 'notes: "%s"' % note_txt, 1)
    else:
        nm2 = re.search(r'notes:\s*(null|undefined)', new_line)
        if nm2:
            note_txt = (r.get("notes") or "").replace("\\", "\\\\").replace('"', '\\"')
            new_line = new_line.replace(nm2.group(0), 'notes: "%s"' % note_txt, 1)

    # atualiza oldPrice (preço cheio real, se conhecido)
    if r.get("oldPrice"):
        om = re.search(r'oldPrice:\s*(\d+|null|undefined)', new_line)
        if om:
            new_line = new_line.replace(om.group(0), "oldPrice: %d" % r["oldPrice"], 1)

    if new_line != line:
        lines[i] = new_line
        changed.append((pid, pm.group(1) if pm else "?", str(r["price"])))

with open(os.path.join(HERE, "script.js"), "w", encoding="utf-8", newline="\n") as f:
    f.write("\n".join(lines))

print("Atualizados %d produtos:" % len(changed))
for pid, old, new in changed:
    print("  %-24s %s -> %s" % (pid, old, new))
