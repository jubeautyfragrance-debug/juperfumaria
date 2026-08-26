import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import '../models/pdf_item.dart';
import '../theme/tokens.dart';

/// Card de PDF na biblioteca — estilo Apple Books com scale-down no toque.
class CardPdf extends StatefulWidget {
  final PdfItem item;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;

  const CardPdf({
    super.key,
    required this.item,
    this.onTap,
    this.onLongPress,
  });

  @override
  State<CardPdf> createState() => _CardPdfState();
}

class _CardPdfState extends State<CardPdf>
    with SingleTickerProviderStateMixin {
  /// Thumbnail existe apenas em plataformas nativas (gerado localmente).
  bool get _temThumbnailLocal =>
      !kIsWeb &&
      widget.item.thumbnailPath != null &&
      File(widget.item.thumbnailPath!).existsSync();
  late final AnimationController _scaleCtrl;
  late final Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();
    _scaleCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
      reverseDuration: const Duration(milliseconds: 200),
    );
    _scaleAnim = Tween<double>(begin: 1, end: 0.96).animate(
      CurvedAnimation(parent: _scaleCtrl, curve: Curves.easeOutCubic),
    );
  }

  @override
  void dispose() {
    _scaleCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return GestureDetector(
      onTapDown: (_) => _scaleCtrl.forward(),
      onTapUp: (_) {
        _scaleCtrl.reverse();
        widget.onTap?.call();
      },
      onTapCancel: () => _scaleCtrl.reverse(),
      onLongPress: widget.onLongPress,
      child: ScaleTransition(
        scale: _scaleAnim,
        child: AnimatedContainer(
          duration: PapelTokens.durationFast,
          decoration: BoxDecoration(
            color: cs.surface,
            borderRadius: BorderRadius.circular(PapelTokens.radiusMedium),
            border: Border.all(color: cs.outline.withValues(alpha: 0.5)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Capa do PDF
              Expanded(
                flex: 5,
                child: Container(
                  margin: const EdgeInsets.all(PapelTokens.space8),
                  decoration: BoxDecoration(
                    color: cs.primaryContainer,
                    borderRadius: BorderRadius.circular(PapelTokens.radiusSmall),
                  ),
                  child: Stack(
                    children: [
                      // Thumbnail real ou ícone placeholder
                      if (_temThumbnailLocal)
                        Positioned.fill(
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(PapelTokens.radiusSmall),
                            child: Image.file(
                              File(widget.item.thumbnailPath!),
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stack) => Center(
                                child: Icon(
                                  Icons.picture_as_pdf_rounded,
                                  size: 40,
                                  color: cs.primary.withValues(alpha: 0.4),
                                ),
                              ),
                            ),
                          ),
                        )
                      else
                        Center(
                          child: Icon(
                            Icons.picture_as_pdf_rounded,
                            size: 40,
                            color: cs.primary.withValues(alpha: 0.4),
                          ),
                        ),
                      if (widget.item.lastPage != null && widget.item.lastPage! > 0)
                        Positioned(
                          bottom: 6,
                          right: 6,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.black.withValues(alpha: 0.5),
                              borderRadius: BorderRadius.circular(PapelTokens.radiusSmall),
                            ),
                            child: Text(
                              '${widget.item.lastPage}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                      if (widget.item.lastPage != null &&
                          widget.item.lastPage! > 0 &&
                          widget.item.totalPages > 0)
                        Positioned(
                          left: 0,
                          right: 0,
                          bottom: 0,
                          child: ClipRRect(
                            borderRadius: const BorderRadius.vertical(
                              bottom: Radius.circular(PapelTokens.radiusSmall),
                            ),
                            child: LinearProgressIndicator(
                              value: (widget.item.lastPage! / widget.item.totalPages).clamp(0.0, 1.0),
                              minHeight: 3,
                              backgroundColor: Colors.black.withValues(alpha: 0.15),
                              valueColor: AlwaysStoppedAnimation<Color>(cs.primary),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              // Info
              Expanded(
                flex: 2,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(PapelTokens.space8, 0, PapelTokens.space8, PapelTokens.space8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Text(
                        widget.item.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: PapelTokens.footnote.copyWith(
                          color: cs.onSurface,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        _subtitle(widget.item),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: PapelTokens.caption.copyWith(
                          color: cs.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _subtitle(PdfItem item) {
    final parts = <String>[];
    if (item.lastPage != null && item.lastPage! > 0 && item.totalPages > 0) {
      final pct = (item.lastPage! * 100 / item.totalPages).round();
      parts.add('$pct% lido');
    }
    parts.add(_formatDate(item.lastOpened));
    return parts.join(' · ');
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);
    if (diff.inMinutes < 1) return 'Agora';
    if (diff.inHours < 1) return '${diff.inMinutes}min atrás';
    if (diff.inDays < 1) return '${diff.inHours}h atrás';
    if (diff.inDays < 7) return '${diff.inDays}d atrás';
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}';
  }
}
