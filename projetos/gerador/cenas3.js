// Cenas 51-74 da história
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

['Naomi foi além', () => {
  return base(
    fig({ x: 300, y: 300, shirt: AZUL, cap: VERMELHO, brE: [0, -50], brD: [0, -50] }) +
    // cebola de camadas ao lado
    '<circle cx="620" cy="300" r="110" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="8"/>' +
    '<circle cx="620" cy="300" r="70" fill="' + VERDE + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="620" cy="300" r="34" fill="' + AZUL + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M 740 220 l 30 16 M 760 260 l 36 6" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
    texto(480, 120, 'outra camada', 40, INK),
    'Naomi foi além'
  );
}],

['Conexão alivia a dor', () => {
  return base(
    cerebro(480, 300, 1.9, BRANCO) +
    // dor entrando
    raio(200, 180) +
    osso(200, 300, 20, 1.0) +
    seta(280, 300, 380, 300, VERMELHO, 7) +
    // conexão saindo (alívio)
    coracao(760, 250, 1.1) +
    maosJuntas(760, 360) +
    seta(600, 300, 680, 290, VERDE, 7) +
    texto(480, 540, 'conexão = alívio', 38, VERDE)
  );
}],

['Calor físico e social', () => {
  return base(
    // sol (calor físico)
    sol(220, 200, 36) +
    // abraço (calor social)
    '<g><circle cx="520" cy="230" r="30" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<path d="M 520 260 L 520 300 M 520 272 L 504 292 M 520 272 L 536 292" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    '<g><circle cx="600" cy="220" r="30" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<path d="M 600 250 L 600 290 M 600 262 L 584 282 M 600 262 L 616 282" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    coracao(560, 320, 0.7) +
    // ambos apontam para o mesmo lugar do cérebro
    cerebro(480, 470, 1.4, BRANCO, true) +
    seta(260, 240, 420, 430) + seta(600, 270, 540, 430) +
    texto(480, 130, 'mesma região', 36, INK),
    'Calor físico e social'
  );
}],

['Segurar a mão', () => {
  return base(
    chao() +
    // máquina de ressonância
    anel(700, 300, 120) +
    '<rect x="200" y="330" width="380" height="22" rx="11" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="670" cy="300" r="34" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="660" cy="293" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="682" cy="293" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="660" cy="293" r="3" fill="' + INK + '"/><circle cx="682" cy="293" r="3" fill="' + INK + '"/>' +
    '<path d="M 430 330 h 180" stroke="' + INK + '" stroke-width="9" stroke-linecap="round"/>' +
    '<path d="M 470 290 h 40 M 520 278 h 36" stroke="' + INK + '" stroke-width="9" stroke-linecap="round"/>' +
    // mão sendo segurada
    maosJuntas(300, 400) +
    // medidor de dor baixo
    '<rect x="100" y="140" width="70" height="200" rx="12" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<rect x="112" y="310" width="46" height="18" rx="6" fill="' + VERDE + '" stroke="' + INK + '" stroke-width="5"/>' +
    texto(135, 120, 'dor', 26, INK) +
    texto(480, 130, 'segurar a mão', 36, INK) +
    texto(480, 170, 'reduz a dor física', 30, VERDE)
  );
}],

['Anestésico', () => {
  return base(
    // abraço em grupo em volta
    fig({ x: 300, y: 320, shirt: VERDE, brD: [0, -40], brE: [0, -40] }) +
    fig({ x: 660, y: 320, shirt: AZUL, brD: [0, -40], brE: [0, -40] }) +
    fig({ x: 480, y: 280, shirt: VERMELHO, brD: [-50, 30], brE: [50, 30] }) +
    coracao(480, 120, 1.4) +
    // máscara de anestesia
    '<path d="M 440 160 l -26 34 M 520 160 l 26 34" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
    '<rect x="430" y="160" width="100" height="40" rx="14" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="7"/>' +
    // medidor em zero
    texto(480, 500, 'pertencimento = anestésico', 40, VERDE),
    'Anestésico'
  );
}],

['Corpos sabiam', () => {
  return base(
    chao() +
    fogo(480, 400) +
    // grupo ao redor da fogueira
    '<g><circle cx="260" cy="300" r="36" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="252" cy="294" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="270" cy="294" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="252" cy="294" r="3" fill="' + INK + '"/><circle cx="270" cy="294" r="3" fill="' + INK + '"/>' +
    '<path d="M 260 336 L 260 400 M 260 352 L 240 388 M 260 352 L 280 388" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/></g>' +
    '<g><circle cx="700" cy="300" r="36" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="692" cy="294" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="710" cy="294" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="692" cy="294" r="3" fill="' + INK + '"/><circle cx="710" cy="294" r="3" fill="' + INK + '"/>' +
    '<path d="M 700 336 L 700 400 M 700 352 L 680 388 M 700 352 L 720 388" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/></g>' +
    '<g><circle cx="480" cy="240" r="34" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="472" cy="234" r="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="490" cy="234" r="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="472" cy="234" r="3" fill="' + INK + '"/><circle cx="490" cy="234" r="3" fill="' + INK + '"/>' +
    '<path d="M 480 274 L 480 330 M 480 288 L 462 318 M 480 288 L 498 318" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    coracao(480, 160, 0.8) +
    sol(140, 120, 24) +
    '<path d="M 840 140 l 14 -16 M 860 150 l 18 -8 M 840 170 l 20 2" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    texto(480, 520, 'corpos sabiam', 40, INK),
    'Corpos sabiam'
  );
}],

