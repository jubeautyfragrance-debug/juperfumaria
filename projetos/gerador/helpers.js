// Biblioteca de desenho para as ilustrações no estilo "explicador educacional"
// (MinuteEarth / Casually Explained): fundo bege, cores chapadas, traço preto médio.
'use strict';

const INK = '#2B2B2B';
const BG = '#EFE4C9';
const BRANCO = '#FFFFFF';
const VERDE = '#7BA05B';
const AZUL = '#4A7BA6';
const AMARELO = '#F2C14E';
const VERMELHO = '#D96A5E';

function base(inner, titulo) {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640" width="960" height="640" role="img" aria-label="' + titulo + '">' +
    '<rect x="0" y="0" width="960" height="640" fill="' + BG + '"/>' + inner + '</svg>';
}

function chao(y) {
  y = y || 540;
  return '<path d="M 90 ' + y + ' H 870" stroke="' + INK + '" stroke-width="8" stroke-linecap="round" fill="none"/>';
}

// ---------- Personagem (stick figure) ----------
// o = { x, y (centro da cabeça), r (raio), shirt, cap, hair, boca, olhos, tilt, brE, brD, perna }
function fig(o) {
  const x = o.x || 300, y = o.y || 260, r = o.r || 55;
  const s = r / 55;
  const ombroY = y + r + 20 * s;
  const quadrilY = y + r + 98 * s;
  const peY = y + r + 198 * s;
  const boca = o.boca || 'smile';
  const olhos = o.olhos || 'normal';
  let g = '<g transform="rotate(' + (o.tilt || 0) + ' ' + x + ' ' + y + ')">';

  // pernas
  if (o.perna === 'junta') {
    g += '<path d="M ' + x + ' ' + quadrilY + ' L ' + x + ' ' + peY + '" stroke="' + INK + '" stroke-width="' + (8 * s) + '" stroke-linecap="round"/>' +
      '<circle cx="' + x + '" cy="' + (peY + 3 * s) + '" r="' + (9 * s) + '" fill="' + INK + '"/>';
  } else {
    g += '<path d="M ' + x + ' ' + quadrilY + ' L ' + (x - 32 * s) + ' ' + peY + ' M ' + x + ' ' + quadrilY + ' L ' + (x + 32 * s) + ' ' + peY + '" stroke="' + INK + '" stroke-width="' + (8 * s) + '" stroke-linecap="round"/>' +
      '<circle cx="' + (x - 32 * s) + '" cy="' + (peY + 3 * s) + '" r="' + (9 * s) + '" fill="' + INK + '"/>' +
      '<circle cx="' + (x + 32 * s) + '" cy="' + (peY + 3 * s) + '" r="' + (9 * s) + '" fill="' + INK + '"/>';
  }

  // camiseta
  if (o.shirt) {
    g += '<path d="M ' + (x - 42 * s) + ' ' + (ombroY - 2) + ' L ' + (x + 42 * s) + ' ' + (ombroY - 2) +
      ' L ' + (x + 36 * s) + ' ' + (quadrilY - 16) + ' L ' + (x - 36 * s) + ' ' + (quadrilY - 16) +
      ' Z" fill="' + o.shirt + '" stroke="' + INK + '" stroke-width="' + (8 * s) + '" stroke-linejoin="round"/>';
  }

  // braços
  const braco = function (side, v) {
    const sx = x + (side === 'D' ? 1 : -1) * 40 * s;
    const sy = ombroY + 6;
    let dx, dy;
    if (v) { dx = v[0]; dy = v[1]; }
    else { dx = (side === 'D' ? 1 : -1) * 18 * s; dy = 74 * s; }
    return '<path d="M ' + sx + ' ' + sy + ' L ' + (sx + dx) + ' ' + (sy + dy) + '" stroke="' + INK + '" stroke-width="' + (8 * s) + '" stroke-linecap="round"/>' +
      '<circle cx="' + (sx + dx) + '" cy="' + (sy + dy) + '" r="' + (9 * s) + '" fill="' + INK + '"/>';
  };
  g += braco('E', o.brE) + braco('D', o.brD);

  // cabeça
  g += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="' + (8 * s) + '"/>';

  // olhos
  const ex = 20 * s, ey = 10 * s, er = 15 * s;
  if (olhos === 'x') {
    g += '<path d="M ' + (x - ex - 8 * s) + ' ' + (y - ey - 8 * s) + ' l ' + (16 * s) + ' ' + (16 * s) +
      ' M ' + (x - ex + 8 * s) + ' ' + (y - ey - 8 * s) + ' l ' + (-16 * s) + ' ' + (16 * s) +
      ' M ' + (x + ex - 8 * s) + ' ' + (y - ey - 8 * s) + ' l ' + (16 * s) + ' ' + (16 * s) +
      ' M ' + (x + ex + 8 * s) + ' ' + (y - ey - 8 * s) + ' l ' + (-16 * s) + ' ' + (16 * s) +
      '" stroke="' + INK + '" stroke-width="' + (6 * s) + '" stroke-linecap="round" fill="none"/>';
  } else if (olhos === 'fechado') {
    g += '<path d="M ' + (x - ex - 8 * s) + ' ' + (y - ey + 4 * s) + ' Q ' + (x - ex) + ' ' + (y - ey - 8 * s) + ' ' + (x - ex + 8 * s) + ' ' + (y - ey + 4 * s) +
      ' M ' + (x + ex - 8 * s) + ' ' + (y - ey + 4 * s) + ' Q ' + (x + ex) + ' ' + (y - ey - 8 * s) + ' ' + (x + ex + 8 * s) + ' ' + (y - ey + 4 * s) +
      '" stroke="' + INK + '" stroke-width="' + (6 * s) + '" stroke-linecap="round" fill="none"/>';
  } else {
    g += '<circle cx="' + (x - ex) + '" cy="' + (y - ey) + '" r="' + (er * s) + '" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="' + (6 * s) + '"/>' +
      '<circle cx="' + (x + ex) + '" cy="' + (y - ey) + '" r="' + (er * s) + '" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="' + (6 * s) + '"/>' +
      '<circle cx="' + (x - ex) + '" cy="' + (y - ey) + '" r="' + (4.5 * s) + '" fill="' + INK + '"/>' +
      '<circle cx="' + (x + ex) + '" cy="' + (y - ey) + '" r="' + (4.5 * s) + '" fill="' + INK + '"/>';
  }

  // boca
  if (boca === 'sad') {
    g += '<path d="M ' + (x - 10 * s) + ' ' + (y + 26 * s) + ' Q ' + x + ' ' + (y + 14 * s) + ' ' + (x + 10 * s) + ' ' + (y + 26 * s) + '" stroke="' + INK + '" stroke-width="' + (6 * s) + '" stroke-linecap="round" fill="none"/>';
  } else if (boca === 'flat') {
    g += '<path d="M ' + (x - 10 * s) + ' ' + (y + 22 * s) + ' H ' + (x + 10 * s) + '" stroke="' + INK + '" stroke-width="' + (6 * s) + '" stroke-linecap="round"/>';
  } else if (boca === 'open') {
    g += '<circle cx="' + x + '" cy="' + (y + 24 * s) + '" r="' + (7 * s) + '" fill="' + INK + '"/>';
  } else if (boca === 'zigzag') {
    g += '<path d="M ' + (x - 12 * s) + ' ' + (y + 20 * s) + ' l ' + (4 * s) + ' ' + (6 * s) + ' ' + (4 * s) + ' ' + (-6 * s) + ' ' + (4 * s) + ' ' + (6 * s) + ' ' + (4 * s) + ' ' + (-6 * s) + ' ' + (4 * s) + ' ' + (6 * s) + '" stroke="' + INK + '" stroke-width="' + (6 * s) + '" stroke-linecap="round" fill="none"/>';
  } else {
    g += '<path d="M ' + (x - 10 * s) + ' ' + (y + 18 * s) + ' Q ' + x + ' ' + (y + 30 * s) + ' ' + (x + 10 * s) + ' ' + (y + 18 * s) + '" stroke="' + INK + '" stroke-width="' + (6 * s) + '" stroke-linecap="round" fill="none"/>';
  }

  // boné
  if (o.cap) {
    const dx = r * 0.643, dy = r * 0.766, ar = r * 0.764;
    g += '<path d="M ' + (x - dx) + ' ' + (y - dy) + ' A ' + ar + ' ' + ar + ' 0 0 1 ' + (x + dx) + ' ' + (y - dy) + ' Z" fill="' + o.cap + '" stroke="' + INK + '" stroke-width="' + (8 * s) + '" stroke-linejoin="round"/>' +
      '<circle cx="' + x + '" cy="' + (y - r * 1.12) + '" r="' + (5.5 * s) + '" fill="' + INK + '"/>';
  }

  // topete
  if (o.hair) {
    g += '<path d="M ' + (x - 20 * s) + ' ' + (y - r + 6 * s) + ' l ' + (-5 * s) + ' ' + (-16 * s) +
      ' M ' + (x - 4 * s) + ' ' + (y - r + 2 * s) + ' l ' + (-2 * s) + ' ' + (-18 * s) +
      ' M ' + (x + 14 * s) + ' ' + (y - r + 6 * s) + ' l ' + (5 * s) + ' ' + (-14 * s) +
      '" stroke="' + INK + '" stroke-width="' + (6 * s) + '" stroke-linecap="round" fill="none"/>';
  }

  return g + '</g>';
}

