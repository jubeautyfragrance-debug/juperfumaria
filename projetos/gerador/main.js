// Gera as 74 ilustrações (uma por parágrafo) + galeria HTML
'use strict';
const fs = require('fs');
const path = require('path');

const c1 = require('./cenas1.js');
const c2 = require('./cenas2.js');
const c3 = require('./cenas3.js');
const cenas = c1.concat(c2).concat(c3);

const OUT = path.join(__dirname, '..', 'ilustracoes-historia');
fs.mkdirSync(OUT, { recursive: true });

const slugs = [];
cenas.forEach(function (cena, i) {
  const titulo = cena[0];
  const fn = cena[1];
  const n = i + 1;
  const slug = String(n).padStart(2, '0') + '-' + titulo
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const svg = fn();
  fs.writeFileSync(path.join(OUT, slug + '.svg'), svg, 'utf8');
  slugs.push({ n: n, titulo: titulo, slug: slug, svg: svg });
  console.log('OK ' + String(n).padStart(2, '0') + ' ' + titulo);
});

// ---------- Galeria HTML ----------
const cards = slugs.map(function (s) {
  return '<figure class="cena" data-n="' + s.n + '">' +
    '<figcaption><span class="num">' + String(s.n).padStart(2, '0') + '</span> ' + s.titulo + '</figcaption>' +
    s.svg +
    '<button onclick="baixarPNG(' + (s.n - 1) + ')">&#11015; Baixar PNG</button>' +
    '</figure>';
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>História em Imagens — 74 cenas</title>
<style>
  :root { --tinta:#2B2B2B; --bege:#EFE4C9; }
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:"Segoe UI", system-ui, Arial, sans-serif; background:#F5EEDD; color:var(--tinta); padding:28px 20px 60px; }
  header { max-width:1280px; margin:0 auto 24px; }
  header h1 { font-size:26px; margin-bottom:6px; }
  header p { color:#6b6252; font-size:14px; max-width:820px; }
  .grid { max-width:1280px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(380px, 1fr)); gap:20px; }
  .cena { background:#fff; border:3px solid var(--tinta); border-radius:16px; padding:14px; box-shadow:8px 8px 0 rgba(43,43,43,.12); display:flex; flex-direction:column; gap:10px; }
  .cena figcaption { font-weight:700; font-size:15px; display:flex; align-items:center; gap:8px; }
  .cena .num { background:var(--tinta); color:#fff; border-radius:8px; padding:2px 8px; font-size:13px; }
  .cena svg { width:100%; height:auto; border:2px solid var(--tinta); border-radius:10px; background:var(--bege); }
  .cena button { align-self:flex-start; font:inherit; font-weight:600; border:3px solid var(--tinta); border-radius:10px; padding:6px 12px; cursor:pointer; background:var(--tinta); color:#fff; transition:transform .08s; }
  .cena button:hover { transform:translateY(-2px); }
  @media (max-width:640px){ .grid{ grid-template-columns:1fr; } }
</style>
</head>
<body>
<header>
  <h1>&#128218; História em Imagens</h1>
  <p>74 ilustrações no estilo explicador educacional — uma por parágrafo. Clique em cada uma para baixar em PNG (1920×1280). Os arquivos SVG originais estão na mesma pasta.</p>
</header>
<main class="grid">
${cards}
</main>
<script>
function baixarPNG(i){
  var svgs = document.querySelectorAll('.cena svg');
  var svg = svgs[i];
  var dados = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
  var img = new Image();
  img.onload = function(){
    var escala = 2;
    var c = document.createElement('canvas');
    c.width = 960*escala; c.height = 640*escala;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#EFE4C9';
    ctx.fillRect(0,0,c.width,c.height);
    ctx.drawImage(img,0,0,c.width,c.height);
    var a = document.createElement('a');
    a.download = svg.getAttribute('aria-label').toLowerCase().replace(/[^a-z0-9]+/g,'-') + '.png';
    a.href = c.toDataURL('image/png');
    a.click();
  };
  img.src = dados;
}
</script>
</body>
</html>`;

fs.writeFileSync(path.join(OUT, 'galeria.html'), html, 'utf8');
console.log('\nGeradas ' + slugs.length + ' imagens em: ' + OUT);