['O grupo aquecia', () => {
  return base(
    chao() +
    fogo(480, 420) +
    // 4 ícones ao redor
    sol(200, 180, 30) + texto(200, 140, 'aquecia', 30, INK) +
    comida(800, 180) + texto(800, 140, 'alimentava', 30, INK) +
    escudo(200, 420) + texto(200, 500, 'protegia', 30, INK) +
    coracao(800, 420, 1.0) + texto(800, 500, 'anestesiava', 30, INK) +
    '<g><circle cx="480" cy="280" r="34" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="472" cy="274" r="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="490" cy="274" r="8" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="472" cy="274" r="3" fill="' + INK + '"/><circle cx="490" cy="274" r="3" fill="' + INK + '"/>' +
    '<path d="M 480 314 L 480 370 M 480 328 L 462 358 M 480 328 L 498 358" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>',
    'O grupo aquecia'
  );
}],

['O que você faz?', () => {
  return base(
    fig({ x: 480, y: 370, boca: 'open', brE: [16, -6], brD: [-16, -6] }) +
    pq(480, 240, 2.2) +
    pq(250, 200, 1.1) + pq(720, 200, 1.1) +
    pq(180, 380, 0.8) + pq(800, 380, 0.8) +
    texto(480, 130, 'e agora?', 48, INK),
    'O que você faz?'
  );
}],

['Pare de chamar de fraqueza', () => {
  return base(
    fig({ x: 480, y: 370, shirt: VERDE, boca: 'flat', brE: [14, -60], brD: [-14, -60] }) +
    // palavra riscada
    texto(480, 220, 'FRAQUEZA', 84, INK) +
    riscado(280, 190, 680, 230) +
    exc(760, 130, 1.3) +
    texto(480, 320, 'pare de chamar assim', 36, VERMELHO),
    'Pare de chamar de fraqueza'
  );
}],

['Humano antigo', () => {
  return base(
    fig({ x: 480, y: 360, shirt: VERMELHO, boca: 'flat', brD: [-30, 10] }) +
    // raízes crescendo dos pés
    '<path d="M 400 560 q -10 20 -30 24 M 420 562 q -6 16 -16 20 M 540 560 q 14 18 34 20 M 520 562 q 10 14 20 18" stroke="' + INK + '" stroke-width="7" fill="none" stroke-linecap="round"/>' +
    coracao(480, 120, 1.2) +
    texto(480, 210, 'não é sensibilidade a mais', 36, INK) +
    texto(480, 520, 'é ser humano antigo', 36, VERDE),
    'Humano antigo'
  );
}],

['Você é descendente', () => {
  return base(
    chao() +
    // cadeia de ancestralidade
    '<g><circle cx="200" cy="300" r="44" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="188" cy="292" r="10" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="214" cy="292" r="10" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="188" cy="292" r="3" fill="' + INK + '"/><circle cx="214" cy="292" r="3" fill="' + INK + '"/>' +
    '<path d="M 200 344 L 200 420 M 200 360 L 174 404 M 200 360 L 226 404 M 200 420 L 180 450 M 200 420 L 220 450" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/></g>' +
    '<g><circle cx="370" cy="280" r="40" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="360" cy="273" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="382" cy="273" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="360" cy="273" r="3" fill="' + INK + '"/><circle cx="382" cy="273" r="3" fill="' + INK + '"/>' +
    '<path d="M 370 320 L 370 400 M 370 336 L 348 380 M 370 336 L 392 380 M 370 400 L 352 428 M 370 400 L 388 428" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/></g>' +
    '<g><circle cx="540" cy="300" r="36" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="531" cy="294" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="551" cy="294" r="9" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="531" cy="294" r="3" fill="' + INK + '"/><circle cx="551" cy="294" r="3" fill="' + INK + '"/>' +
    '<path d="M 540 336 L 540 410 M 540 352 L 520 394 M 540 352 L 560 394 M 540 410 L 522 438 M 540 410 L 558 438" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>' +
    fig({ x: 720, y: 320, shirt: AZUL, boca: 'smile' }) +
    seta(250, 300, 320, 300) + seta(420, 290, 490, 300) + seta(585, 310, 660, 320) +
    // polegar de seleção
    '<g transform="rotate(-20 880 200)"><path d="M 880 214 a 14 14 0 0 1 -18 -12 l -4 -40 l 12 -8 l 14 30 Z" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>' +
    '<path d="M 862 170 l 26 0 l -6 26 l -14 8 Z" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/></g>' +
    texto(480, 120, 'seleção natural', 36, INK) +
    texto(720, 180, 'você', 34, INK) +
    texto(480, 540, 'sobreviveram · você é descendente', 32, INK),
    'Você é descendente'
  );
}],

