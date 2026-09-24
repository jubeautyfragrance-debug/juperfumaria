// Cenas 1-25 da história
'use strict';
const H = require('./helpers.js');
const {
  INK, BG, BRANCO, VERDE, AZUL, AMARELO, VERMELHO,
  base, chao, fig, bolha, pontinhos, coracao, raio, pq, exc, cerebro, osso,
  pilula, garrafa, tumulo, sol, arvore, fogo, seta, barras, texto, riscado,
  circulo, anel, relogio, alarme, celular, tv, controle, bola, caderno,
  calendario, ampulheta, pote, botaoCircular, radar, escudo, comida, gota, espiral
} = H;

module.exports = [

['Ficar de fora', () => {
  return base(
    // grupo à direita conversando
    fig({ x: 640, y: 250, shirt: VERDE, boca: 'flat' }) +
    fig({ x: 730, y: 310, shirt: AZUL, cap: AMARELO, boca: 'flat' }) +
    fig({ x: 550, y: 320, shirt: VERMELHO, hair: true, boca: 'flat' }) +
    bolha(700, 110, 150, 78, BRANCO, [[735, 186], [748, 220], [762, 186]]) +
    pontinhos(720, 152, 28, 8) +
    // sozinho à esquerda com celular
    fig({ x: 250, y: 320, boca: 'sad', olhos: 'fechado' }) +
    celular(322, 320, AMARELO, -10) +
    bolha(120, 130, 130, 66, BRANCO, [[200, 194], [230, 232], [215, 192]]) +
    pontinhos(172, 163, 24, 6),
    'Ficar de fora'
  );
}],

['E doeu', () => {
  return base(
    fig({ x: 460, y: 300, boca: 'zigzag', brD: [-40, 18] }) +
    raio(430, 320) + raio(530, 305) +
    coracao(460, 380, 1.2) +
    texto(460, 120, 'Doeu.', 64, VERMELHO),
    'E doeu'
  );
}],

['Pressão no peito', () => {
  return base(
    fig({ x: 430, y: 310, boca: 'sad', brD: [-38, 16] }) +
    pq(430, 120, 1.6) +
    circulo(430, 392, 40, VERMELHO) +
    '<path d="M 400 362 a 12 12 0 0 1 12 -10 M 440 352 a 12 12 0 0 1 12 10" fill="none" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M 320 300 q -6 12 4 18 M 350 320 q -6 12 4 18 M 545 300 q 6 12 -4 18" stroke="' + INK + '" stroke-width="6" fill="none" stroke-linecap="round"/>',
    'Pressão no peito'
  );
}],

['O corpo não aceitou', () => {
  return base(
    fig({ x: 420, y: 310, boca: 'flat', brE: [18, -6], brD: [-18, -6] }) +
    alarme(420, 90, 1.4) +
    raio(360, 130) + raio(480, 130) +
    exc(560, 180, 0.9) + pq(280, 180, 0.9) +
    '<path d="M 340 360 q -6 10 4 16 M 500 350 q 6 10 -4 16" stroke="' + INK + '" stroke-width="6" fill="none" stroke-linecap="round"/>',
    'O corpo não aceitou'
  );
}],

['E se não fosse fraqueza?', () => {
  return base(
    fig({ x: 430, y: 370, boca: 'open' }) +
    pq(540, 430, 0.8) +
    // balão de pensamento com cena ancestral
    bolha(150, 78, 330, 230, BRANCO, [[330, 306], [380, 348], [365, 306]]) +
    arvore(260, 250) + sol(390, 130, 26) +
    fig({ x: 320, y: 200, r: 34, perna: 'junta' }) +
    osso(410, 250, 25, 0.7) + osso(440, 235, -40, 0.6) +
    pq(430, 120, 1.1),
    'E se não fosse fraqueza?'
  );
}],

['A resposta muda tudo', () => {
  return base(
    cerebro(340, 300, 1.9, BRANCO, true) +
    coracao(480, 300, 1.4) +
    // lâmpada
    '<g><circle cx="620" cy="220" r="42" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<path d="M 612 252 l 4 14 h 8 l 4 -14 Z" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>' +
    '<path d="M 620 138 v -22 M 668 190 l 16 -16 M 572 190 l -16 -16 M 690 226 h 22 M 528 226 h -22" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    texto(630, 480, 'muda tudo', 44, INK) +
    seta(560, 260, 600, 235),
    'A resposta muda tudo'
  );
}],

['Mesmo sistema de alarme', () => {
  return base(
    cerebro(480, 320, 1.5, BRANCO, true) +
    alarme(480, 120, 1.3) +
    // osso quebrado (esquerda) e conversa excluída (direita)
    osso(220, 300, 30, 1.1) +
    '<path d="M 196 282 l 14 8 M 226 322 l 10 12" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    bolha(680, 230, 150, 80, BRANCO, [[710, 308], [720, 340], [735, 308]]) +
    pontinhos(726, 270, 26, 7) +
    seta(280, 300, 400, 320) + seta(680, 300, 560, 320),
    'Mesmo sistema de alarme'
  );
}],

['Naomi Eisenberger, 2003', () => {
  return base(
    // máquina de ressonância
    anel(700, 300, 120) +
    '<rect x="240" y="330" width="340" height="22" rx="11" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<path d="M 300 330 v -40" stroke="' + INK + '" stroke-width="9" stroke-linecap="round"/>' +
    // pessoa deitada (cabeça dentro do anel)
    '<circle cx="670" cy="300" r="34" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="660" cy="293" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="682" cy="293" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="660" cy="293" r="3" fill="' + INK + '"/><circle cx="682" cy="293" r="3" fill="' + INK + '"/>' +
    '<path d="M 420 330 h 200 M 500 300 h 40 M 560 285 h 40" stroke="' + INK + '" stroke-width="9" stroke-linecap="round"/>' +
    // cientista
    fig({ x: 210, y: 300, shirt: AZUL, cap: VERMELHO }) +
    caderno(150, 280) +
    texto(480, 90, '2003 · UCLA', 40, INK) +
    texto(700, 180, 'MRI', 30, AZUL),
    'Naomi Eisenberger, 2003'
  );
}],

['Videogame de arremesso', () => {
  return base(
    tv(480, 240, 300, 220) +
    // mini personagens no jogo
    '<g>' + fig({ x: 360, y: 232, r: 24, perna: 'junta' }) +
    fig({ x: 470, y: 232, r: 24, perna: 'junta', shirt: VERDE }) +
    fig({ x: 585, y: 232, r: 24, perna: 'junta', shirt: AZUL }) + '</g>' +
    bola(455, 188, 13) +
    seta(470, 218, 458, 196) +
    // jogador com controle
    fig({ x: 760, y: 370, shirt: VERDE, brE: [-60, -10] }) +
    controle(700, 430) +
    texto(180, 100, 'arremesso de bola', 34, INK),
    'Videogame de arremesso'
  );
}],

['Só paravam', () => {
  return base(
    tv(480, 240, 300, 220) +
    '<g>' + fig({ x: 360, y: 232, r: 24, perna: 'junta' }) +
    fig({ x: 470, y: 232, r: 24, perna: 'junta', shirt: VERDE, brD: [-14, -22] }) +
    fig({ x: 585, y: 232, r: 24, perna: 'junta', shirt: AZUL, brE: [14, -22] }) + '</g>' +
    bola(470, 185, 13) +
    bolha(480, 90, 120, 60, BRANCO, [[510, 148], [520, 175], [535, 148]]) +
    pontinhos(510, 120, 22, 6) +
    fig({ x: 170, y: 370, boca: 'sad', brD: [-30, 0] }) +
    celular(250, 460, AMARELO, -8) +
    exc(300, 250, 1.2),
    'Só paravam'
  );
}],

['O cérebro acendeu', () => {
  return base(
    // perfil de cabeça
    '<circle cx="430" cy="300" r="130" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="8"/>' +
    cerebro(400, 300, 1.7, BRANCO, true) +
    // raios do cérebro
    '<path d="M 300 210 l -30 -20 M 285 300 l -40 0 M 300 390 l -30 20" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/>' +
    // linhas de escaneamento
    '<path d="M 640 160 h 120 M 640 240 h 120 M 640 320 h 90 M 640 400 h 120 M 640 480 h 70" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M 730 160 l 0 320" stroke="' + INK + '" stroke-width="6" stroke-dasharray="10 10"/>' +
    exc(860, 120, 1.5) +
    texto(760, 560, 'o cérebro acendeu', 34, INK),
    'O cérebro acendeu'
  );
}],

['Córtex cingulado anterior dorsal', () => {
  return base(
    cerebro(460, 300, 2.2, BRANCO, true) +
    // seta apontando para a região
    seta(760, 240, 600, 260, VERMELHO, 9) +
    texto(770, 170, 'córtex cingulado', 30, INK) +
    texto(770, 205, 'anterior dorsal', 30, INK),
    'Córtex cingulado anterior dorsal'
  );
}],

['Mesmo lugar da dor física', () => {
  return base(
    cerebro(480, 300, 1.9, BRANCO, true) +
    // osso quebrado
    osso(210, 260, 20, 1.1) +
    '<path d="M 186 242 l 12 10 M 216 282 l 8 12" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    raio(210, 170) +
    // figura com curativo
    fig({ x: 780, y: 320, shirt: null, boca: 'zigzag' }) +
    '<rect x="752" y="330" width="46" height="18" rx="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    osso(760, 430, -25, 0.8) +
    raio(780, 180) +
    seta(280, 250, 400, 280) + seta(700, 260, 570, 285),
    'Mesmo lugar da dor física'
  );
}],

['Detector de dor', () => {
  return base(
    fig({ x: 800, y: 370, boca: 'open' }) +
    controle(700, 500) +
    tv(280, 260, 280, 210) +
    cerebro(280, 260, 1.1, BRANCO, true) +
    exc(560, 200, 1.4) +
    alarme(460, 160, 1.6) +
    seta(410, 210, 460, 180, VERMELHO),
    'Detector de dor'
  );
}],

['Pare um segundo', () => {
  return base(
    fig({ x: 400, y: 370, brD: [90, -200], boca: 'flat' }) +
    // mão aberta (pare)
    '<g><circle cx="490" cy="278" r="34" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<path d="M 470 292 v 46 M 490 292 v 52 M 510 292 v 42" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    cerebro(700, 250, 1.6, BRANCO, true) +
    '<path d="M 620 180 q -10 14 0 22 q 10 14 0 24" stroke="' + INK + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    '<path d="M 780 190 l 18 -14 M 800 210 l 24 -10" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    texto(700, 480, 'Pare. Deixe isso entrar.', 38, INK),
    'Pare um segundo'
  );
}],

['Mesmo alarme', () => {
  return base(
    alarme(480, 240, 2.2) +
    // costela quebrada
    osso(200, 340, -10, 1.2) +
    '<path d="M 180 322 l 10 10 M 210 360 l 8 12" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    raio(200, 240) +
    // conversa excluída
    bolha(700, 280, 150, 80, BRANCO, [[718, 358], [728, 388], [743, 358]]) +
    pontinhos(736, 320, 26, 7) +
    seta(260, 340, 420, 300) + seta(700, 340, 540, 300),
    'Mesmo alarme'
  );
}],

['Por quê?', () => {
  return base(
    fig({ x: 250, y: 370, boca: 'open', brD: [0, -90] }) +
    pq(250, 340, 1.1) +
    pq(600, 200, 2.8) +
    pq(780, 400, 1.2) +
    pq(120, 160, 1.0) +
    cerebro(600, 480, 1.2) +
    '<path d="M 660 500 l 14 8 M 700 480 l 18 2" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>',
    'Por quê?'
  );
}],

['Trezentos mil anos atrás', () => {
  return base(
    chao(560) +
    // linha do tempo
    seta(180, 300, 780, 300, INK, 9) +
    texto(480, 260, '300.000 anos', 40, INK) +
    // figura moderna no começo
    fig({ x: 160, y: 300, r: 44, shirt: AZUL, brE: [0, -60], brD: [0, -60] }) +
    // hominídeo no fim
    '<g><circle cx="800" cy="280" r="40" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="790" cy="273" r="10" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="812" cy="273" r="10" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="790" cy="273" r="3" fill="' + INK + '"/><circle cx="812" cy="273" r="3" fill="' + INK + '"/>' +
    '<path d="M 800 320 L 800 400 M 800 340 L 770 390 M 800 340 L 830 390 M 800 400 L 772 440 M 800 400 L 828 440" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/>' +
    '<line x1="830" y1="380" x2="870" y2="330" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    '<path d="M 300 290 l 0 24" stroke="' + VERMELHO + '" stroke-width="8" stroke-linecap="round"/>',
    'Trezentos mil anos atrás'
  );
}],

['Seus ancestrais', () => {
  return base(
    chao() +
    sol(160, 130, 30) +
    arvore(780, 300) +
    // grupo de hominídeos
    '<g><circle cx="340" cy="300" r="38" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="330" cy="293" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="352" cy="293" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="330" cy="293" r="3" fill="' + INK + '"/><circle cx="352" cy="293" r="3" fill="' + INK + '"/>' +
    '<path d="M 340 338 L 340 420 M 340 356 L 312 410 M 340 356 L 368 410 M 340 420 L 314 458 M 340 420 L 366 458" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/>' +
    '<line x1="368" y1="380" x2="400" y2="350" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    '<g><circle cx="470" cy="330" r="34" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="462" cy="324" r="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="480" cy="324" r="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="462" cy="324" r="3" fill="' + INK + '"/><circle cx="480" cy="324" r="3" fill="' + INK + '"/>' +
    '<path d="M 470 364 L 470 430 M 470 380 L 448 420 M 470 380 L 492 420 M 470 430 L 450 458 M 470 430 L 490 458" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    '<g><circle cx="585" cy="310" r="36" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="576" cy="304" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="596" cy="304" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="576" cy="304" r="3" fill="' + INK + '"/><circle cx="596" cy="304" r="3" fill="' + INK + '"/>' +
    '<path d="M 585 346 L 585 424 M 585 362 L 562 410 M 585 362 L 608 410 M 585 424 L 564 458 M 585 424 L 606 458" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/></g>' +
    // cabana
    '<path d="M 120 460 L 200 380 L 280 460 Z" fill="' + VERMELHO + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
    '<path d="M 140 460 L 140 430 M 160 460 L 160 415 M 180 460 L 180 430" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    texto(480, 100, 'grupos de 30-50 pessoas', 34, INK),
    'Seus ancestrais'
  );
}],

['Sentença de morte', () => {
  return base(
    chao() +
    // grupo indo embora
    '<g><circle cx="700" cy="280" r="36" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="691" cy="274" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="711" cy="274" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="691" cy="274" r="3" fill="' + INK + '"/><circle cx="711" cy="274" r="3" fill="' + INK + '"/>' +
    '<path d="M 700 316 L 700 390 M 700 332 L 676 376 M 700 332 L 724 376 M 700 390 L 680 420 M 700 390 L 720 420" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/></g>' +
    '<g><circle cx="790" cy="300" r="32" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="782" cy="295" r="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="800" cy="295" r="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="782" cy="295" r="3" fill="' + INK + '"/><circle cx="800" cy="295" r="3" fill="' + INK + '"/>' +
    '<path d="M 790 332 L 790 400 M 790 348 L 768 392 M 790 348 L 812 392 M 790 400 L 772 428 M 790 400 L 808 428" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    // sozinho com túmulo
    '<g><circle cx="240" cy="350" r="42" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="230" cy="343" r="10" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="252" cy="343" r="10" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="230" cy="343" r="3" fill="' + INK + '"/><circle cx="252" cy="343" r="3" fill="' + INK + '"/>' +
    '<path d="M 240 392 L 240 480 M 240 408 L 214 458 M 240 408 L 266 458 M 240 480 L 218 514 M 240 480 L 262 514" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/></g>' +
    tumulo(240, 300) +
    texto(480, 100, 'sentença de morte', 46, VERMELHO),
    'Sentença de morte'
  );
}],

['Sem o grupo', () => {
  const mini = function (x, extra) {
    let s = '<g><circle cx="' + x + '" cy="140" r="26" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
      '<circle cx="' + (x - 11) + '" cy="134" r="7" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
      '<circle cx="' + (x + 11) + '" cy="134" r="7" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
      '<circle cx="' + (x - 11) + '" cy="134" r="2.5" fill="' + INK + '"/><circle cx="' + (x + 11) + '" cy="134" r="2.5" fill="' + INK + '"/>' +
      '<path d="M ' + x + ' 166 L ' + x + ' 200 M ' + x + ' 176 L ' + (x - 13) + ' 196 M ' + x + ' 176 L ' + (x + 13) + ' 196 M ' + x + ' 200 L ' + (x - 10) + ' 216 M ' + x + ' 200 L ' + (x + 10) + ' 216" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>';
    return s + (extra || '');
  };
  return base(
    // 1. sem comida
    '<rect x="20" y="60" width="210" height="170" rx="16" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="8"/>' +
    comida(125, 150) + riscado(95, 130, 155, 170) + raio(125, 92) +
    // 2. sem proteção (predador)
    '<rect x="250" y="60" width="210" height="170" rx="16" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="8"/>' +
    mini(355) +
    '<g><circle cx="355" cy="92" r="18" fill="' + VERMELHO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M 344 78 l -4 -14 M 366 78 l 4 -14" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
    '<circle cx="349" cy="92" r="4" fill="' + INK + '"/><circle cx="361" cy="92" r="4" fill="' + INK + '"/>' +
    '<path d="M 350 100 q 5 6 10 0" stroke="' + INK + '" stroke-width="4" fill="none"/></g>' +
    // 3. sem parceiros
    '<rect x="480" y="60" width="210" height="170" rx="16" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="8"/>' +
    mini(585) + coracao(585, 86, 0.7) + riscado(560, 76, 610, 96) +
    // 4. sem ajuda na doença
    '<rect x="710" y="60" width="210" height="170" rx="16" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="8"/>' +
    mini(815, '<path d="M 795 150 q 6 -10 12 0 q 6 -10 12 0" stroke="' + VERMELHO + '" stroke-width="5" fill="none" stroke-linecap="round"/>') +
    '<path d="M 795 178 l -8 16 M 835 178 l 8 16" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
    texto(480, 40, 'sem o grupo...', 36, INK) +
    texto(480, 270, 'comida · proteção · filhos · doença', 30, INK),
    'Sem o grupo'
  );
}],

['Dias contados', () => {
  return base(
    chao() +
    '<g><circle cx="300" cy="300" r="40" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="290" cy="294" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="312" cy="294" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="290" cy="294" r="3" fill="' + INK + '"/><circle cx="312" cy="294" r="3" fill="' + INK + '"/>' +
    '<path d="M 300 340 L 300 420 M 300 358 L 274 404 M 300 358 L 326 404 M 300 420 L 278 456 M 300 420 L 322 456" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/>' +
    '<line x1="326" y1="380" x2="360" y2="350" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    arvore(600, 330) +
    sol(820, 140, 26) +
    ampulheta(650, 180) +
    texto(300, 540, 'dias contados', 36, VERMELHO),
    'Dias contados'
  );
}],

['Água e comida', () => {
  return base(
    gota(240, 320) + comida(480, 320) + coracao(720, 320, 1.3) +
    texto(240, 240, 'água', 34, INK) +
    texto(480, 240, 'comida', 34, INK) +
    texto(720, 240, 'pertencer', 34, INK) +
    '<path d="M 330 320 q 12 -14 24 0 M 570 320 q 12 -14 24 0" stroke="' + INK + '" stroke-width="9" stroke-linecap="round" fill="none"/>' +
    texto(480, 500, '= necessidade de sobrevivência', 40, INK),
    'Água e comida'
  );
}],

['Fusão dos sistemas', () => {
  return base(
    osso(220, 300, 15, 1.3) +
    coracao(740, 300, 1.3) +
    '<path d="M 320 300 q 30 0 60 -40 M 640 300 q -30 0 -60 -40" stroke="' + INK + '" stroke-width="9" stroke-linecap="round" fill="none"/>' +
    // sistema único
    '<g><path d="M 480 170 L 480 300 M 480 170 L 430 120 L 480 70 L 530 120 Z" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
    texto(480, 110, '1', 44, INK) +
    circulo(480, 380, 66, BRANCO) +
    '<path d="M 480 340 l 14 18 h 28 a 8 8 0 0 1 8 8 v 4 a 8 8 0 0 1 -8 8 h -56 a 8 8 0 0 1 -8 -8 v -4 a 8 8 0 0 1 8 -8 h 28 Z" fill="' + VERMELHO + '" stroke="' + INK + '" stroke-width="6"/></g>' +
    // faíscas
    '<path d="M 420 140 l 16 -12 M 540 140 l 16 12 M 380 220 l 20 4 M 580 220 l -20 4" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    texto(480, 540, 'um só sistema', 38, INK),
    'Fusão dos sistemas'
  );
}],

['PERIGO', () => {
  return base(
    alarme(220, 200, 1.6) + alarme(740, 200, 1.6) +
    raio(220, 90) + raio(740, 90) +
    texto(480, 300, 'PERIGO', 92, VERMELHO) +
    // raios ao redor do texto
    '<path d="M 480 200 l 0 -30 M 340 250 l -24 -14 M 620 250 l 24 -14 M 260 350 l -22 8 M 700 350 l 22 8" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/>' +
    seta(300, 230, 420, 260) + seta(660, 230, 540, 260),
    'PERIGO'
  );
}],

['Dois avisos', () => {
  return base(
    // balão dor física
    bolha(80, 90, 300, 170, BRANCO, [[200, 258], [210, 300], [230, 258]]) +
    osso(230, 160, 20, 0.9) + raio(160, 120) +
    texto(230, 225, 'corpo danificado!', 30, INK) +
    texto(230, 258, 'saia da situação', 28, VERMELHO) +
    // balão dor social
    bolha(580, 90, 300, 170, BRANCO, [[730, 258], [740, 300], [760, 258]]) +
    '<g><circle cx="700" cy="150" r="24" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M 700 174 L 700 200 M 700 182 L 686 196 M 700 182 L 714 196" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    '<path d="M 640 140 h -60 M 750 150 l 30 6 M 640 166 h -70" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    texto(710, 225, 'posição em risco!', 30, INK) +
    texto(710, 258, 'conserte já', 28, VERMELHO) +
    // figura central
    fig({ x: 480, y: 370, boca: 'flat' }),
    'Dois avisos'
  );
}],

['Roy Baumeister', () => {
  return base(
    fig({ x: 420, y: 320, shirt: AZUL, cap: VERMELHO, brE: [-30, -30], brD: [30, -30] }) +
    caderno(330, 250) +
    '<path d="M 300 200 l 120 0 M 360 200 l 0 -40" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
    relogio(660, 260, 55) +
    relogio(760, 420, 45) +
    relogio(560, 440, 38) +
    texto(480, 100, 'décadas de estudo', 36, INK) +
    texto(660, 110, 'exclusão social', 30, INK),
    'Roy Baumeister'
  );
}],

['Perturbador', () => {
  return base(
    fig({ x: 420, y: 360, boca: 'open', brD: [10, -90] }) +
    exc(480, 250, 2.2) +
    pq(330, 240, 1.2) +
    pq(560, 220, 1.0) +
    espiral(420, 150, 40) +
    '<path d="M 280 480 q 8 -14 16 0 M 300 500 q 8 -14 16 0 M 520 480 q 8 -14 16 0" stroke="' + INK + '" stroke-width="6" fill="none" stroke-linecap="round"/>',
    'Perturbador'
  );
}],

['Declínio cognitivo', () => {
  return base(
    // cérebro grande → pequeno
    cerebro(300, 250, 1.6) +
    seta(300, 360, 300, 430) +
    cerebro(700, 420, 0.9, '#E8D9BC') +
    fig({ x: 700, y: 250, r: 0, perna: 'junta' }) +
    '<g><circle cx="760" cy="180" r="20" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/><path d="M 760 200 v 40" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    texto(480, 120, 'declínio cognitivo', 40, INK) +
    texto(480, 500, 'mensurável', 34, VERMELHO),
    'Declínio cognitivo'
  );
}],

['Raciocínio caindo', () => {
  return base(
    fig({ x: 300, y: 360, boca: 'sad', brD: [-16, -10], brE: [16, -10] }) +
    // engrenagens caindo da cabeça
    '<g><circle cx="420" cy="200" r="34" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<path d="M 420 176 v -12 M 420 224 v 12 M 396 200 h -12 M 444 200 h 12 M 403 183 l -9 -9 M 437 217 l 9 9 M 437 183 l 9 -9 M 403 217 l -9 9" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    '<g><circle cx="560" cy="320" r="26" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M 560 300 v -10 M 560 340 v 10 M 540 320 h -10 M 580 320 h 10" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/></g>' +
    '<g><circle cx="660" cy="430" r="20" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M 660 416 v -8 M 660 444 v 8 M 646 430 h -8 M 674 430 h 8" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/></g>' +
    texto(480, 120, 'raciocinar · decidir', 36, INK),
    'Raciocínio caindo'
  );
}],

['Compromete pensar', () => {
  return base(
    fig({ x: 300, y: 360, boca: 'sad', brE: [18, -6], brD: [-18, -6] }) +
    pq(300, 220, 1.3) +
    // gráfico descendo
    barras([0.9, 0.75, 0.6, 0.4, 0.25], 560, 420, 260, 220, AZUL) +
    seta(690, 190, 690, 250, INK, 6) +
    texto(560, 180, 'capacidade de pensar', 32, INK) +
    texto(560, 510, 'não apenas dói', 30, VERMELHO),
    'Compromete pensar'
  );
}],

['Reaja, não filosofe', () => {
  return base(
    chao() +
    // correndo do tigre dente-de-sabre
    '<g transform="rotate(14 240 380)">' +
    '<circle cx="240" cy="350" r="34" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="231" cy="344" r="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="251" cy="344" r="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="231" cy="344" r="3" fill="' + INK + '"/><circle cx="251" cy="344" r="3" fill="' + INK + '"/>' +
    '<path d="M 240 384 L 240 450 M 240 398 L 214 440 M 240 398 L 266 440 M 240 450 L 220 480 M 240 450 L 258 482" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/></g>' +
    '<path d="M 300 400 h 140" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
    // tigre
    '<g><path d="M 640 420 q 60 -20 120 10 q -30 -40 -60 -50 q 10 -18 -8 -30 q -30 12 -36 38 q -26 -6 -36 12 q 8 22 20 20 Z" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
    '<circle cx="710" cy="392" r="5" fill="' + INK + '"/>' +
    '<path d="M 690 398 l -6 -12 M 698 396 l 6 -12" stroke="' + BRANCO + '" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M 700 380 l -4 -18 M 722 380 l 4 -18" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M 736 402 l 14 4 M 742 424 l 14 0 M 736 446 l 12 -4" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    // cérebro com ordem
    cerebro(830, 220, 1.1, BRANCO, true) +
    exc(830, 120, 1.3) +
    texto(480, 100, 'reaja!', 44, VERMELHO) +
    texto(180, 580, 'filosofar depois', 30, '#8a7f68'),
    'Reaja, não filosofe'
  );
}],

['Redireciona recursos', () => {
  return base(
    cerebro(300, 300, 1.7, BRANCO, true) +
    // energia indo para o corpo
    seta(390, 300, 560, 420, INK, 8) +
    '<g><circle cx="650" cy="460" r="26" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<path d="M 650 438 v -14 M 650 482 v 14 M 630 460 h -14 M 670 460 h 14" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    // saindo do pensamento
    '<path d="M 300 180 l 0 -60" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/>' +
    '<g><circle cx="300" cy="80" r="34" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<path d="M 286 74 h 28 M 300 60 v 28 M 286 74 h 28 M 300 60 v 28" stroke="' + INK + '" stroke-width="5"/></g>' +
    pq(120, 90, 1.2) +
    texto(480, 560, 'cérebro redireciona energia', 34, INK),
    'Redireciona recursos'
  );
}],

['Modo de crise', () => {
  return base(
    cerebro(480, 320, 2.2, BRANCO, true) +
    alarme(480, 100, 1.8) +
    // luzes de alerta
    '<path d="M 330 220 l -40 -20 M 630 220 l 40 -20 M 300 380 l -46 -10 M 660 380 l 46 -10" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/>' +
    texto(480, 560, 'modo de crise', 46, VERMELHO),
    'Modo de crise'
  );
}]

];
