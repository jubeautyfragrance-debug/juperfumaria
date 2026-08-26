import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/tokens.dart';
import 'sheet_ajustes.dart';

/// Barra de ferramentas flutuante do leitor — aparece/desaparece com toque.
class BarraFerramentasLeitor extends StatelessWidget {
  final int currentPage;
  final int totalPages;
  final ModoTela modoAtual;
  final bool visible;
  final String? documentName;
  final VoidCallback? onBack;
  final VoidCallback? onSettings;
  final ValueChanged<int>? onPageChanged;
  final VoidCallback? onSearch;
  final VoidCallback? onToc;
  final VoidCallback? onGoToPage;
  final VoidCallback? onSleepTimer;
  final VoidCallback? onBookmark;
  final bool isBookmarked;
  final VoidCallback? onShare;
  final VoidCallback? onHighlight;
  final VoidCallback? onHighlightColor;
  final bool hasSelection;
  final Widget? timerWidget;

  const BarraFerramentasLeitor({
    super.key,
    required this.currentPage,
    required this.totalPages,
    required this.modoAtual,
    this.visible = true,
    this.documentName,
    this.onBack,
    this.onSettings,
    this.onPageChanged,
    this.onSearch,
    this.onToc,
    this.onGoToPage,
    this.onSleepTimer,
    this.onBookmark,
    this.isBookmarked = false,
    this.onShare,
    this.onHighlight,
    this.onHighlightColor,
    this.hasSelection = false,
    this.timerWidget,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return AnimatedOpacity(
      opacity: visible ? 1.0 : 0.0,
      duration: PapelTokens.durationNormal,
      child: AnimatedSlide(
        offset: visible ? Offset.zero : const Offset(0, -0.05),
        duration: PapelTokens.durationNormal,
        curve: Curves.easeOutCubic,
        child: IgnorePointer(
          ignoring: !visible,
          child: Column(
            children: [
              // ─── AppBar superior com gradiente ───
              Container(
                padding: EdgeInsets.fromLTRB(
                  PapelTokens.space4,
                  MediaQuery.of(context).padding.top + PapelTokens.space4,
                  PapelTokens.space8,
                  PapelTokens.space4,
                ),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      cs.surface.withValues(alpha: 0.95),
                      cs.surface.withValues(alpha: 0.85),
                    ],
                  ),
                ),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back_ios_new, size: 20),
                      onPressed: onBack,
                      tooltip: 'Voltar',
                    ),
                    const SizedBox(width: PapelTokens.space4),
                    Expanded(
                      child: GestureDetector(
                        onTap: onGoToPage,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            if (documentName != null)
                              Text(
                                documentName!,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: PapelTokens.caption.copyWith(
                                  color: cs.onSurfaceVariant,
                                ),
                              ),
                            Text(
                              '$currentPage / $totalPages',
                              style: PapelTokens.subhead.copyWith(
                                color: cs.onSurface,
                                fontFeatures: [const FontFeature.tabularFigures()],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    // Badge do modo
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: cs.primaryContainer,
                        borderRadius: BorderRadius.circular(PapelTokens.radiusFull),
                      ),
                      child: Text(
                        modoAtual.rotulo,
                        style: PapelTokens.caption.copyWith(
                          color: cs.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    const SizedBox(width: PapelTokens.space4),
                    IconButton(
                      icon: const Icon(Icons.search, size: 20),
                      onPressed: onSearch,
                      tooltip: 'Buscar',
                    ),
                    IconButton(
                      icon: const Icon(Icons.menu_book_outlined, size: 20),
                      onPressed: onToc,
                      tooltip: 'Sumário',
                    ),
                    IconButton(
                      icon: Icon(
                        isBookmarked ? Icons.bookmark : Icons.bookmark_outline,
                        size: 20,
                        color: isBookmarked ? cs.primary : null,
                      ),
                      onPressed: onBookmark,
                      tooltip: isBookmarked ? 'Remover marca' : 'Marcar página',
                    ),
                    if (hasSelection)
                      IconButton(
                        icon: const Icon(Icons.highlight, size: 20),
                        onPressed: onHighlight,
                        tooltip: 'Destacar texto',
                      ),
                    if (hasSelection)
                      IconButton(
                        icon: Icon(
                          Icons.palette_outlined,
                          size: 20,
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                        onPressed: onHighlightColor,
                        tooltip: 'Cor do destaque',
                      ),
                    ?timerWidget,
                    if (onSleepTimer != null)
                      IconButton(
                        icon: const Icon(Icons.bedtime_outlined, size: 20),
                        onPressed: onSleepTimer,
                        tooltip: 'Timer de sono',
                      ),
                    IconButton(
                      icon: const Icon(Icons.share_outlined, size: 20),
                      onPressed: onShare,
                      tooltip: 'Compartilhar',
                    ),
                    IconButton(
                      icon: const Icon(Icons.tune, size: 20),
                      onPressed: onSettings,
                      tooltip: 'Ajustes',
                    ),
                  ],
                ),
              ),
              const Spacer(),
              // ─── Barra inferior com gradiente (page scrubber) ───
              Container(
                padding: EdgeInsets.fromLTRB(
                  16,
                  8,
                  16,
                  MediaQuery.of(context).padding.bottom + 8,
                ),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [
                      cs.surface.withValues(alpha: 0.95),
                      cs.surface.withValues(alpha: 0.85),
                    ],
                  ),
                ),
                child: Row(
                  children: [
                    Text(
                      '1',
                      style: PapelTokens.caption.copyWith(
                        color: cs.onSurfaceVariant,
                        fontFeatures: [const FontFeature.tabularFigures()],
                      ),
                    ),
                    Expanded(
                      child: Slider(
                        value: currentPage.toDouble().clamp(1, totalPages.toDouble()),
                        min: 1,
                        max: totalPages.toDouble().clamp(1, double.infinity),
                        divisions: totalPages > 1 ? totalPages - 1 : 1,
                        onChanged: (v) {
                          HapticFeedback.selectionClick();
                          onPageChanged?.call(v.round());
                        },
                      ),
                    ),
                    Text(
                      '$totalPages',
                      style: PapelTokens.caption.copyWith(
                        color: cs.onSurfaceVariant,
                        fontFeatures: [const FontFeature.tabularFigures()],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