// ---------- Balão de fala ----------
function bolha(x, y, w, h, cor, tail, rx) {
  const r = rx || Math.min(30, h * 0.26);
  let s = '<path d="M ' + tail[0][0] + ' ' + tail[0][1] + ' L ' + tail[1][0] + ' ' + tail[1][1] + ' L ' + tail[2][0] + ' ' + tail[2][1] + ' Z" fill="' + cor + '" stroke="' + INK + '" stroke-width="8" stroke-linejoin="round"/>';
  s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + r + '" fill="' + cor + '" stroke="' + INK + '" stroke-width="8"/>';
  return s;
}

function pontinhos(cx, cy, dx, r) {
  r = r || 7; dx = dx || 26;
  return '<circle cx="' + (cx - dx) + '" cy="' + cy + '" r="' + r + '" fill="' + INK + '"/>' +
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + INK + '"/>' +
    '<circle cx="' + (cx + dx) + '" cy="' + cy + '" r="' + r + '" fill="' + INK + '"/>';
}

// ---------- Símbolos e props ----------
function coracao(x, y, s, cor) {
  cor = cor || VERMELHO;
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M 0 24 C -12 14 -22 5 -22 -5 C -22 -13 -17 -20 -9 -20 C -5 -20 -2 -18 0 -15 C 2 -18 5 -20 9 -20 C 17 -20 22 -13 22 -5 C 22 5 12 14 0 24 Z" fill="' + cor + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/></g>';
}

