# pdfrx Advanced Features

> Pesquisado em: 2026-08-25 | Confiança: alta

## Resumo executivo

- **pdfrx v2.4.7**: Package principal com widgets Flutter; pdfrx_engine v0.4.5 para lógica low-level
- **Extração de texto**: API `PdfPage.loadText()` retorna `PdfPageText` com fragments e bounding boxes
- **Bookmark persistence**: pdfrx NÃO gerencia persistência — app deve implementar via shared_preferences/sqflite
- **Performance**: Lazy loading desde v1.2.0; cache de texto reduz busca de 29s para 226ms
- **Text selection**: Habilitado por padrão; suporta handles nativos, magnifier, context menu

## Descobertas principais

### 1. Text Extraction Efficiently

**Fonte**: [pdfrx_engine API](https://pub.dev/documentation/pdfrx_engine/latest/pdfrx_engine/):
```dart
// Extração de texto de uma página específica
final page = document.pages[pageNumber];
final pageText = await page.loadText();

// pageText é PdfPageText com:
// - fragments: List<PdfPageTextFragment>
// - Cada fragment tem: text, boundingRect, charRects
```

**Fonte**: [pdfrx Engine Example](https://pub.dev/packages/pdfrx_engine/example):
- Conversão de PDF para PNG + extração de texto
- Text extraction API separada da renderização

**Fonte**: [pdfrx Issue #293 - Text Caching](https://github.com/espresso3389/pdfrx/issues/293):
- PR introduce cache de texto por página
- Primeira busca: 29,288ms
- Buscas subsequentes: 226ms (129x mais rápido)
- Cache implementado via `_cachedText` em `PdfTextSearcher`

**Código otimizado para extração**:
```dart
// Para extração em lote (múltiplas páginas)
Future<Map<int, String>> extractTextFromPages(
  PdfDocument doc,
  List<int> pageNumbers,
) async {
  final results = <int, String>{};
  for (final pageNum in pageNumbers) {
    final page = doc.pages[pageNum - 1]; // 1-indexed para 0-indexed
    final text = await page.loadText();
    results[pageNum] = text.fragments.map((f) => f.text).join();
  }
  return results;
}
```

**Achado importante**: A API mudou nas versões recentes:
- `loadText()` e `loadTextCharRects()` foram integrados em um único `loadText()` (Issue #434)
- Retorna `PdfPageText` que contém tanto o texto quanto as coordenadas dos caracteres

### 2. Bookmark Persistence

**ACHADO CRÍTICO**: pdfrx **NÃO** tem sistema de bookmarks persistente. O `PdfOutlineNode` (aka bookmarks/outline) é apenas a estrutura hierárquica do PDF original (Table of Contents).

**Fonte**: [pdfrx Document Outline Docs](https://github.com/espresso3389/pdfrx/blob/master/doc/Document-Outline-(a.k.a-Bookmarks).md):
- `PdfOutlineNode` = outline/TOC do PDF (read-only)
- NÃO é para bookmarks do usuário

**Estratégia recomendada para Papel**:
```dart
class UserBookmark {
  final String documentId;
  final int pageNumber;
  final DateTime createdAt;
  final String? title; // opcional, ex: "Capítulo 3"
  final String? note; // opcional
}

// Persistência com sqflite ou shared_preferences
class BookmarkService {
  Future<void> addBookmark(String docId, int page) async { ... }
  Future<void> removeBookmark(String docId, int page) async { ... }
  Future<List<UserBookmark>> getBookmarks(String docId) async { ... }
  Future<bool> isBookmarked(String docId, int page) async { ... }
}
```

**Referência**: [Nutrient SDK Bookmarks](https://www.nutrient.io/guides/flutter/bookmarks/) mostra padrão com `BookmarkFactory.forPage()` — mas isso é SDK proprietário.

### 3. Performance Optimization for Large PDFs

**Fonte**: [pdfrx Issue #319 - Performance](https://github.com/espresso3389/pdfrx/issues/319):
- **Problema**: PDFs com 1500+ páginas tinham loading de 4-10s
- **Causa**: pdfrx carregava todas as páginas para estrutura do documento
- **Solução**: Lazy loading implementado na v1.2.0
- **Branch**: `lazy_page_load` no GitHub

**Fonte**: [pdfrx Issue #393 - isReady timing](https://github.com/espresso3389/pdfrx/issues/393):
- `PdfViewerParams.onViewerReady` chamado quando viewer está pronto
- `PdfViewerController.isReady` pode demorar >1s para PDFs grandes
- Usar `onViewerReady` em vez de polling de `isReady`

**Parâmetros de otimização**:
```dart
PdfViewerParams(
  // Limitar escala máxima de renderização
  onePassRenderingScaleThreshold: 3.0,
  
  // Usar escala alternativa como mínimo (recomendado)
  useAlternativeFitScaleAsMinScale: true,
  
  // Limitar cache em memória
  maxImageBytesCachedOnMemory: 100 * 1024 * 1024, // 100MB
  
  // Loading indicator personalizado
  loadingBannerBuilder: (context, bytes, total) {
    final progress = total != null ? bytes / total : null;
    return LinearProgressIndicator(value: progress);
  },
)
```

**Otimizações adicionais**:
1. **Progressive rendering**: Páginas são renderizadas de cima para baixo
2. **Cancelamento de renderização**: `PdfPageRenderCancellationToken` cancela renders offscreen
3. **Cache de thumbnails**: Usar `PdfDocumentViewBuilder` + `PdfPageView` para thumbnails
4. **Pre-fetch**: Carregar páginas próximas da viewport

**Fonte**: [pdfrx Rendering Docs](https://pub.dev/packages/pdfrx/changelog):
- `PdfPage.render` limita resolução a 300 DPI por padrão
- `getPageRenderingScale` permite customizar escala de renderização
- Cancelamento automático de renders offscreen durante scroll rápido

### 4. Text Selection and Copy

**Fonte**: [pdfrx Text Selection Docs](https://pub.dev/packages/pdfrx):
- Habilitado por padrão (`enableTextSelection: true`)
- Handles nativos com suporte a drag
- Magnifier para seleção precisa
- Context menu com funcionalidade de copy

**Customização**:
```dart
PdfViewer.asset(
  'doc.pdf',
  params: PdfViewerParams(
    textSelectionParams: PdfTextSelectionParams(
      enabled: true,
      // Customizar magnifier
      magnifier: PdfViewerSelectionMagnifierParams(
        // parâmetros de posição/tamanho
      ),
    ),
    // Customizar context menu
    buildContextMenu: (context, params) {
      return CupertinoContextMenu(
        actions: [
          CupertinoContextMenuAction(
            child: Text('Copiar'),
            onPressed: () {
              // Copiar texto selecionado
              Clipboard.setData(ClipboardData(text: params.selectedText));
              Navigator.pop(context);
            },
          ),
        ],
      );
    },
  ),
)
```

**Fonte**: [pdfrx Issue #379 - New Text Selection](https://github.com/espresso3389/pdfrx/issues/379):
- **Problema atual**: `SelectableRegion` do Flutter tem limitações
- **Solução proposta**: Nova implementação customizada
- **Features planejadas**:
  - Cross-page selection (seleção entre páginas)
  - Lazy loading para "Select All"
  - Selection anchors em ambas pontas
  - Suporte a RTL/vertical writing

**Branch**: `claude/issue-379-20250531_081704` com implementação experimental

**API de extração de texto selecionado**:
```dart
// Via controller
final selection = controller.currentTextSelection;
if (selection != null) {
  final text = selection.selectedText;
  await Clipboard.setData(ClipboardData(text: text));
}

// Via callback
PdfViewerParams(
  onTextSelectionChange: (selection) {
    if (selection.isNotEmpty) {
      final selectedText = selection.last;
      // Processar texto selecionado
    }
  },
)
```

## Comparação de opções

| Feature | pdfrx | Nutrient SDK | flutter_pdfview |
|---------|-------|--------------|-----------------|
| Text extraction | ✅ API completa | ✅ API completa | ❌ |
| Text selection | ✅ Nativo + custom | ✅ Nativo | ❌ |
| Bookmarks (outline) | ✅ Read-only | ✅ Read/Write | ❌ |
| User bookmarks | ❌ App deve implementar | ✅ Nativo | ❌ |
| Search | ✅ PdfTextSearcher | ✅ Nativo | ❌ |
| Performance (large PDF) | ✅ Lazy loading v1.2+ | ✅ Otimizado | ⚠️ Limitado |
| Cross-platform | ✅ 6 plataformas | ✅ 3 plataformas | ⚠️ 2 plataformas |

## Contradições e incertezas

1. **Text selection stability**: Issue #379 mostra que a implementação atual tem problemas com scroll/zoom; nova implementação está em branch experimental. **Recomendação**: Testar extensivamente antes de production.

2. **pdfrx_coregraphics**: Experimental para iOS/macOS; pode reduzir tamanho do app mas tem limitações documentadas. **Status**: Não recomendado para produção ainda.

3. **Lazy loading breaking changes**: v1.2.0 quebrou compatibilidade com versões anteriores; apps existentes podem precisar de migração.

## Recomendação para o Papel

1. **Extração de texto**: Usar `PdfPage.loadText()` com cache manual para performance
2. **Bookmarks**: Implementar sistema próprio com sqflite; pdfrx apenas para TOC/outline
3. **Performance**: Configurar `onePassRenderingScaleThreshold` e usar `onViewerReady`
4. **Text selection**: Usar API padrão; monitorar issue #379 para melhorias
5. **Search**: Usar `PdfTextSearcher` com debounce e UI customizada

## Fontes

- [pdfrx pub.dev](https://pub.dev/packages/pdfrx) - v2.4.7
- [pdfrx_engine pub.dev](https://pub.dev/packages/pdfrx_engine) - v0.4.5
- [pdfrx GitHub](https://github.com/espresso3389/pdfrx)
- [pdfrx Issue #319 - Performance](https://github.com/espresso3389/pdfrx/issues/319)
- [pdfrx Issue #393 - isReady](https://github.com/espresso3389/pdfrx/issues/393)
- [pdfrx Issue #293 - Text Caching](https://github.com/espresso3389/pdfrx/issues/293)
- [pdfrx Issue #379 - Text Selection](https://github.com/espresso3389/pdfrx/issues/379)
- [pdfrx Issue #434 - API breaking](https://github.com/espresso3389/pdfrx/issues/434)
- [pdfrx Dark Mode Docs](https://github.com/espresso3389/pdfrx/blob/master/doc/Dark-Night-Mode-Support.md)
- [pdfrx Text Search Docs](https://github.com/espresso3389/pdfrx/blob/master/doc/Text-Search.md)
- [Nutrient Bookmarks](https://www.nutrient.io/guides/flutter/bookmarks/)