['Desatualizado', () => {
  return base(
    chao() +
    // rádio antigo com teias
    '<rect x="300" y="220" width="360" height="200" rx="18" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="8"/>' +
    '<rect x="480" y="270" width="130" height="90" rx="10" fill="' + BG + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M 505 310 q 6 -14 12 0 q 6 -14 12 0 q 6 -14 12 0 q 6 -14 12 0" stroke="' + INK + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    botaoCircular(390, 330, 40, VERDE) +
    '<path d="M 360 190 l 20 16 M 400 190 l -10 22 M 330 215 l 0 20" stroke="' + INK + '" stroke-width="5"/>' +
    '<path d="M 366 192 a 12 12 0 0 1 0 16 M 398 208 a 12 12 0 0 1 0 16" stroke="' + INK + '" stroke-width="4" fill="none"/>' +
    // não quebrado
    texto(300, 170, 'não quebrado', 32, VERDE) +
    '<g><circle cx="620" cy="150" r="30" fill="' + VERDE + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<path d="M 606 150 l 10 10 l 18 -20" stroke="' + BRANCO + '" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>' +
    // desatualizado
    texto(480, 480, 'desatualizado', 40, VERMELHO) +
    '<circle cx="640" cy="470" r="30" fill="' + VERMELHO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<path d="M 628 458 l 24 24 M 652 458 l -24 24" stroke="' + BRANCO + '" stroke-width="7" stroke-linecap="round"/>',
    'Desatualizado'
  );
}],

['Perigo antigo vs moderno', () => {
  return base(
    radar(300, 320) +
    // ameaças antigas
    '<g><circle cx="180" cy="180" r="26" fill="' + VERMELHO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="172" cy="175" r="6" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="190" cy="175" r="6" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="172" cy="175" r="2" fill="' + INK + '"/><circle cx="190" cy="175" r="2" fill="' + INK + '"/>' +
    '<path d="M 180 206 L 180 240 M 180 218 L 164 240 M 180 218 L 196 240" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    '<path d="M 180 130 l 0 -30 M 130 180 l -26 0" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M 300 130 q 10 -16 20 0" stroke="' + VERMELHO + '" stroke-width="7" fill="none" stroke-linecap="round"/>' +
    texto(300, 90, 'perigos antigos', 30, VERMELHO) +
    // ameaças modernas
    celular(720, 300, AMARELO, 8) +
    texto(720, 210, 'perigos de hoje', 30, INK) +
    '<path d="M 660 190 q -6 10 -16 8 M 700 180 q 6 10 16 8" stroke="' + INK + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    texto(480, 500, 'o radar ainda busca o passado', 34, INK),
    'Perigo antigo vs moderno'
  );
}],

['Não é sentença de morte', () => {
  return base(
    // exclusão moderna: dolorosa, pequena
    fig({ x: 250, y: 360, shirt: VERDE, boca: 'sad', brD: [-30, 10] }) +
    bolha(120, 180, 150, 80, BRANCO, [[190, 258], [205, 290], [215, 258]]) +
    pontinhos(172, 220, 24, 6) +
    raio(250, 170) +
    texto(250, 140, 'doloroso e real', 30, INK) +
    texto(250, 520, 'mas não é fatal', 30, VERDE) +
    // interpretação do cérebro: túmulo
    '<g><circle cx="700" cy="360" r="40" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<circle cx="690" cy="354" r="10" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="712" cy="354" r="10" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="690" cy="354" r="3" fill="' + INK + '"/><circle cx="712" cy="354" r="3" fill="' + INK + '"/>' +
    '<path d="M 700 400 L 700 470 M 700 414 L 676 452 M 700 414 L 724 452 M 700 470 L 680 496 M 700 470 L 720 496" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/></g>' +
    tumulo(700, 250) +
    exc(700, 160, 1.2) +
    texto(700, 140, 'o cérebro acha', 30, INK) +
    texto(700, 520, 'sentença de morte', 30, VERMELHO) +
    seta(300, 320, 640, 320),
    'Não é sentença de morte'
  );
}],