function raio(x, y) {
  return '<path d="M ' + x + ' ' + (y - 70) + ' L ' + (x + 10) + ' ' + (y - 30) + ' L ' + (x + 2) + ' ' + (y - 30) + ' L ' + (x + 14) + ' ' + y + ' L ' + (x - 14) + ' ' + (y - 26) + ' L ' + (x - 4) + ' ' + (y - 26) + ' Z" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>';
}

function pq(x, y, s) {
  s = s || 1;
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M -7 -18 C -15 -26 7 -30 8 -19 C 9 -13 3 -9 0 -6" fill="none" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/><circle cx="0" cy="6" r="4" fill="' + INK + '"/></g>';
}

function exc(x, y, s) {
  s = s || 1;
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="-5" y="-26" width="10" height="32" rx="5" fill="' + INK + '"/><circle cy="13" r="5.5" fill="' + INK + '"/></g>';
}

function cerebro(x, y, s, cor, destacado) {
  s = s || 1; cor = cor || BRANCO;
  let p = '<path d="M -38 -8 C -42 -28 -24 -36 -9 -30 C -5 -40 13 -40 17 -30 C 32 -36 46 -28 42 -13 C 50 -3 44 10 32 12 C 36 25 21 31 11 25 C 7 33 -9 33 -13 25 C -23 31 -36 25 -32 12 C -42 10 -46 -3 -38 -8 Z" fill="' + cor + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>';
  const det = '<path d="M -14 2 C -4 -6 8 -6 16 2 M -16 10 C -6 3 6 3 14 10" fill="none" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>';
  const stem = '<path d="M -6 26 L 6 26 L 4 38 L -4 38 Z" fill="' + cor + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>';
  if (destacado) {
    p = '<path d="M -38 -8 C -42 -28 -24 -36 -9 -30 C -5 -40 13 -40 17 -30 C 32 -36 46 -28 42 -13 C 50 -3 44 10 32 12 C 36 25 21 31 11 25 C 7 33 -9 33 -13 25 C -23 31 -36 25 -32 12 C -42 10 -46 -3 -38 -8 Z" fill="' + cor + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
      '<ellipse cx="2" cy="-6" rx="16" ry="12" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="5"/>';
  }
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + p + det + stem + '</g>';
}

