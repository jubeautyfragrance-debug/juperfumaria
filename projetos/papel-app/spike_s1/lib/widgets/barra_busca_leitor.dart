import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:pdfrx/pdfrx.dart';
import '../theme/tokens.dart';

/// Barra de busca integrada ao leitor — aparece/desaparece com animação.
class BarraBuscaLeitor extends StatefulWidget {
  final PdfTextSearcher searcher;
  final VoidCallback onClose;

  const BarraBuscaLeitor({
    super.key,
    required this.searcher,
    required this.onClose,
  });

  @override
  State<BarraBuscaLeitor> createState() => _BarraBuscaLeitorState();
}

class _BarraBuscaLeitorState extends State<BarraBuscaLeitor>
    with SingleTickerProviderStateMixin {
  final _controller = TextEditingController();
  final _focusNode = FocusNode();
  late AnimationController _animCtrl;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _animCtrl = AnimationController(
      vsync: this,
      duration: PapelTokens.durationNormal,
    );
    _fadeAnim = CurvedAnimation(parent: _animCtrl, curve: Curves.easeOutCubic);
    _animCtrl.forward();
    _focusNode.requestFocus();

    widget.searcher.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    widget.searcher.removeListener(_onSearchChanged);
    _controller.dispose();
    _focusNode.dispose();
    _animCtrl.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    if (mounted) setState(() {});
  }

  void _search(String query) {
    HapticFeedback.selectionClick();
    widget.searcher.startTextSearch(
      query,
      caseInsensitive: true,
      goToFirstMatch: true,
      searchImmediately: true,
    );
  }

  void _prevMatch() {
    HapticFeedback.lightImpact();
    widget.searcher.goToPrevMatch();
  }

  void _nextMatch() {
    HapticFeedback.lightImpact();
    widget.searcher.goToNextMatch();
  }

  void _close() {
    HapticFeedback.lightImpact();
    widget.searcher.resetTextSearch();
    _animCtrl.reverse().then((_) => widget.onClose());
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final s = widget.searcher;
    final total = s.matches.length;
    final current = s.currentIndex;

    return FadeTransition(
      opacity: _fadeAnim,
      child: SafeArea(
        child: Container(
          margin: const EdgeInsets.fromLTRB(12, 8, 12, 0),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: cs.surface.withValues(alpha: 0.95),
            borderRadius: BorderRadius.circular(PapelTokens.radiusMedium),
            boxShadow: PapelTokens.shadowMedium,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Campo de busca
              Row(
                children: [
                  const Icon(Icons.search, size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      focusNode: _focusNode,
                      style: PapelTokens.body.copyWith(color: cs.onSurface),
                      decoration: InputDecoration(
                        hintText: 'Buscar no documento...',
                        hintStyle: PapelTokens.body.copyWith(
                          color: cs.onSurfaceVariant,
                        ),
                        border: InputBorder.none,
                        isDense: true,
                        contentPadding: EdgeInsets.zero,
                      ),
                      onChanged: _search,
                      onSubmitted: _search,
                    ),
                  ),
                  if (total > 0)
                    Text(
                      '${(current ?? 0) + 1}/$total',
                      style: PapelTokens.caption.copyWith(
                        color: cs.onSurfaceVariant,
                        fontFeatures: [const FontFeature.tabularFigures()],
                      ),
                    ),
                  const SizedBox(width: 8),
                  // Navegação entre resultados
                  if (total > 1) ...[
                    IconButton(
                      icon: const Icon(Icons.keyboard_arrow_up, size: 20),
                      onPressed: _prevMatch,
                      padding: const EdgeInsets.all(PapelTokens.space12),
                      tooltip: 'Anterior',
                    ),
                    IconButton(
                      icon: const Icon(Icons.keyboard_arrow_down, size: 20),
                      onPressed: _nextMatch,
                      padding: const EdgeInsets.all(PapelTokens.space12),
                      tooltip: 'Próximo',
                    ),
                  ],
                  // Fechar
                  IconButton(
                    icon: const Icon(Icons.close, size: 20),
                    onPressed: _close,
                    padding: const EdgeInsets.all(PapelTokens.space12),
                    tooltip: 'Fechar busca',
                  ),
                ],
              ),
              // Barra de progresso da busca
              if (s.isSearching)
                Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: LinearProgressIndicator(
                    value: s.searchProgress,
                    minHeight: 2,
                    backgroundColor: cs.outline.withValues(alpha: 0.3),
                  ),
                ),
              // Nenhum resultado
              if (!s.isSearching &&
                  _controller.text.length >= 2 &&
                  total == 0)
                Padding(
                  padding: const EdgeInsets.only(top: 6),
                  child: Text(
                    'Nenhum resultado encontrado',
                    style: PapelTokens.caption.copyWith(
                      color: cs.onSurfaceVariant,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