['Conexão biológica', () => {
  return base(
    // raízes do coração subindo até o cérebro
    coracao(480, 480, 1.4) +
    '<path d="M 440 470 q -30 20 -40 0 M 520 470 q 30 20 40 0" stroke="' + INK + '" stroke-width="7" fill="none" stroke-linecap="round"/>' +
    cerebro(480, 260, 1.9, BRANCO, true) +
    // raízes ligando coração e cérebro
    '<path d="M 460 450 C 420 420 400 380 420 340 M 500 450 C 540 420 560 380 540 340" stroke="' + VERDE + '" stroke-width="9" fill="none" stroke-linecap="round"/>' +
    '<path d="M 420 340 l -16 8 l 6 -18 Z M 540 340 l 16 8 l -6 -18 Z" fill="' + VERDE + '"/>' +
    // pequenas raízes
    '<path d="M 440 420 q -16 -8 -18 -24 M 460 400 q -14 -10 -12 -22 M 520 420 q 16 -8 18 -24 M 500 400 q 14 -10 12 -22" stroke="' + VERDE + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    texto(480, 560, 'necessidade biológica', 38, INK) +
    texto(480, 120, 'conexão enraizada', 36, INK),
    'Conexão biológica'
  );
}],

['Construído para pertencer', () => {
  return base(
    // arco de figuras de mãos dadas
    fig({ x: 480, y: 250, r: 48, shirt: VERDE, brE: [-40, 30], brD: [40, 30], boca: 'smile' }) +
    fig({ x: 320, y: 330, r: 42, shirt: AZUL, brE: [-36, 28], brD: [36, 28], boca: 'smile' }) +
    fig({ x: 640, y: 330, r: 42, shirt: VERMELHO, brE: [-36, 28], brD: [36, 28], boca: 'smile' }) +
    fig({ x: 190, y: 440, r: 40, shirt: AMARELO, brE: [-34, 24], brD: [34, 24], boca: 'smile' }) +
    fig({ x: 770, y: 440, r: 40, shirt: AZUL, brE: [-34, 24], brD: [34, 24], boca: 'smile' }) +
    fig({ x: 480, y: 440, r: 40, shirt: VERDE, brE: [-34, 24], brD: [34, 24], boca: 'smile' }) +
    coracao(480, 130, 1.2) +
    texto(480, 95, 'construído para pertencer', 38, INK),
    'Construído para pertencer'
  );
}],

['Você vai saber', () => {
  return base(
    fig({ x: 480, y: 370, shirt: VERDE, boca: 'smile', brD: [-36, 12] }) +
    coracao(480, 330, 1.0) +
    // lâmpada suave
    '<circle cx="480" cy="160" r="40" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="7"/>' +
    '<path d="M 470 192 l 4 14 h 12 l 4 -14 Z" fill="' + AMARELO + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>' +
    '<path d="M 480 84 v -16 M 540 140 l 12 -12 M 420 140 l -12 -12" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M 380 300 q -8 12 2 18 M 580 300 q 8 12 -2 18" stroke="' + INK + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    texto(480, 560, 'agora você vai saber o que é', 38, INK)
  );
}],

['Não é fraqueza', () => {
  return base(
    texto(480, 240, 'FRAQUEZA', 92, INK) +
    riscado(260, 210, 700, 250) +
    seta(480, 340, 480, 410, VERDE, 10) +
    texto(480, 480, 'EVOLUÇÃO', 92, VERDE) +
    '<path d="M 760 180 l 26 0 M 770 170 l 16 10 M 770 190 l 16 -10" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M 180 480 l -26 0 M 194 470 l -16 10 M 194 490 l -16 -10" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>',
    'Não é fraqueza'
  );
}],

['Você importa para o grupo', () => {
  return base(
    sol(140, 140, 30) +
    fogo(480, 420) +
    // duas figuras juntas
    fig({ x: 400, y: 320, shirt: VERDE, brD: [0, -40] }) +
    fig({ x: 560, y: 320, shirt: AZUL, brE: [0, -40] }) +
    coracao(480, 200, 1.3) +
    // círculo do grupo ao fundo
    '<circle cx="480" cy="360" r="230" fill="none" stroke="' + INK + '" stroke-width="6" stroke-dasharray="14 14"/>' +
    '<g><circle cx="180" cy="300" r="26" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M 180 326 L 180 370 M 180 338 L 164 360 M 180 338 L 196 360" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    '<g><circle cx="780" cy="300" r="26" fill="' + BRANCO + '" stroke="' + INK + '" stroke-width="6"/>' +
    '<path d="M 780 326 L 780 370 M 780 338 L 764 360 M 780 338 L 796 360" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/></g>' +
    texto(480, 100, 'você importa para o grupo', 40, INK) +
    texto(480, 560, 'e o grupo importa para você', 34, VERDE),
    'Você importa para o grupo'
  );
}]

];