function osso(x, y, a, s) {
  a = a || 0; s = s || 1;
  return '<g transform="translate(' + x + ' ' + y + ') rotate(' + a + ') scale(' + s + ')"><circle cx="-26" cy="0" r="10" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/><line x1="-20" y1="0" x2="20" y2="0" stroke="' + INK + '" stroke-width="8"/><circle cx="26" cy="0" r="10" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/></g>';
}

function pilula(x, y) {
  return '<g transform="translate(' + x + ' ' + y + ') rotate(45)"><ellipse rx="16" ry="8" fill="' + VERDE + '" stroke="' + INK + '" stroke-width="6"/><path d="M 0 -8 L 0 8" stroke="' + INK + '" stroke-width="5"/></g>';
}

function garrafa(x, y) {
  return '<g><rect x="' + (x - 22) + '" y="' + (y - 10) + '" width="44" height="46" rx="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<rect x="' + (x - 12) + '" y="' + (y - 24) + '" width="24" height="16" rx="4" fill="' + VERDE + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M ' + (x - 10) + ' ' + (y + 8) + ' h 20 M ' + (x - 10) + ' ' + (y + 18) + ' h 14" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>';
}

function tumulo(x, y) {
  return '<g><path d="M ' + (x - 26) + ' ' + y + ' L ' + (x - 26) + ' ' + (y - 36) + ' A 26 26 0 0 1 ' + (x + 26) + ' ' + (y - 36) + ' L ' + (x + 26) + ' ' + y + ' Z" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
    '<line x1="' + (x - 10) + '" y1="' + (y - 18) + '" x2="' + (x + 10) + '" y2="' + (y - 18) + '" stroke="' + INK + '" stroke-width="6"/><line x1="' + x + '" y1="' + (y - 28) + '" x2="' + x + '" y2="' + (y - 8) + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M ' + (x - 42) + ' ' + (y + 8) + ' q 4 -8 8 0 q 4 -8 8 0" stroke="' + INK + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    '<path d="M ' + (x + 28) + ' ' + (y + 8) + ' q 4 -8 8 0 q 4 -8 8 0" stroke="' + INK + '" stroke-width="6" fill="none" stroke-linecap="round"/></g>';
}

function sol(x, y, r) {
  r = r || 34;
  let s = '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="7"/>';
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    s += '<line x1="' + (x + Math.cos(a) * (r + 12)) + '" y1="' + (y + Math.sin(a) * (r + 12)) + '" x2="' + (x + Math.cos(a) * (r + 26)) + '" y2="' + (y + Math.sin(a) * (r + 26)) + '" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>';
  }
  return s;
}

