# Motores de Renderização PDF Mobile

> Pesquisado em: 24/08/2026 | Confiança: alta

## Resumo executivo
- **PDFium** (motor do Chrome/Android) é o padrão ouro open-source: rápido, preciso, licença BSD-style, funciona em iOS e Android
- **Apple PDFKit** é nativo do iOS: excelente integração mas só existe na Apple
- SDKs comerciais (Nutrient/PSPDFKit, Apryse) são potentes porém caros (milhares de $/ano) — desnecessários para o MVP do Papel
- Estratégia recomendada: **PDFium no Android + PDFKit no iOS**, abstraídos atrás de uma interface única; ou PDFium nas duas plataformas para consistência de renderização

## Comparação de opções

| Opção | Licença | Custo | Performance | Plataformas | Risco |
|---|---|---|---|---|---|
| **PDFium** | BSD-style (Google) | Grátis | Excelente (Chrome usa) | iOS, Android, desktop | Precisa de bindings/wrapper |
| **Apple PDFKit** | Nativa Apple | Grátis | Excelente no iOS | Só Apple | Nenhum (no iOS) |
| **Android PdfRenderer** | Nativa Android (baseada em PDFium) | Grátis | Boa (renderiza p/ bitmap) | Só Android | API básica |
| **Nutrient (ex-PSPDFKit)** | Comercial | $$$ (contato sales) | Superior c/ arquivos complexos | Todas + Flutter/RN | Vendor lock-in |
| **Apryse (ex-PDFTron)** | Comercial | $$$ | Alta | Todas | Vendor lock-in |
| **PDF.js** | Apache (Mozilla) | Grátis | Fraca em PDFs grandes (canvas/WASM) | Web | Não serve p/ mobile nativo |

## Descobertas principais

1. **PDFium** mantido pelo projeto Chromium, usado no Chrome e no Android (`PdfRenderer` é um wrapper dele). Renderiza fontes, imagens e layouts com precisão; suporta formulários, anotações e assinaturas via API ([Syncfusion, 02/2026](https://www.syncfusion.com/blogs/post/pdf-rendering-engines-comparison))
2. **Licença liberai**: PDFium pode ser embutido em apps comerciais sem custo nem obrigação de abrir código ([dev.to, 02/2025](https://dev.to/zubinajmera/why-pdfium-remains-the-most-trusted-pdf-rendering-platform-debunking-the-myths-32o4))
3. SDKs proprietários ganham em **arquivos grandes e complexos** com otimizações como linearização, mas para um leitor local simples o PDFium bem integrado atinge os mesmos níveis com trabalho próprio ([Nutrient blog](https://www.nutrient.io/blog/proprietary-vs-open-source-pdf-sdks))
4. No ecossistema Flutter já existem wrappers maduros de PDFium (ex: `pdfrx`, `pdfx`) que expõem renderização por página como textura — base ideal para aplicar shaders de filtro por cima

## Arquitetura de renderização recomendada (Papel)
```
Arquivo PDF local
   → motor (PDFium / PDFKit) renderiza página → textura/bitmap
   → pipeline de cor (shader fragment): temperatura Kelvin, grayscale, contraste papel
   → composição na tela (60fps, tiles visíveis apenas)
```
- Renderizar **só as páginas visíveis + buffer** (virtualização) para PDFs de 500+ páginas
- Cache LRU de bitmaps renderizados (~50-100MB teto)
- Zoom = re-render da tile em DPI maior sob demanda

## Contradições e incertezas
- Apryse afirma que forks de PDFium "sofrem" com arquivos grandes; Nutrient (que É baseado em PDFium) diz o oposto — marketing dos dois lados. Testar com PDFs reais pesados é obrigatório antes de fechar arquitetura
- unknown: benchmarks públicos independentes PDFium vs PDFKit em dispositivos low-end Android 2026

## Fontes
- https://www.syncfusion.com/blogs/post/pdf-rendering-engines-comparison (02/2026)
- https://www.nutrient.io/blog/proprietary-vs-open-source-pdf-sdks
- https://apryse.com/alternatives/nutrient (comparativo com viés comercial)
- https://www.datalogics.com/adobe-pdf-library-vs-apryse-vs-nutrient (07/2026)
