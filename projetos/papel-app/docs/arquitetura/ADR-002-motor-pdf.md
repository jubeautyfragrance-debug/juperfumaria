# ADR-002: Motor de PDF — pdfrx (PDFium) com opção CoreGraphics no iOS

> Data: 24/08/2026 | Status: DECIDIDO (validação pendente)

## Contexto
O coração do Papel é renderizar PDFs locais grandes com fluidez e expor cada página como superfície que nossos filtros de cor possam transformar.

## Opções consideradas
1. **pdfrx** (MIT, sobre PDFium via FFI) — 340 likes, 13k downloads/dia, 160/160 pub points, mantido ativamente (v2.4.7, jul/2026; commits semanais)
2. **pdfx** — popular mas com problemas de performance em scroll
3. **flutter_pdfview** — usa viewer nativo em platform view (perde controle de pixels p/ shaders)
4. **SDKs pagos** (Nutrient/Apryse) — custo $$$$ desnecessário no MVP
5. **Wrappers nativos próprios** (PDFKit + PdfRenderer) — 2 integrações, renderização inconsistente entre plataformas

## Decisão: pdfrx
Arquitetura em camadas do pacote ([libraries.io/pdfrx](https://libraries.io/pub/pdfrx)):
```
pdfrx            → widgets/viewer Flutter (zoom, pan, seleção de texto)
 └ pdfrx_engine  → API pura Dart de renderização/manipulação
    └ pdfium_flutter → FFI + empacotamento do PDFium por plataforma
       └ PDFium   → motor C++ do Chromium (BSD-style)
```

### Bônus descoberto na pesquisa
`pdfrx_coregraphics` (experimental): **drop-in replacement** que usa PDFKit/CoreGraphics no iOS/macOS mantendo a mesma API dos widgets. Estratégia:
- **MVP**: PDFium nas duas plataformas → renderização idêntica, um só caminho de bugs
- **Futuro**: se fidelidade/fôlego de bateria no iOS pedir, trocar para CoreGraphics sem reescrever UI

### Prova social
Apps reais usam pdfrx: Saber (4.4k★), Butterfly (1.8k★) — ambos apps de anotação pesada em PDF.

## Consequências
- ✅ MIT (sem custo/licença), offline-first, textura da página acessível ao nosso pipeline de shader
- ✅ Seleção de texto, zoom e pan já prontos no viewer
- ⚠️ Issue conhecida apenas na WEB (~40MB do pdfium ficam em memória após dispose) — irrelevante para mobile nativo ([issue #430](https://github.com/espresso3389/pdfrx/issues/430))
- ⚠️ Manter pin de versão + changelog monitorado (271 releases = ritmo alto)

## Validação obrigatória (spike S1, junto ao ADR-001)
1. Abrir os 3 PDFs de teste; scroll contínuo 60fps
2. Renderizar página como `ui.Image` e aplicar `ColorFilter`/fragment shader por cima (prova do pipeline de cor)
3. Medir memória com documento de 1000 páginas aberto

## Fontes
- https://pub.dev/packages/pdfrx
- https://pub.dev/packages/pdfrx_coregraphics
- docs/pesquisa/pdf-engines.md