function arvore(x, y) {
  return '<g><path d="M ' + x + ' ' + y + ' L ' + (x - 6) + ' ' + (y - 70) + ' L ' + (x + 6) + ' ' + (y - 70) + ' Z" fill="' + VERDE + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
    '<ellipse cx="' + x + '" cy="' + (y - 78) + '" rx="52" ry="15" fill="' + VERDE + '" stroke="' + INK + '" stroke-width="7"/></g>';
}

function fogo(x, y) {
  return '<g><line x1="' + (x - 16) + '" y1="' + y + '" x2="' + (x - 4) + '" y2="' + y + '" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/>' +
    '<line x1="' + (x - 14) + '" y1="' + y + '" x2="' + (x - 2) + '" y2="' + y + '" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M ' + x + ' ' + (y - 4) + ' C ' + (x - 16) + ' ' + (y - 22) + ' ' + (x - 10) + ' ' + (y - 40) + ' ' + x + ' ' + (y - 46) + ' C ' + (x + 10) + ' ' + (y - 40) + ' ' + (x + 16) + ' ' + (y - 22) + ' ' + x + ' ' + (y - 4) + ' Z" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>' +
    '<path d="M ' + x + ' ' + (y - 12) + ' C ' + (x - 7) + ' ' + (y - 24) + ' ' + (x - 4) + ' ' + (y - 34) + ' ' + x + ' ' + (y - 38) + ' C ' + (x + 4) + ' ' + (y - 34) + ' ' + (x + 7) + ' ' + (y - 24) + ' ' + x + ' ' + (y - 12) + ' Z" fill="' + VERMELHO + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/></g>';
}

function seta(x1, y1, x2, y2, cor, w) {
  cor = cor || INK; w = w || 8;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p1 = [x2 - 18 * Math.cos(a - Math.PI / 6), y2 - 18 * Math.sin(a - Math.PI / 6)];
  const p2 = [x2 - 18 * Math.cos(a + Math.PI / 6), y2 - 18 * Math.sin(a + Math.PI / 6)];
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + cor + '" stroke-width="' + w + '" stroke-linecap="round"/>' +
    '<path d="M ' + x2 + ' ' + y2 + ' L ' + p1[0] + ' ' + p1[1] + ' L ' + p2[0] + ' ' + p2[1] + ' Z" fill="' + cor + '" stroke="' + cor + '" stroke-width="4" stroke-linejoin="round"/>';
}

function barras(vals, x, y, w, h, cor) {
  let s = '<path d="M ' + x + ' ' + y + ' V ' + (y - h) + ' M ' + x + ' ' + y + ' H ' + (x + w) + '" stroke="' + INK + '" stroke-width="7" fill="none" stroke-linecap="round"/>';
  const n = vals.length, bw = (w / n) * 0.5;
  vals.forEach(function (v, i) {
    const bx = x + (i + 0.5) * (w / n) - bw / 2;
    s += '<rect x="' + bx + '" y="' + (y - v * h) + '" width="' + bw + '" height="' + (v * h) + '" rx="6" fill="' + cor + '" stroke="' + INK + '" stroke-width="6"/>';
  });
  return s;
}

function texto(x, y, str, size, cor) {
  size = size || 40; cor = cor || INK;
  return '<text x="' + x + '" y="' + y + '" font-family="Arial, Helvetica, sans-serif" font-size="' + size + '" font-weight="700" fill="' + cor + '" text-anchor="middle">' + str + '</text>';
}

function riscado(x1, y1, x2, y2, cor) {
  cor = cor || VERMELHO;
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + cor + '" stroke-width="12" stroke-linecap="round"/>';
}

function circulo(x, y, r, cor) {
  return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + cor + '" stroke="' + INK + '" stroke-width="7"/>';
}

function anel(x, y, r, cor) {
  cor = cor || BRANCO;
  return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + cor + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="' + x + '" cy="' + y + '" r="' + (r - 30) + '" fill="' + BG + '" stroke="' + INK + '" stroke-width="7"/>';
}

