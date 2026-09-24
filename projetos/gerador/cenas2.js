// Cenas 26-50 da história
'use strict';
const H = require('./helpers.js');
const {
  INK, BG, BRANCO, VERDE, AZUL, AMARELO, VERMELHO,
  base, chao, fig, bolha, pontinhos, coracao, raio, pq, exc, cerebro, osso,
  pilula, garrafa, tumulo, sol, arvore, fogo, seta, barras, texto, riscado,
  circulo, anel, relogio, alarme, celular, tv, controle, bola, caderno,
  calendario, ampulheta, pote, botaoCircular, radar, escudo, comida, gota, espiral, maosJuntas
} = H;

module.exports = [

['A dor física diz...', () => {
  return base(
    chao() +
    fig({ x: 240, y: 300, boca: 'zigzag', brD: [-36, 14] }) +
    osso(240, 430, 20, 1.0) +
    raio(240, 150) +
    bolha(120, 70, 240, 120, BRANCO, [[210, 188], [220, 220], [240, 188]]) +
    texto(240, 120, 'corpo danificado', 30, INK) +
    texto(240, 155, 'saia daqui!', 28, VERMELHO) +
    // dor social
    '<g><circle cx="760" cy="280" r="34" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="750" cy="274" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="772" cy="274" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="750" cy="274" r="3" fill="' + INK + '"/><circle cx="772" cy="274" r="3" fill="' + INK + '"/>' +
    '<path d="M 760 314 L 760 380 M 760 330 L 736 370 M 760 330 L 784 370 M 760 380 L 742 406 M 760 380 L 778 406" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/></g>' +
    '<path d="M 700 310 h -60 M 810 330 l 40 0" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    exc(760, 160, 1.3) +
    bolha(660, 60, 240, 120, BRANCO, [[730, 178], [740, 210], [760, 178]]) +
    texto(780, 110, 'posição no grupo', 30, INK) +
    texto(780, 145, 'em risco!', 28, VERMELHO),
    'A dor física diz...'
  );
}],

['Roy Baumeister estudou', () => {
  return base(
    fig({ x: 300, y: 300, shirt: AZUL, cap: VERMELHO, brE: [0, -50], brD: [0, -50] }) +
    texto(300, 170, 'Baumeister', 34, INK) +
    relogio(560, 200, 50) +
    // lupa sobre figura excluída
    '<circle cx="720" cy="320" r="60" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="8"/>' +
    '<g><circle cx="720" cy="300" r="22" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<circle cx="713" cy="295" r="5" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="729" cy="295" r="5" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="713" cy="295" r="2" fill="' + INK + '"/><circle cx="729" cy="295" r="2" fill="' + INK + '"/>' +
    '<path d="M 720 322 L 720 350 M 720 332 L 700 356 M 720 332 L 740 356" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    '<line x1="765" y1="365" x2="800" y2="400" stroke="' + INK + '" stroke-width="9" stroke-linecap="round"/>' +
    texto(480, 100, 'exclusão social repetida', 36, INK),
    'Roy Baumeister estudou'
  );
}],

['Declínio cognitivo mensurável', () => {
  return base(
    cerebro(300, 250, 1.5) +
    seta(300, 350, 300, 420, VERMELHO, 9) +
    barras([1, 0.8, 0.55, 0.3], 560, 430, 280, 220, AZUL) +
    texto(700, 170, 'raciocínio', 28, INK) +
    texto(700, 200, 'autocontrole', 28, INK) +
    texto(700, 230, 'decisões', 28, INK) +
    texto(480, 110, 'declínio cognitivo', 40, INK),
    'Declínio cognitivo mensurável'
  );
}],

['Modo de crise 2', () => {
  return base(
    fig({ x: 300, y: 370, boca: 'flat', brD: [-30, -20] }) +
    // cérebro em alerta com a cabeça
    cerebro(650, 300, 1.8, BRANCO, true) +
    alarme(650, 110, 1.6) +
    seta(400, 320, 540, 300, VERMELHO, 8) +
    exc(650, 60, 0.8) +
    texto(480, 100, 'crise', 56, VERMELHO),
    'Modo de crise 2'
  );
}],

['C. Nathan DeWall', () => {
  return base(
    fig({ x: 300, y: 300, shirt: AZUL, cap: VERDE, brD: [60, -90], boca: 'open' }) +
    garrafa(430, 300) +
    pilula(430, 210) +
    pq(180, 150, 1.2) +
    texto(480, 100, 'experimento estranho', 36, INK) +
    texto(430, 170, 'paracetamol', 28, AZUL),
    'C. Nathan DeWall'
  );
}],

['Paracetamol vs placebo', () => {
  return base(
    // grupo 1: remédio
    fig({ x: 220, y: 300, shirt: VERDE, brD: [-50, 0] }) +
    garrafa(330, 300) +
    texto(220, 180, 'paracetamol', 32, INK) +
    // grupo 2: placebo
    fig({ x: 620, y: 300, shirt: AZUL, brE: [50, 0] }) +
    '<g><rect x="700" y="260" width="52" height="52" rx="10" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<path d="M 716 286 q 3 -10 8 -4 q 3 -8 8 -2 q 3 -6 6 0" stroke="' + INK + '" stroke-width="5" fill="none" stroke-linecap="round"/></g>' +
    texto(630, 180, 'placebo', 32, INK) +
    calendario(480, 120) +
    texto(480, 230, '3 semanas', 30, INK),
    'Paracetamol vs placebo'
  );
}],

['Descreveram sentimentos', () => {
  return base(
    fig({ x: 260, y: 300, shirt: VERDE, brD: [-70, -30], brE: [70, -30] }) +
    caderno(190, 260) +
    fig({ x: 700, y: 300, shirt: AZUL, brD: [-70, -30], brE: [70, -30] }) +
    caderno(770, 260) +
    '<path d="M 380 240 l 14 20 M 420 240 l 14 20 M 540 240 l 14 20 M 580 240 l 14 20" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    texto(480, 120, 'descreveram seus sentimentos', 36, INK),
    'Descreveram sentimentos'
  );
}],

['Menos dor emocional', () => {
  return base(
    barras([0.25, 0.85], 300, 430, 360, 240, VERDE) +
    texto(190, 480, 'paracetamol', 30, INK) +
    texto(430, 480, 'placebo', 30, INK) +
    texto(480, 110, 'dor emocional', 42, INK) +
    seta(210, 380, 210, 300, INK, 7) +
    fig({ x: 780, y: 420, r: 40, shirt: VERDE, boca: 'open' }) +
    pilula(780, 330) +
    '<path d="M 720 360 l 14 10 M 840 360 l -14 10" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>',
    'Menos dor emocional'
  );
}],

['Remédio reduz dor social', () => {
  return base(
    garrafa(200, 250) +
    pilula(340, 250) +
    coracao(680, 250, 1.3) +
    osso(500, 250, 15, 1.0) +
    seta(420, 250, 470, 250) + seta(560, 250, 620, 250) +
    // dor caindo
    seta(680, 340, 680, 420, VERMELHO, 8) +
    '<path d="M 700 430 q 8 10 0 16 M 660 430 q -8 10 0 16" stroke="' + INK + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    texto(480, 130, 'remédio de dor física', 36, INK) +
    texto(480, 560, 'reduziu a dor social', 36, VERDE),
    'Remédio reduz dor social'
  );
}],

['Sistemas sobrepostos', () => {
  return base(
    // diagrama de Venn
    '<circle cx="380" cy="320" r="130" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="8"/>' +
    '<circle cx="580" cy="320" r="130" fill="' + AZUL + '" stroke="' + INK + '" stroke-width="8"/>' +
    osso(280, 300, 15, 0.9) +
    coracao(680, 300, 0.9) +
    '<circle cx="480" cy="310" r="34" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<path d="M 468 300 h 24 M 480 288 v 24" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    texto(300, 500, 'dor física', 36, INK) +
    texto(660, 500, 'dor social', 36, INK) +
    texto(480, 120, 'sobrepostos', 40, INK),
    'Sistemas sobrepostos'
  );
}],

['Um só sistema', () => {
  return base(
    // painel de controle
    '<rect x="330" y="140" width="300" height="260" rx="20" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="8"/>' +
    // tela
    '<rect x="360" y="170" width="240" height="120" rx="12" fill="' + BG + '" stroke="' + INK + '" stroke-width="7"/>' +
    texto(480, 235, 'DOR', 64, VERMELHO) +
    botaoCircular(420, 340, 34, VERDE) + botaoCircular(540, 340, 34, AMARELO) +
    // fios: corpo e coração
    '<path d="M 420 340 l 0 -70 M 540 340 l 0 -70" stroke="' + INK + '" stroke-width="7" fill="none"/>' +
    osso(260, 200, 20, 1.0) +
    '<path d="M 330 200 q -40 60 40 100 q 30 16 30 40" stroke="' + INK + '" stroke-width="7" fill="none"/>' +
    coracao(740, 200, 1.0) +
    '<path d="M 640 200 q 50 40 30 80" stroke="' + INK + '" stroke-width="7" fill="none"/>' +
    texto(480, 470, 'um sistema de dor', 40, INK) +
    texto(480, 560, 'responde aos dois', 32, INK),
    'Um só sistema'
  );
}],

['Explica muita coisa', () => {
  return base(
    fig({ x: 480, y: 370, boca: 'flat', brD: [0, -30] }) +
    pq(300, 200, 1.3) + pq(660, 180, 1.1) + pq(780, 320, 0.9) + pq(180, 330, 0.8) +
    // peças de quebra-cabeça
    '<g><circle cx="480" cy="240" r="26" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M 470 230 q 5 -8 10 0 q 5 -8 10 0" stroke="' + INK + '" stroke-width="5" fill="none"/></g>' +
    '<g><circle cx="420" cy="300" r="22" fill="' + VERDE + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M 412 292 q 4 -7 8 0 q 4 -7 8 0" stroke="' + INK + '" stroke-width="5" fill="none"/></g>' +
    '<g><circle cx="545" cy="295" r="22" fill="' + AZUL + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M 537 287 q 4 -7 8 0 q 4 -7 8 0" stroke="' + INK + '" stroke-width="5" fill="none"/></g>' +
    texto(480, 100, 'isso explica muita coisa', 40, INK),
    'Explica muita coisa'
  );
}],

['Segunda na quinta', () => {
  return base(
    chao() +
    // cabeça com loop de pensamento
    '<circle cx="300" cy="280" r="90" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="8"/>' +
    bolha(240, 110, 120, 60, BRANCO, [[270, 168], [282, 196], [296, 168]]) +
    pontinhos(276, 140, 22, 6) +
    '<path d="M 380 180 a 60 60 0 1 1 -16 70" stroke="' + INK + '" stroke-width="7" fill="none" stroke-linecap="round"/>' +
    '<path d="M 420 210 l 18 10 l -24 14 Z" fill="' + INK + '"/>' +
    // calendário seg→qui
    calendario(600, 280) +
    calendario(780, 280) +
    texto(600, 200, 'seg', 34, INK) +
    texto(780, 200, 'qui', 34, INK) +
    seta(660, 280, 730, 280) +
    texto(480, 480, 'ruminação', 40, INK),
    'Segunda na quinta'
  );
}],

['Revisita o erro', () => {
  return base(
    cerebro(360, 300, 1.8, BRANCO) +
    '<path d="M 300 120 a 70 70 0 1 1 20 90" stroke="' + INK + '" stroke-width="8" fill="none" stroke-linecap="round"/>' +
    '<path d="M 370 90 l 22 12 l -28 16 Z" fill="' + INK + '"/>' +
    // lupa sobre memória de rejeição
    '<circle cx="720" cy="300" r="70" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="8"/>' +
    '<g><circle cx="720" cy="280" r="24" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<circle cx="712" cy="275" r="6" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="730" cy="275" r="6" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="712" cy="275" r="2" fill="' + INK + '"/><circle cx="730" cy="275" r="2" fill="' + INK + '"/>' +
    '<path d="M 720 304 L 720 340 M 720 318 L 698 344 M 720 318 L 742 344" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    '<line x1="770" y1="350" x2="810" y2="390" stroke="' + INK + '" stroke-width="9" stroke-linecap="round"/>' +
    texto(480, 500, 'o que deu errado?', 38, INK) +
    texto(480, 545, 'para não repetir', 30, '#8a7f68'),
    'Revisita o erro'
  );
}],

['Erro = exclusão = morte', () => {
  return base(
    chao() +
    texto(220, 250, 'erro', 44, INK) +
    seta(280, 280, 400, 280) +
    '<g><circle cx="480" cy="280" r="40" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<path d="M 468 268 h 24 M 480 256 v 24 M 468 268 h 24 M 480 256 v 24" stroke="' + INK + '" stroke-width="6"/></g>' +
    texto(480, 350, 'exclusão', 34, INK) +
    seta(540, 280, 640, 280) +
    tumulo(720, 260) +
    texto(720, 350, 'morte', 40, VERMELHO) +
    texto(480, 120, 'no passado', 40, INK),
    'Erro = exclusão = morte'
  );
}],

['Rejeição revivida', () => {
  return base(
    // memória social nítida (cores fortes)
    '<rect x="120" y="120" width="300" height="240" rx="16" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="8"/>' +
    '<g><circle cx="220" cy="200" r="30" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<circle cx="212" cy="195" r="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="230" cy="195" r="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="212" cy="195" r="3" fill="' + INK + '"/><circle cx="230" cy="195" r="3" fill="' + INK + '"/>' +
    '<path d="M 220 230 L 220 280 M 220 242 L 202 268 M 220 242 L 238 268" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    '<g><circle cx="320" cy="210" r="26" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<circle cx="313" cy="206" r="7" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="329" cy="206" r="7" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="313" cy="206" r="2.5" fill="' + INK + '"/><circle cx="329" cy="206" r="2.5" fill="' + INK + '"/>' +
    '<path d="M 320 236 L 320 282 M 320 248 L 302 272 M 320 248 L 338 272" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    '<path d="M 270 270 l -60 -14 M 350 268 l -50 12" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
    texto(270, 300, 'rejeição', 30, VERMELHO) +
    exc(360, 150, 0.9) +
    // memória física esmaecida (traço claro)
    '<g opacity="0.45"><rect x="560" y="120" width="300" height="240" rx="16" fill="' + BRANCO + '" stroke="#9c9180" stroke-width="8"/>' +
    '<circle cx="660" cy="220" r="30" fill="' + BRANCO + '" stroke="#9c9180" stroke-width="6"/>' +
    '<path d="M 660 250 L 660 300 M 660 262 L 642 286 M 660 262 L 678 286" stroke="#9c9180" stroke-width="7" stroke-linecap="round"/>' +
    '<rect x="636" y="290" width="48" height="16" rx="7" fill="' + BRANCO + '" stroke="#9c9180" stroke-width="5"/>' +
    osso(730, 260, -20, 0.8) +
    texto(710, 300, 'tombo', 26, '#9c9180') + '</g>' +
    texto(480, 420, 'memória social dura mais', 34, INK) +
    texto(480, 470, 'que memória de dor física', 34, INK),
    'Rejeição revivida'
  );
}],

['Onze anos', () => {
  return base(
    // tombo aos 11 (esmaecido)
    '<g opacity="0.45"><rect x="80" y="120" width="340" height="260" rx="16" fill="' + BRANCO + '" stroke="#9c9180" stroke-width="8"/>' +
    '<g transform="rotate(-60 230 250)"><circle cx="230" cy="240" r="30" fill="' + BRANCO + '" stroke="#9c9180" stroke-width="6"/>' +
    '<path d="M 230 270 L 230 320 M 230 282 L 212 306 M 230 282 L 248 306 M 230 320 L 214 340 M 230 320 L 246 340" stroke="#9c9180" stroke-width="7" stroke-linecap="round"/></g>' +
    '<rect x="206" y="300" width="48" height="16" rx="7" fill="' + BRANCO + '" stroke="#9c9180" stroke-width="5"/>' +
    '<path d="M 300 200 l 40 -20 M 330 240 l 44 -14" stroke="#9c9180" stroke-width="5" stroke-linecap="round"/>' +
    texto(250, 330, 'o tombo', 26, '#9c9180') + '</g>' +
    texto(250, 110, 'dor física', 28, '#9c9180') +
    // exclusão aos 11 (nítida)
    '<rect x="520" y="120" width="360" height="260" rx="16" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="8"/>' +
    '<g><circle cx="620" cy="220" r="30" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<circle cx="612" cy="215" r="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="630" cy="215" r="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="612" cy="215" r="3" fill="' + INK + '"/><circle cx="630" cy="215" r="3" fill="' + INK + '"/>' +
    '<path d="M 620 250 L 620 300 M 620 262 L 602 286 M 620 262 L 638 286" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    '<g><circle cx="740" cy="210" r="26" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<circle cx="733" cy="206" r="7" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="749" cy="206" r="7" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="733" cy="206" r="2.5" fill="' + INK + '"/><circle cx="749" cy="206" r="2.5" fill="' + INK + '"/>' +
    '<path d="M 740 236 L 740 282 M 740 248 L 722 272 M 740 248 L 758 272" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    '<path d="M 690 250 l -40 -10 M 770 250 l 30 -8" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
    texto(700, 320, 'excluído', 28, VERMELHO) +
    texto(700, 110, 'dor social', 28, INK) +
    texto(480, 440, '11 anos', 34, INK) +
    '<path d="M 470 380 l 0 40 M 490 380 l 0 40" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>',
    'Onze anos'
  );
}],

['Memória mais durável', () => {
  return base(
    // pote da memória social: cheio e brilhante
    pote(280, 300) +
    coracao(280, 260, 0.8) +
    '<path d="M 250 230 q -8 -14 0 -22 M 310 230 q 8 -14 0 -22" stroke="' + INK + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    texto(280, 170, 'social', 32, VERMELHO) +
    texto(280, 420, 'mais durável', 30, INK) +
    // pote da memória física: esmaecido
    '<g opacity="0.45"><path d="M 586 286 h 68 v 30 a 20 20 0 0 1 -20 20 h -28 a 20 20 0 0 1 -20 -20 Z" fill="' + BRANCO + '" stroke="#9c9180" stroke-width="7" stroke-linejoin="round"/>' +
    '<rect x="604" y="274" width="32" height="14" rx="4" fill="none" stroke="#9c9180" stroke-width="6"/>' +
    osso(620, 250, -15, 0.8) + '</g>' +
    texto(620, 170, 'física', 32, '#9c9180') +
    texto(620, 420, 'esmaece', 30, '#9c9180') +
    texto(480, 100, 'memória emocional social', 36, INK),
    'Memória mais durável'
  );
}],

['Em público dói mais', () => {
  return base(
    chao() +
    // em público: multidão + raio grande
    '<g><circle cx="220" cy="320" r="30" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M 220 350 L 220 400 M 220 362 L 202 386 M 220 362 L 238 386 M 220 400 L 204 420 M 220 400 L 236 420" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    '<g><circle cx="330" cy="300" r="24" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M 330 324 L 330 370 M 330 336 L 314 358 M 330 336 L 346 358" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    '<g><circle cx="120" cy="280" r="24" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M 120 304 L 120 350 M 120 316 L 104 338 M 120 316 L 136 338" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    raio(270, 150) +
    exc(180, 140, 1.1) +
    // sozinho: raio pequeno
    '<g><circle cx="700" cy="330" r="30" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<circle cx="692" cy="325" r="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="710" cy="325" r="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="692" cy="325" r="3" fill="' + INK + '"/><circle cx="710" cy="325" r="3" fill="' + INK + '"/>' +
    '<path d="M 700 360 L 700 410 M 700 372 L 682 396 M 700 372 L 718 396" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    '<g opacity="0.5">' + raio(700, 220) + '</g>' +
    texto(270, 500, 'em público', 34, VERMELHO) +
    texto(700, 500, 'em privado', 34, '#8a7f68'),
    'Em público dói mais'
  );
}],

['Reputação definida', () => {
  return base(
    chao() +
    // holofote
    '<path d="M 480 100 l -140 300 l 280 0 Z" fill="' + AMARELO + '" opacity="0.35" stroke="' + INK + '" stroke-width="6"/>' +
    // plateia olhando
    '<g><circle cx="180" cy="250" r="26" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<circle cx="172" cy="245" r="7" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="190" cy="245" r="7" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="172" cy="245" r="2.5" fill="' + INK + '"/><circle cx="190" cy="245" r="2.5" fill="' + INK + '"/>' +
    '<path d="M 180 276 L 180 320 M 180 288 L 164 310 M 180 288 L 196 310" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    '<g><circle cx="300" cy="300" r="24" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<circle cx="293" cy="296" r="6" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="309" cy="296" r="6" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="293" cy="296" r="2" fill="' + INK + '"/><circle cx="309" cy="296" r="2" fill="' + INK + '"/>' +
    '<path d="M 300 324 L 300 370 M 300 336 L 284 358 M 300 336 L 316 358" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    // excluído no centro do holofote
    '<g><circle cx="480" cy="330" r="36" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="471" cy="324" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="491" cy="324" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="471" cy="324" r="3" fill="' + INK + '"/><circle cx="491" cy="324" r="3" fill="' + INK + '"/>' +
    '<path d="M 480 366 L 480 430 M 480 380 L 458 414 M 480 380 L 502 414 M 480 430 L 462 458 M 480 430 L 498 458" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/></g>' +
    // plateia direita
    '<g><circle cx="660" cy="290" r="24" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<circle cx="653" cy="286" r="6" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="669" cy="286" r="6" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="653" cy="286" r="2" fill="' + INK + '"/><circle cx="669" cy="286" r="2" fill="' + INK + '"/>' +
    '<path d="M 660 314 L 660 360 M 660 326 L 644 348 M 660 326 L 676 348" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    '<g><circle cx="780" cy="250" r="26" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<circle cx="772" cy="245" r="7" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="790" cy="245" r="7" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="772" cy="245" r="2.5" fill="' + INK + '"/><circle cx="790" cy="245" r="2.5" fill="' + INK + '"/>' +
    '<path d="M 780 276 L 780 320 M 780 288 L 764 310 M 780 288 L 796 310" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    raio(480, 160) +
    texto(480, 100, 'todos veem', 34, INK),
    'Reputação definida'
  );
}],

['Reação desproporcional', () => {
  return base(
    chao() +
    // pequena rejeição (bubblezinho)
    bolha(150, 300, 120, 70, BRANCO, [[180, 368], [190, 396], [205, 368]]) +
    pontinhos(190, 335, 22, 6) +
    seta(280, 350, 400, 350) +
    // grande explosão
    '<circle cx="560" cy="300" r="90" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="8"/>' +
    '<path d="M 560 170 l 0 -40 M 680 250 l 30 -22 M 680 340 l 34 12 M 560 430 l 0 40 M 440 340 l -30 12 M 440 250 l -34 -22" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/>' +
    exc(560, 280, 2.0) +
    // botão de calibração
    botaoCircular(780, 470, 40, VERMELHO) +
    texto(480, 520, 'pequena rejeição', 32, INK) +
    texto(650, 520, 'reação gigante', 32, VERMELHO),
    'Reação desproporcional'
  );
}],

['Calibrado para a savana', () => {
  return base(
    // rádio antigo
    '<rect x="300" y="200" width="360" height="220" rx="18" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="8"/>' +
    '<circle cx="400" cy="310" r="55" fill="' + AZUL + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<line x1="400" y1="310" x2="400" y2="265" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
    '<line x1="400" y1="310" x2="440" y2="300" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    '<rect x="500" y="260" width="110" height="100" rx="10" fill="' + BG + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M 525 300 q 6 -14 12 0 q 6 -14 12 0 q 6 -14 12 0 q 6 -14 12 0" stroke="' + INK + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    // teias de aranha
    '<path d="M 460 170 l 24 20 M 500 170 l -14 26 M 430 200 l 0 26 M 470 200 l 24 -20" stroke="' + INK + '" stroke-width="5"/>' +
    '<path d="M 470 175 a 16 16 0 0 1 0 20 M 500 195 a 16 16 0 0 1 0 20" stroke="' + INK + '" stroke-width="4" fill="none"/>' +
    texto(480, 170, '300.000 anos', 36, INK) +
    texto(480, 480, 'calibrado para a savana', 40, INK),
    'Calibrado para a savana'
  );
}],

['App vs tribo', () => {
  return base(
    chao() +
    // aplicativo
    '<rect x="80" y="140" width="340" height="300" rx="18" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="8"/>' +
    celular(190, 240, AMARELO, -6) +
    '<g><circle cx="300" cy="250" r="26" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M 300 276 L 300 320 M 300 288 L 284 310 M 300 288 L 316 310" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    '<g><circle cx="380" cy="230" r="22" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M 380 252 L 380 290 M 380 262 L 366 282 M 380 262 L 394 282" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    texto(250, 200, 'grupo no app', 28, AZUL) +
    texto(250, 380, 'deixado de fora', 28, INK) +
    // tribo
    '<rect x="540" y="140" width="340" height="300" rx="18" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="8"/>' +
    '<g><circle cx="660" cy="260" r="26" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<circle cx="653" cy="255" r="7" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="669" cy="255" r="7" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="653" cy="255" r="2.5" fill="' + INK + '"/><circle cx="669" cy="255" r="2.5" fill="' + INK + '"/>' +
    '<path d="M 660 286 L 660 330 M 660 298 L 644 320 M 660 298 L 676 320 M 660 330 L 644 350 M 660 330 L 676 350" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    '<g><circle cx="740" cy="240" r="24" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M 740 264 L 740 310 M 740 276 L 724 298 M 740 276 L 756 298" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    '<line x1="800" y1="330" x2="840" y2="290" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
    texto(710, 200, 'tribo', 28, VERMELHO) +
    texto(710, 380, 'banido', 28, INK) +
    // mesmos alarmes
    alarme(250, 90, 1.1) + alarme(710, 90, 1.1),
    'App vs tribo'
  );
}],

['Mesma língua', () => {
  return base(
    // ícone app
    celular(260, 300, AMARELO, 0) +
    // ícone tribo
    '<g><circle cx="700" cy="300" r="40" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="688" cy="292" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="714" cy="292" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="688" cy="292" r="3" fill="' + INK + '"/><circle cx="714" cy="292" r="3" fill="' + INK + '"/>' +
    '<path d="M 700 340 L 700 390 M 700 352 L 682 376 M 700 352 L 718 376 M 700 390 L 684 410 M 700 390 L 716 410" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/></g>' +
    // alarme central
    alarme(480, 250, 1.8) +
    seta(330, 300, 410, 280) + seta(630, 300, 550, 280) +
    '<path d="M 480 180 l 0 -40" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
    texto(480, 100, 'PERIGO', 60, VERMELHO) +
    texto(480, 480, 'falam a mesma língua', 40, INK),
    'Mesma língua'
  );
}]

];
