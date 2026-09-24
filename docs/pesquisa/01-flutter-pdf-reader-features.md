# Flutter PDF Reader Best Practices 2026

> Pesquisado em: 2026-08-25 | Confiança: alta

## Resumo executivo

- **pdfrx** é a biblioteca mais madura e completa para Flutter (342 likes, 381k downloads, v2.4.7), suportando todas as plataformas
- **Transições de página**: Apps como Apple Books usam curl/spread animations; pdfrx suporta scroll per-page e contínuo
- **Bookmarks UX**: Padrão é botão flutuante + sidebar com outline/títulos; persistência deve ser feita pelo app (não pelo viewer)
- **Estatísticas de leitura**: Apps modernos trackeiam duração por sessão, páginas lidas, velocidade, e streaks
- **Modo noite/filtro**: `ColorFiltered` com `BlendMode.difference` ou matrix de inversão; cuidado com bug diagonal no Android
- **Busca em PDF**: `PdfTextSearcher` do pdfrx com cache de texto por página; UX deve incluir match highlighting e navegação next/prev

## Descobertas principais

### Page Transition Patterns

**Fonte**: [Nutrient Flutter SDK](https://www.nutrient.io/guides/flutter/viewer/page-transition.md) - Configuração de transições:
- `scrollPerSpread` - Paginado (por spread/página)
- `scrollContinuous` - Scroll contínuo (recomendado para leitura)
- `curl` - Animação de página virando (apenas iOS)

**Fonte**: [pdfrx PdfViewerParams](https://pub.dev/documentation/pdfrx/latest/pdfrx/PdfViewerParams-class.html):
- pdfrx não tem transições curl nativas; usa scroll contínuo por padrão
- `scrollPhysics` e `scrollPhysicsScale` permitem customizar comportamento de drag/zoom
- `panAxis: PanAxis.free` vs `PanAxis.aligned` controla restrições de gesto

**Padrão observado em apps de referência**:
- **Apple Books**: Scroll vertical contínuo com snap por página; curl animation para paginação horizontal
- **Google Play Books**: Scroll vertical contínuo; transição suave entre páginas
- **Kindle**: Paginação horizontal com animação de deslize; opção de scroll vertical

### Bookmark UX Patterns

**Fonte**: [Nutrient Bookmarks](https://www.nutrient.io/guides/flutter/bookmarks/):
- Armazenamento via XMP metadata no PDF (compatível com Apple Preview)
- Indicator visual no iOS (configurável: `off`, `alwaysOn`, `onWhenBookmarked`)
- Toolbar button no Android

**Fonte**: [pdf_viewer_pro example](https://pub.dev/packages/pdf_viewer_pro/example):
- Bookmarks com `bookmarkStorageKey` para persistência
- Bottom sheet com lista de bookmarks
- Jump to page ao tocar no bookmark

**Padrão recomendado para Papel**:
1. **Botão flutuante** para toggle bookmark na página atual
2. **Sidebar/drawer** com lista de bookmarks
3. **Persistência local** com `shared_preferences` ou `sqflite`
4. **Sync com servidor** via callbacks (opcional)
5. **Nome automático** baseado no número da página + contexto

### Reading Statistics Tracking

**Fonte**: [ReadStats](https://github.com/tyshoe/ReadStats):
- Tracking granular: início/fim de página, duração, timestamp
- Streak tracking (ativo, em risco, quebrado)
- Heatmap de 90 dias com níveis de intensidade
- Metas de leitura (diárias, semanais, mensais)

**Fonte**: [pdf_viewer_pro](https://pub.dev/packages/pdf_viewer_pro/example):
- `enableSessionTracking` - Track reading duration and page progress
- Callbacks: `onSessionStart`, `onSessionEnd` com duração e página atual
- Server sync para persistência remota

**Fonte**: [BookVerse](https://github.com/rafeefdev/BookVerse):
- Sqflite para armazenamento relacional local
- Sessões granulares (páginas início/fim, duração, timestamp)
- Sincronização real-time com backend

**Modelo de dados recomendado**:
```dart
class ReadingSession {
  final String id;
  final String documentId;
  final DateTime startTime;
  final DateTime endTime;
  final int startPage;
  final int endPage;
  final int totalPages;
  final Duration duration;
  final int? wpm; // words per minute (se disponível)
}

class ReadingStats {
  final Map<String, Duration> dailyTime; // data -> duração total
  final Map<String, int> dailyPages; // data -> páginas lidas
  final int currentStreak;
  final int longestStreak;
  final Duration totalTime;
  final int totalPagesRead;
}
```

### Night Mode / Blue Light Filter

**Fonte**: [pdfrx Dark Mode Docs](https://github.com/espresso3389/pdfrx/blob/master/doc/Dark-Night-Mode-Support.md):
```dart
// Método recomendado (com workaround para bug diagonal Android)
const invertColors = ColorFilter.matrix([
  -1, 0, 0, 0, 255,
  0, -1, 0, 0, 255,
  0, 0, -1, 0, 255,
  0, 0, 0, 1, 0,
]);

ColorFiltered(
  colorFilter: darkMode ? invertColors : const ColorFilter.mode(Colors.white, BlendMode.dst),
  child: PdfViewer.file(filePath, ...),
)
```

**BUG CONHECIDO**: `ColorFilter.mode` com `BlendMode.difference` mostra linha diagonal cinza em alguns dispositivos Android ([pdfrx #492](https://github.com/espresso3389/pdfrx/issues/492), [flutter#176949](https://github.com/flutter/flutter/issues/176949))

**Fonte**: [flutter_pdfview limitation](https://github.com/endigo/flutter_pdfview/issues/213):
- `ColorFiltered` e `ShaderMask` **NÃO funcionam** sobre platform views no iOS
- `BackdropFilter` tem suporte parcial
- Workarounds: usar `nightMode` no Android nativo, ou screenshot + filtro Flutter

**Achado crítico para Papel**: Se usarmos pdfrx (que é platform view), o `ColorFiltered` pode não funcionar no iOS. Precisamos de abordagem alternativa:
1. **Android**: Usar `nightMode` nativo se disponível, ou `ColorFilter.matrix`
2. **iOS**: Usar screenshot + filtro, ou implementar filtro nativo via platform channel
3. **Alternativa universal**: Renderizar página como imagem e aplicar filtro via Flutter

**Filtros de luz azul** (estilo e-reader):
- Sepia: `ColorFilter.mode(Color(0xFF704214), BlendMode.multiply)`
- Papel: Background `Color(0xFFFFF8E1)` com texto escuro
- Alto contraste: Background preto, texto branco
- E-ink: Grayscale com contraste ajustável

### Search UX in PDF Readers

**Fonte**: [pdfrx Text Search](https://github.com/espresso3389/pdfrx/blob/master/doc/Text-Search.md):
- `PdfTextSearcher` com cache de texto por página
- Cache reduz busca de 29s para 226ms em buscas repetidas
- Highlighting automático de matches
- Navegação next/prev entre resultados

**Fonte**: [pdfrx search_view.dart](https://github.com/espresso3389/pdfrx/blob/master/packages/pdfrx/example/viewer/lib/search_view.dart):
- Processamento de texto: extração de linha inteira do match
- UI: campo de busca + contagem de resultados + navegação
- Highlighting visual nas páginas

**Padrão UX recomendado**:
1. **Ícone de busca** sempre visível no toolbar
2. **Campo de busca** com debounce (300ms)
3. **Match highlighting** amarelo nas páginas
4. **Contador** "X de Y resultados"
5. **Navegação** next/prev com scroll automático
6. **Close** limpa busca e highlights

## Comparação de opções

| Opção | Prós | Contras | Licença/Custo | Maturidade |
|-------|------|---------|---------------|------------|
| **pdfrx** | Multiplataforma, PDFium-based, 342 likes, MIT | Sem curl animation, platform view limitations iOS | MIT | Alta (v2.4.7) |
| **Nutrient SDK** | Features completas, bookmarks nativos | Comercial, mais pesado | Pago | Alta |
| **flutter_pdfview** | Simples, nightMode nativo Android | Limitado, sem busca, sem annotations | BSD | Média |
| **pdf_viewer_pro** | Wrapper do pdfrx com features extras | Nova, menos testada | MIT | Média |

## Contradições e incertezas

1. **ColorFiltered no iOS**: Há conflito entre fontes sobre suporte. A documentação oficial do Flutter diz que não funciona sobre platform views, mas há relatos de melhoria no Flutter master. **Status atual**: Não funciona de forma confiável.

2. **Performance de pdfrx com PDFs grandes**: Issue #319 mostra 4-10s de loading para PDFs com 1500+ páginas. Lazy loading foi implementado na v1.2.0 mas pode quebrar compatibilidade.

3. **Text selection**: pdfrx tem issues (#379) com SelectableRegion do Flutter; nova implementação está em branch `lazy_page_load`.

## Recomendação para o Papel

1. **Viewer principal**: Usar `pdfrx` v2.4.7+ (melhor opção open source)
2. **Dark mode**: Implementar com `ColorFilter.matrix` (workaround para bug Android)
3. **Bookmarks**: Persistir localmente com sqflite; UI com botão flutuante + drawer
4. **Estatísticas**: Sistema de sessões granular com sqflite + callbacks no viewer
5. **Busca**: Usar `PdfTextSearcher` do pdfrx com debounce e highlighting
6. **Transições**: Scroll contínuo vertical (padrão moderno)

## Fontes

- [pdfrx pub.dev](https://pub.dev/packages/pdfrx) - v2.4.7, 342 likes
- [pdfrx Dark Mode Docs](https://github.com/espresso3389/pdfrx/blob/master/doc/Dark-Night-Mode-Support.md)
- [pdfrx Text Search](https://github.com/espresso3389/pdfrx/blob/master/doc/Text-Search.md)
- [pdfrx Issue #319 - Performance](https://github.com/espresso3389/pdfrx/issues/319)
- [pdfrx Issue #492 - Diagonal line bug](https://github.com/espresso3389/pdfrx/issues/492)
- [pdfrx Issue #379 - Text selection](https://github.com/espresso3389/pdfrx/issues/379)
- [Nutrient Flutter SDK](https://www.nutrient.io/guides/flutter/bookmarks/)
- [flutter_pdfview iOS limitations](https://github.com/endigo/flutter_pdfview/issues/213)
- [ReadStats GitHub](https://github.com/tyshoe/ReadStats)
- [pdf_viewer_pro](https://pub.dev/packages/pdf_viewer_pro/example)
- [BookVerse](https://github.com/rafeefdev/BookVerse)
- [LibreRead](https://github.com/Mawfyy/LibreRead)
- [PolyCode - Mobile PDF UI/UX](https://www.polycode.tech/designing-mobile-friendly-ui-ux-for-pdf-reader-apps/)