function relogio(x, y, r) {
  r = r || 40;
  return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y - r * 0.55) + '" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    '<line x1="' + x + '" y1="' + y + '" x2="' + (x + r * 0.4) + '" y2="' + (y + r * 0.15) + '" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    '<line x1="' + (x - r * 0.85) + '" y1="' + y + '" x2="' + (x + r * 0.85) + '" y2="' + y + '" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>';
}

function alarme(x, y, s) {
  s = s || 1;
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<path d="M -26 -2 A 26 26 0 0 1 26 -2 Z" fill="' + VERMELHO + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>' +
    '<circle cx="0" cy="4" r="8" fill="' + VERMELHO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<line x1="-30" y1="-2" x2="30" y2="-2" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M -14 -30 l 3 -12 M 14 -30 l -3 -12" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>';
}

function celular(x, y, cor, rot) {
  cor = cor || AMARELO; rot = rot || 0;
  return '<g transform="rotate(' + rot + ' ' + x + ' ' + y + ')">' +
    '<rect x="' + (x - 27) + '" y="' + (y - 48) + '" width="54" height="96" rx="12" fill="' + cor + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<rect x="' + (x - 19) + '" y="' + (y - 40) + '" width="38" height="80" rx="6" fill="' + BRANCO + '"/>' +
    '<path d="M ' + (x - 11) + ' ' + (y - 22) + ' h 18 M ' + (x - 11) + ' ' + (y - 6) + ' h 26 M ' + (x - 11) + ' ' + (y + 10) + ' h 14" stroke="' + INK + '" stroke-width="6" stroke-linecap="round" fill="none"/></g>';
}

function tv(x, y, w, h) {
  w = w || 260; h = h || 180;
  return '<rect x="' + (x - w / 2) + '" y="' + (y - h / 2) + '" width="' + w + '" height="' + h + '" rx="14" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="8"/>' +
    '<path d="M ' + (x - w * 0.22) + ' ' + (y + h / 2) + ' l 0 26 M ' + (x + w * 0.22) + ' ' + (y + h / 2) + ' l 0 26 M ' + (x - w * 0.34) + ' ' + (y + h / 2 + 26) + ' h ' + (w * 0.68) + '" stroke="' + INK + '" stroke-width="8" stroke-linecap="round" fill="none"/>';
}

function controle(x, y) {
  return '<g transform="translate(' + x + ' ' + y + ')">' +
    '<path d="M -38 0 C -38 -18 -18 -22 -6 -22 L 6 -22 C 18 -22 38 -18 38 0 C 38 18 18 22 6 22 L -6 22 C -18 22 -38 18 -38 0 Z" fill="' + AZUL + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
    '<circle cx="-20" cy="-2" r="4" fill="' + INK + '"/><circle cx="-20" cy="12" r="4" fill="' + INK + '"/><circle cx="20" cy="4" r="4" fill="' + INK + '"/><circle cx="8" cy="4" r="7" fill="' + INK + '"/></g>';
}

function bola(x, y, r) {
  r = r || 24;
  return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + VERMELHO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<path d="M ' + x + ' ' + (y - r) + ' A ' + (r * 0.55) + ' ' + (r * 0.55) + ' 0 0 1 ' + x + ' ' + (y + r) + '" fill="none" stroke="' + INK + '" stroke-width="5"/>' +
    '<path d="M ' + (x - r) + ' ' + y + ' A ' + (r * 0.55) + ' ' + (r * 0.55) + ' 0 0 0 ' + (x + r) + ' ' + y + '" fill="none" stroke="' + INK + '" stroke-width="5"/>';
}

