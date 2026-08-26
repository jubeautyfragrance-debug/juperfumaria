# Direção de Design Nível AAA (referências Apple)

> Pesquisado em: 24/08/2026 | Confiança: média-alta

## Resumo executivo
"Gráficos Apple" se decompõem em técnicas concretas: materiais translúcidos (blur/vibrancy), tipografia SF Pro + New York com Dynamic Type, spring animations com haptics sincronizados, e obsessão por detalhe de craft (coerência de espaçamento em grid 8pt). O padrão-ouro de apps leitura: Apple Books (imersão), Things 3 (craft), Halide (controles).

## Os ingredientes do "look Apple"

1. **Materiais**: fundos translúcidos com blur (`UIVisualEffectView` / `BackdropFilter` equivalente), vibrancy para texto sobre material
2. **Tipografia como identidade**: SF Pro para UI, New York (serifada) para momentos editoriais; tamanhos semânticos (Title/Large Title/Body) respeitando Dynamic Type até AX5
3. **Motion física**: springs (sem easing lineares), transições que herdam o gesto (interactive dismiss), morphing contínuo entre telas
4. **Haptics precisos**: `.light` ao virar página, `.rigid` no toggle de modo — nunca exagerar
5. **Cor restrita**: neutros dominantes + 1 cor de acento; modo claro/escuro/e-reader como cidadãos de primeira classe
6. **Grid e ritmo**: espaçamento 4/8pt, alinhamento ótico, cantos contínuos (squircle)

## Referências diretas de leitura
| App | O que copiar |
|---|---|
| Apple Books | transição biblioteca→leitor, barra que some ao rolar |
| Kindle iOS | painel de ajustes (brilho/temperatura/fundo) como sheet inferior |
| Xodo | modos de cor para PDF incl. invertido |
| TCL NXTPAPER | botão físico → 3 modos de tela (nosso: gesto/botão in-app) |
| Things 3 | micro-animações e spacing impecáveis |

## Princípios do Papel
1. **O PDF é o herói** — chrome da UI some durante leitura (toque = revela/some)
2. **Modos de tela são a assinatura** — troca de modo com animação crossfade de shader + haptic, nunca corte seco
3. **Zero ruído**: sem badges, sem upsells dentro do leitor
4. Acessibilidade desde o dia 1 (Dynamic Type, VoiceOver nos controles)

## Pendências de design (próxima fase)
- Tokens completos (cores por modo, motion curves com damping específicos)
- Protótipo das telas: Biblioteca / Leitor / Sheet de Ajustes / Onboarding
- Teste de contraste WCAG AA nos temas papel e e-reader

## Fontes
- Apple HIG: https://developer.apple.com/design/human-interface-guidelines/
- Estudos de caso citados via pesquisa web 03/2026 (TCL NXTPAPER coverage)
