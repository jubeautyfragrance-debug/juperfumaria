# Modos de Tela: E-reader, Filtro de Luz Azul e Simulação de Papel

> Pesquisado em: 24/08/2026 | Confiança: alta (técnica) / média (física do reflexo)

## Resumo executivo
- Existem **2 técnicas** de filtro de luz azul: transformação de cor no pipeline (preserva contraste — melhor) vs overlay transparente (comum, mas reduz contraste e cansa mais)
- Como o Papel é um app de leitura, podemos aplicar a transformação **dentro do próprio render do PDF via shader** — sem permissões especiais, com qualidade superior
- Modo e-reader = grayscale + contraste ajustado + (opcional) efeitos de refresh/ghosting; referência: TCL NXTPAPER faz em hardware o que faremos em software
- "Luz refletida igual ao papel" = combinar temperatura ~3600-4000K + redução de brilho máximo + textura sutil + matte feel; hardware real usa antirreflexo físico, software aproxima com calibração de luminância

## 1. Filtro de luz azul

### Método A — Transformação de cor (RECOMENDADO)
- Atua direto nos valores RGB do conteúdo renderizado (matriz de cor / shader fragment)
- Android nativo faz isso via `ColorDisplayManager`/`setColorTransform` com temperatura em Kelvin — rampa quadrática por canal RGB, range típico 2596K–4082K ([AOSP docs](https://source.android.com/docs/core/display/night-light))
- iOS chama de Night Shift (sistema); apps não controlam o sistema, MAS podem transformar seu próprio conteúdo — é o nosso caso
- Preserva contraste → menos cansaço visual ([Horus X, 01/2025](https://us.horus-x.com/blogs/news/blue-light-blocking-glasses-vs-night-mode))

### Método B — Overlay transparente
- Camada amarela/laranja semi-transparente sobre tudo (apps como Red Moon, Night Mode)
- No Android exige permissão "draw over other apps"; no iOS nem existe para apps de terceiros
- Reduz contraste → pior para leitura prolongada. Usar só como fallback se um dia quisermos filtro global

### Implementação no Papel
```
Slider de temperatura: 6500K (neutro) ←→ 2700K (velas)
→ converter Kelvin para multiplicadores RGB (algoritmo Tanner Helland)
→ aplicado como fragment shader sobre a textura da página (Impeller/Metal/GPU)
→ zero custo perceptível de bateria, 60fps mantido
```

## 2. Modo e-reader (grayscale)

Referências estudadas:
- **TCL NXTPAPER 4.0**: 3 modos — Color Paper (quente + filtro azul), Ink Paper (grayscale), Max Ink (monocromo total + launcher minimalista). Hardware = tela mate; modos = software ([The Gadgeteer, 03/2026](https://the-gadgeteer.com/2026/03/12/one-button-turns-this-smartphone-screen-into-paper/))
- **Simuladores e-ink web** usam: conversão grayscale com ajuste de contraste por dispositivo, quantização de tons (2-4 bits), ghosting simulado, flash de refresh ([e-ink-sim](https://eink-sim.berrry.app/))
- Android tem grayscale nativo em Acessibilidade (Color Correction); apps de leitura como Xodo implementam dark/invertido próprio ([How-To Geek, 03/2026](https://www.howtogeek.com/these-simple-tricks-will-turn-your-android-phone-into-an-ereader/))

### Pipeline do modo e-reader do Papel
1. Grayscale: `luma = 0.2126R + 0.7152G + 0.0722B` (Rec.709)
2. Curva de contraste tipo papel (leves pretos elevados, brancos levemente off-white #FAF8F2)
3. Opcional: quantização suave (16 níveis) para estética e-ink
4. UI do app inteira também vira monocromática (tema dedicado)

## 3. Luz refletida igual ao papel

A física: papel difunde a luz ambiente (superfície fosca); telas emitem luz própria e refletem espelhado. Software não muda o vidro, mas pode:
1. **Temperatura ~4000K + fundo levemente creme** → reflete/emite espectro próximo ao papel sob luz interna
2. **Limitar brilho máximo no modo papel** (o papel não "brilha") + sugerir brilho do sistema
3. **Textura de grão sutil** (noise estático de baixa opacidade) → percepção de superfície fosca
4. Detectar luminância ambiente (sensor) e ajustar alvo de branco dinamicamente — igual e-readers fazem com front-light

> Limite honesto: review do TCL NXTPAPER confirma que software não substitui 100% um e-ink real ou antirreflexo físico ([ereadersforum](https://www.ereadersforum.com/blog/living-with-the-tcl-nxtpaper-60-ultra-stylus-max-ink-mode-and-reading-comfort-tested)). Nosso diferencial: melhor simulação por software dentro de um app de leitura.

## Recomendação para o Papel
MVP: shader único paramétrico com 3 presets (Normal / Conforto quente / E-reader / Papel) + sliders finos (temperatura, intensidade, contraste, grão). Um pipeline, quatro experiências.

## Fontes
- https://source.android.com/docs/core/display/night-light (AOSP oficial)
- https://us.horus-x.com/blogs/news/blue-light-blocking-glasses-vs-night-mode
- https://the-gadgeteer.com/2026/03/12/one-button-turns-this-smartphone-screen-into-paper/
- https://www.digitaltrends.com/phones/this-tcl-nxtpaper-android-phone-turns-into-an-e-reader-when-your-eyes-need-a-break/
- https://www.howtogeek.com/these-simple-tricks-will-turn-your-android-phone-into-an-ereader/
- https://eink-sim.berrry.app/