function caderno(x, y) {
  return '<rect x="' + (x - 30) + '" y="' + (y - 40) + '" width="60" height="80" rx="6" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<path d="M ' + (x - 18) + ' ' + (y - 24) + ' h 36 M ' + (x - 18) + ' ' + (y - 8) + ' h 36 M ' + (x - 18) + ' ' + (y + 8) + ' h 24" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M ' + (x - 30) + ' ' + (y - 22) + ' L ' + (x - 46) + ' ' + (y - 12) + ' L ' + (x - 44) + ' ' + (y - 4) + ' L ' + (x - 30) + ' ' + (y - 14) + ' Z" fill="' + VERDE + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>';
}

function calendario(x, y) {
  return '<rect x="' + (x - 40) + '" y="' + (y - 36) + '" width="80" height="72" rx="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<line x1="' + (x - 40) + '" y1="' + (y - 18) + '" x2="' + (x + 40) + '" y2="' + (y - 18) + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<rect x="' + (x - 26) + '" y="' + (y - 46) + '" width="16" height="12" rx="3" fill="none" stroke="' + INK + '" stroke-width="5"/>' +
    '<rect x="' + (x + 10) + '" y="' + (y - 46) + '" width="16" height="12" rx="3" fill="none" stroke="' + INK + '" stroke-width="5"/>' +
    '<rect x="' + (x - 8) + '" y="' + (y + 4) + '" width="16" height="16" rx="3" fill="' + VERMELHO + '" stroke="' + INK + '" stroke-width="5"/>';
}

function ampulheta(x, y) {
  return '<path d="M ' + (x - 34) + ' ' + (y - 44) + ' L ' + (x + 34) + ' ' + (y - 44) + ' L ' + (x + 6) + ' ' + y + ' L ' + (x + 34) + ' ' + (y + 44) + ' L ' + (x - 34) + ' ' + (y + 44) + ' L ' + (x - 6) + ' ' + y + ' Z" fill="none" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
    '<path d="M ' + (x - 22) + ' ' + (y - 30) + ' A 18 18 0 0 0 ' + (x + 22) + ' ' + (y - 30) + ' L ' + (x + 16) + ' ' + (y - 18) + ' L ' + (x - 16) + ' ' + (y - 18) + ' Z" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<line x1="' + (x - 24) + '" y1="' + (y - 30) + '" x2="' + (x + 24) + '" y2="' + (y - 30) + '" stroke="' + INK + '" stroke-width="5"/>';
}

function pote(x, y) {
  return '<path d="M ' + (x - 34) + ' ' + (y - 14) + ' h 68 v 30 a 20 20 0 0 1 -20 20 h -28 a 20 20 0 0 1 -20 -20 Z" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
    '<rect x="' + (x - 16) + '" y="' + (y - 26) + '" width="32" height="14" rx="4" fill="none" stroke="' + INK + '" stroke-width="6"/>';
}

function botaoCircular(x, y, r, cor) {
  r = r || 60; cor = cor || AZUL;
  return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + cor + '" stroke="' + INK + '" stroke-width="8"/>' +
    '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y - r + 16) + '" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
    '<circle cx="' + x + '" cy="' + y + '" r="12" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>';
}

function radar(x, y) {
  return '<circle cx="' + x + '" cy="' + y + '" r="70" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="' + x + '" cy="' + y + '" r="45" fill="none" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="' + x + '" cy="' + y + '" r="22" fill="none" stroke="' + INK + '" stroke-width="5"/>' +
    '<line x1="' + (x - 70) + '" y1="' + y + '" x2="' + (x + 70) + '" y2="' + y + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<line x1="' + x + '" y1="' + (y - 70) + '" x2="' + x + '" y2="' + (y + 70) + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<path d="M ' + x + ' ' + y + ' L ' + (x + 40) + ' ' + (y - 45) + ' L ' + (x + 50) + ' ' + (y - 20) + ' Z" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>';
}

