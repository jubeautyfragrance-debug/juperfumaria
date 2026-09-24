# Pesquisa Técnica - Projeto Papel

> Última atualização: 2026-08-25

## Documentos

| Documento | Tópico | Status |
|-----------|--------|--------|
| [01-flutter-pdf-reader-features.md](01-flutter-pdf-reader-features.md) | Flutter PDF reader best practices 2026 | ✅ Completo |
| [02-pdfrx-advanced-features.md](02-pdfrx-advanced-features.md) | pdfrx advanced features | ✅ Completo |
| [03-wakelock-plus-share-plus.md](03-wakelock-plus-share-plus.md) | wakelock_plus + share_plus | ✅ Completo |

## Resumo das Recomendações

### Stack Tecnológica Recomendada

| Componente | Tecnologia | Versão | Justificativa |
|------------|------------|--------|---------------|
| **PDF Viewer** | pdfrx | v2.4.7+ | Melhor opção open source; 342 likes, 381k downloads; multiplataforma |
| **State Management** | Riverpod | v2+ | Recomendado para apps complexos; usado em projetos referência |
| **Persistência Local** | sqflite | - | Para bookmarks, estatísticas, sessões de leitura |
| **Wakelock** | wakelock_plus | v1.4.0+ | Simples, multiplataforma, sem permissões |
| **Sharing** | share_plus | v13.3.0+ | API moderna, Flutter Favorite |

### Decisões Críticas

1. **Dark Mode no iOS**: `ColorFiltered` NÃO funciona sobre platform views no iOS. Usar `ColorFilter.matrix` para inversão de cores, ou screenshot + filtro Flutter.

2. **Bookmarks**: pdfrx NÃO tem sistema de bookmarks persistente. Implementar sistema próprio com sqflite.

3. **share_plus iOS 26**: SEMPRE fornecer `sharePositionOrigin` para evitar crash.

4. **Performance PDFs grandes**: Usar `onViewerReady` em vez de polling `isReady`; configurar `onePassRenderingScaleThreshold`.

### Issues a Monitorar

- [pdfrx #379](https://github.com/espresso3389/pdfrx/issues/379) - Nova implementação de text selection
- [pdfrx #492](https://github.com/espresso3389/pdfrx/issues/492) - Bug diagonal line no Android
- [wakelock_plus #110](https://github.com/fluttercommunity/wakelock_plus/issues/110) - iOS screen staying on
- [wakelock_plus #117](https://github.com/fluttercommunity/wakelock_plus/issues/117) - AGP 9 compatibility
- [flutter/flutter#176949](https://github.com/flutter/flutter/issues/176949) - ColorFiltered diagonal line bug
