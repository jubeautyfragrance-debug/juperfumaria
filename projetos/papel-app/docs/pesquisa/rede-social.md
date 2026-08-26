# Pesquisa social — Reddit / YouTube / X

Data: 24/08/2026 · Objetivo: entender o que usuários reais dizem sobre leitura de PDF em celular,
modo e-ink/tela papel e filtro de luz azul — para validar o posicionamento do **Papel**.

---

## 1) Reddit — ✅ CONCLUÍDA via websearch (`site:reddit.com`), 24/08/2026

Busca semântica via skill `reddit-research` (reddapi.dev) segue indisponível — exige
`REDDAPI_API_KEY`/`REDDAPI_AUTH`, não configuradas no ambiente (verificado em processo,
usuário e máquina). Para habilitar depois:
```powershell
$env:REDDAPI_API_KEY = "sua-chave"
$env:REDDAPI_AUTH    = "seu-token"
```

### 1a) Dores com PDF no celular (r/ereader, r/androidapps, r/Supernote, r/Boox)

| Dor relatada | Evidência | Implicação para o Papel |
|---|---|---|
| Apps não enxergam PDFs na pasta/downloads | Moon+ Reader não importou ~20 de 40 PDFs de um bundle ([thread](https://www.reddit.com/r/ereader/comments/1gggv7a/)); Scribd/Nook não mostram PDFs movidos para suas pastas | Import deve varrer storage de verdade + watcher de pasta; nunca depender de MediaStore incompleto |
| Viewer padrão falha → usuário forçado ao Adobe | "default pdf viewer isn't capable of opening it… I have to open the Adobe app" (r/androidapps) | Registrar handler confiável p/ PDF + abrir rápido é diferencial básico |
| PDF grande/landscape ilegível sem crop | KOReader sideloaded "solved 2 major problems… PDF very much readable in both orientations" + renderiza árabe RTL ([r/Supernote](https://www.reddit.com/r/Supernote/comments/1fwvii0/)) | Crop/margens ajustáveis = feature matadora p/ PDF acadêmico |
| Medo de perder anotações ao trocar de dispositivo | usuário c/ PDFs médicos no Boox: "save any annotation on pdfs for not losing if I change device" | Anotações exportáveis em arquivo lado-a-lado do PDF |
| Mobile renderiza PDF melhor que desktop | r/ebooks: até "high dpi PDFs" rodam melhor em celular/tablet que PC | Tese técnica ok: alvo mobile é o ambiente certo |

### 1b) Conforto visual / luz azul / leitura noturna (r/apps, r/kobo, r/ereader, r/SaaS)

| Achado | Evidência | Implicação |
|---|---|---|
| **Gap real no iOS**: Android tem app que escurece "além do dark mode"; iPhone não tem nada além de Night Shift | [r/apps](https://www.reddit.com/r/apps/comments/18lrc59/): "I want to reduce the light so it isn't blinding at night" | No iOS, modo "mais escuro que o sistema" dentro da leitura = diferencial claro |
| Brilho mínimo dos e-readers ainda é forte demais à noite | [r/kobo](https://www.reddit.com/r/kobo/comments/1icwagr/): Clara BW a 1% + warm máx "still found it too bright" lendo no escuro | Controle de brilho sub-1% + dimming por software no modo e-reader |
| Usuários fazem ritual manual diário de temperatura de cor | múltiplas respostas em r/kobo: "1% brightness and maximum warmth" à noite, "no light no warmth" de dia | Presets por contexto/hora + lembrar por livro (confirma insight do YouTube) |
| Dark mode puro não é a solução p/ leitura | [r/SaaS Eye Comfort](https://www.reddit.com/r/SaaS/comments/1pnrisq/): "pure black + pure white text can feel harsh"; tinta equilibrada preserva página natural | Modo papel/sépia > dark mode; valida ADR-003 (tint via shader) |
| Alguns dark themes chegam a machucar | r/Julia: docs escuras "hurt my eyes" mesmo p/ quem usa IDE dark | Oferecer espectro sépia↔escuro com contraste garantido |
| Demanda por telas gentis existe e é urgente | r/ereader: "my vision just gets blurry from reading even for a few minutes" no phone/iPad; usuária sênior trocando Kindle Voyage por tela maior pois "my eyes tend to burn" | Público-alvo concreto: quem lê no celular e sente nos olhos |
| Atualização de cores pode destruir contraste | r/kindle: novas cores de highlight "opaque… makes the text harder to read because the contrast is so low" | Qualquer filtro/tint DEVE preservar contraste do texto (regra do ADR-003) |

### 1c) Ecos de e-ink que transferem para modos de tela (r/eink, r/kobo)

- Dono de monitor e-ink Bigme redesenha workflow inteiro: fundo claro global "reduces ghosting",
  high contrast modes, white backgrounds — confirma que **modo papel = claro, alto contraste, estável**.
- Efeito tela-porta e "rainbow shimmer" de telas coloridas causam dor de cabeça real
  ([r/kobo](https://www.reddit.com/r/kobo/comments/1mkdrz5/)); Kobo até criou setting "reduce rainbow effect".
  → Nossos shaders não podem introduzir banding/flicker perceptível.
- Fonte importa mais que se imagina: OpenDyslexic/Atkinson Hyperlegible — "can't go back",
  preferem o app ao livro físico pela tipografia ([r/kindle](https://www.reddit.com/r/kindle/comments/1nuzcrk/)).
  → Considerar fontes acessíveis + override tipográfico leve no futuro.

### Síntese quantitativa informal
Threads recentes (2024–2026) mostram dores recorrentes em ≥5 subreddits distintos
(r/ereader, r/kobo, r/kindle, r/androidapps, r/Onyx_Boox, r/Supernote, r/eink):
**(1) achar/importar o próprio arquivo**, **(2) conforto noturno insuficiente**, **(3) medo de perder anotações**.
As três são exatamente o território do Papel (offline-first, modos de conforto, tudo local).

## 2) YouTube

### Vídeo analisado em profundidade (transcrição completa)
**"Everything I Know About E-Ink Phones in 43 Minutes" — Kit Betts-Masters (26/02/2026)**
Ranking #10→#1 após morar com ~12 dispositivos e-ink do tamanho de celular.
Arquivo local: `yt-eink-phones-2026.md`

Insights direto das falas do criador (o "usuário avançado" que nosso app quer conquistar):

| Insight | Citação/evidência | Implicação para o Papel |
|---|---|---|
| **Software > hardware** é o diferencial nº1 | Bigme/Boox vencem porque "lembram suas customizações"; VWoods perde por não lembrar modo por app | O Papel deve lembrar preset de cor/brilho **por livro** |
| Menus Android puros ficam horríveis em e-ink | "stock Android is really bad when it's on e-ink… you'll never see a Boox phone have a menu like that" | UI própria desenhada para os modos (não depender de widgets padrão com muito detalhe fino) |
| Luz frontal quente/fria dupla é feature decisiva | HiBreak elogiado por ter "warm and cold front lights"; Medita criticada por não ter | Nosso controle de temperatura de cor deve ser fino (não só 3 presets) |
| Modo grayscale global existe e é usado | HiBreak tem "global grayscale mode" | Validar ADR-003: grayscale + temperatura via shader cobre isso melhor |
| Ghosting/flicker irritam profundamente | Críticas repetidas ao Minimal Phone ("ghosting", anti-shake do Bigme elogiado) | Performance de render estável > recursos extras |
| Textura "paper-like" tem valor percebido | Capa/textura papel elogiada no Palma 2 Pro/VWoods | Estética tátil/visual de papel = parte da identidade visual do app |
| Fricção de setup afasta gente normal | VWoods exigiu GSF ID manual p/ Play Store; "there's no manual, no onboarding" | Onboarding impecável é oportunidade real de diferenciação |
| Público-alvo existe e paga | Palma 2 Pro "absolute smash hit… TikTok etc."; valor: HiBreak S < £200 | Mercado ativo de leitura em celular além do Kindle |

### Outros achados de busca
- **NXTPAPER** (TCL): tela fosca "tipo papel" em celulares LCD comuns — prova que "papel em tela comum"
  vende como conceito de marketing (Slashgear, jan/2025).
- **Good e-Reader / Lifehacker / XDA**: consenso de reviews — Palma é amado porque roda *apps de leitura
  normais* numa tela confortável → valida tese do Papel: levar conforto de e-reader ao celular que a pessoa já tem.

## 3) X/Twitter

X é mal indexado por buscadores; buscas com `site:x.com` retornaram pouco relevante.
Evidências adjacentes obtidas:

- **App "Blue Light Filter" (iOS, App Store)**: nota 3,3★ — reviews mostram usuários revoltados por
  cobrarem assinatura pelo que o Night Shift faz grátis. **Lição:** filtro de luz azul sozinho não sustenta
  um app; precisa estar dentro de uma experiência de leitura completa (exatamente a tese do Papel).
- **Kindle Blue Shade**: Amazon trata filtro azul como recurso nativo de leitor — mesmo posicionamento que o Papel adotará.
- Discussões sobre Palma/e-ink phones concentram-se em Reddit + YouTube; X é eco dessas duas fontes.

## Conclusões para o produto

1. **Diferenciais validados pelo usuário real:** memória de preferências por livro/app, temperatura de
   cor fina, grayscale limpo, ausência de ghosting, textura/estética papel, onboarding zero-fricção.
2. **Anti-padrões a evitar:** filtro azul vendido sozinho (app iOS 3,3★), menus genéricos, settings que se
   perdem entre sessões.
3. **Posicionamento:** "trazer o conforto de leitura dos e-ink phones ao celular que você já tem" —
   nicho comprovadamente engajado (Palma viralizou no TikTok/YouTube).
4. ✅ Reddit coberto via websearch (seção 1): dores nº1 = importação de arquivos, conforto noturno
   (brilho sub-mínimo + temperatura de cor fina) e preservação de contraste. Busca semântica reddapi
   fica como upgrade opcional se `REDDAPI_API_KEY`/`REDDAPI_AUTH` forem configuradas.

## Fontes (Reddit via websearch, 24/08/2026)
- https://www.reddit.com/r/ereader/comments/1gggv7a/ (import PDF falhando no Moon+)
- https://www.reddit.com/r/androidapps/comments/1ls62f/ (viewer padrão não abre PDF)
- https://www.reddit.com/r/Supernote/comments/1fwvii0/ (KOReader crop landscape + RTL)
- https://www.reddit.com/r/Boox/comments/1qxu6o4/ (medo de perder anotações de PDF)
- https://www.reddit.com/r/ebooks/comments/sqqvp8/ (PDF high-dpi melhor no mobile que PC)
- https://www.reddit.com/r/apps/comments/18lrc59/ (gap iOS: escurecer além do Night Shift)
- https://www.reddit.com/r/kobo/comments/1icwagr/ (Clara BW "not dim enough" à noite)
- https://www.reddit.com/r/kobo/comments/1r4ktum/ e /comments/1r5tgoa/ (rituais warm light: 1% + warmth máx)
- https://www.reddit.com/r/SaaS/comments/1pnrisq/ (dark mode harsh p/ leitura → tint equilibrada)
- https://www.reddit.com/r/ereader/comments/1gv8yar/ (visão embaçada lendo no phone/iPad)
- https://www.reddit.com/r/kobo/comments/1mkdrz5/ (screen door effect → dor de cabeça)
- https://www.reddit.com/r/kindle/comments/1rmhoai/ (highlight opaco destruiu contraste)
- https://www.reddit.com/r/kindle/comments/1nuzcrk/ (OpenDyslexic: "can't go back")
- https://www.reddit.com/r/eink/comments/1r4djir/ (workflow e-ink: claro/alto contraste/anti-ghosting)

## Fontes (YouTube/X — coleta anterior)
- Transcrição: https://www.youtube.com/watch?v=yFptQHdaDS8 (Kit Betts-Masters, 26/02/2026)
- https://www.slashgear.com/1752969/boox-palma-ereader-alternatives (NXTPAPER, inkPalm)
- https://lifehacker.com/tech/onyx-boox-palma-phone-ereader-review
- https://9to5google.com/2024/01/26/review-boox-palma
- https://www.androidcentral.com/tablets/buy-a-boox-on-black-friday (PWM, luz sem flicker)
- Buscas websearch: "blue light filter" App Store reviews; Kindle Blue Shade