function escudo(x, y) {
  return '<path d="M ' + (x - 34) + ' ' + (y - 8) + ' C ' + (x - 34) + ' ' + (y - 34) + ' ' + x + ' ' + (y - 44) + ' ' + x + ' ' + (y - 44) + ' C ' + x + ' ' + (y - 44) + ' ' + (x + 34) + ' ' + (y - 34) + ' ' + (x + 34) + ' ' + (y - 8) + ' C ' + (x + 34) + ' ' + (y + 20) + ' ' + (x + 16) + ' ' + (y + 32) + ' ' + x + ' ' + (y + 36) + ' C ' + (x - 16) + ' ' + (y + 32) + ' ' + (x - 34) + ' ' + (y + 20) + ' ' + (x - 34) + ' ' + (y - 8) + ' Z" fill="' + AZUL + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
    '<path d="M ' + (x - 14) + ' ' + (y - 6) + ' l 10 12 l 20 -22" fill="none" stroke="' + BRANCO + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>';
}

function comida(x, y) {
  return '<path d="M ' + (x - 30) + ' ' + y + ' C ' + (x - 30) + ' ' + (y - 16) + ' ' + (x - 10) + ' ' + (y - 24) + ' ' + (x + 10) + ' ' + (y - 24) + ' C ' + (x + 30) + ' ' + (y - 24) + ' ' + (x + 32) + ' ' + (y - 14) + ' ' + (x + 28) + ' ' + y + ' Z" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
    '<path d="M ' + (x - 14) + ' ' + (y - 10) + ' q 3 -6 6 0 q 3 -6 6 0 q 3 -6 6 0" stroke="' + INK + '" stroke-width="5" fill="none" stroke-linecap="round"/>';
}

function gota(x, y) {
  return '<path d="M ' + x + ' ' + (y - 34) + ' C ' + (x + 18) + ' ' + (y - 14) + ' ' + (x + 20) + ' ' + (y - 6) + ' ' + (x + 10) + ' ' + (y + 6) + ' C ' + (x + 6) + ' ' + (y + 12) + ' ' + (x - 6) + ' ' + (y + 12) + ' ' + (x - 10) + ' ' + (y + 6) + ' C ' + (x - 20) + ' ' + (y - 6) + ' ' + (x - 18) + ' ' + (y - 14) + ' ' + x + ' ' + (y - 34) + ' Z" fill="' + AZUL + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>';
}

function espiral(x, y, r) {
  r = r || 46;
  return '<path d="M ' + (x + r * 0.6) + ' ' + (y - r * 0.2) + ' A ' + (r * 0.4) + ' ' + (r * 0.4) + ' 0 1 1 ' + (x - r * 0.5) + ' ' + (y - r * 0.1) + ' A ' + (r * 0.6) + ' ' + (r * 0.6) + ' 0 1 0 ' + (x + r * 0.3) + ' ' + (y + r * 0.4) + ' A ' + (r * 0.8) + ' ' + (r * 0.8) + ' 0 1 1 ' + (x - r * 0.8) + ' ' + y + '" fill="none" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>';
}

function maosJuntas(x, y) {
  return '<g transform="translate(' + x + ' ' + y + ')">' +
    '<circle cx="-16" cy="-6" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<circle cx="16" cy="-6" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M -22 -6 L 22 -6" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M 0 -6 L 0 18" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>';
}

module.exports = {
  INK: INK, BG: BG, BRANCO: BRANCO, VERDE: VERDE, AZUL: AZUL, AMARELO: AMARELO, VERMELHO: VERMELHO,
  base: base, chao: chao, fig: fig, bolha: bolha, pontinhos: pontinhos,
  coracao: coracao, raio: raio, pq: pq, exc: exc, cerebro: cerebro, osso: osso,
  pilula: pilula, garrafa: garrafa, tumulo: tumulo, sol: sol, arvore: arvore, fogo: fogo,
  seta: seta, barras: barras, texto: texto, riscado: riscado, circulo: circulo, anel: anel,
  relogio: relogio, alarme: alarme, celular: celular, tv: tv, controle: controle, bola: bola,
  caderno: caderno, calendario: calendario, ampulheta: ampulheta, pote: pote,
  botaoCircular: botaoCircular, radar: radar, escudo: escudo, comida: comida, gota: gota,
  espiral: espiral, maosJuntas: maosJuntas
};
