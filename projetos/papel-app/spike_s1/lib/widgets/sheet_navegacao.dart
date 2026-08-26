import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:pdfrx/pdfrx.dart';
import '../theme/tokens.dart';

/// Sheet de navegação do PDF — Sumário + Miniaturas em uma única bottom sheet.
class SheetNavegacao extends StatefulWidget {
  final PdfDocument document;
  final PdfViewerController controller;
  final List<PdfOutlineNode>? outline;
  final int currentPage;

  const SheetNavegacao({
    super.key,
    required this.document,
    required this.controller,
    this.outline,
    required this.currentPage,
  });

  static Future<void> mostrar(
    BuildContext context, {
    required PdfDocument document,
    required PdfViewerController controller,
    List<PdfOutlineNode>? outline,
    required int currentPage,
  }) {
    HapticFeedback.mediumImpact();
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (_) => SheetNavegacao(
        document: document,
        controller: controller,
        outline: outline,
        currentPage: currentPage,
      ),
    );
  }

  @override
  State<SheetNavegacao> createState() => _SheetNavegacaoState();
}

class _SheetNavegacaoState extends State<SheetNavegacao>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final bottomPadding = MediaQuery.of(context).padding.bottom;

    return DraggableScrollableSheet(
      initialChildSize: 0.55,
      minChildSize: 0.3,
      maxChildSize: 0.85,
      expand: false,
      builder: (context, scrollController) {
        return Container(
          decoration: BoxDecoration(
            color: cs.surface,
            borderRadius: const BorderRadius.vertical(
              top: Radius.circular(PapelTokens.radiusXL),
            ),
          ),
          child: Column(
            children: [
              // Handle
              Padding(
                padding: const EdgeInsets.only(top: PapelTokens.space8),
                child: Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: cs.onSurfaceVariant.withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(PapelTokens.radiusFull),
                  ),
                ),
              ),

              // Tabs
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: PapelTokens.space16,
                  vertical: PapelTokens.space8,
                ),
                child: TabBar(
                  controller: _tabController,
                  labelColor: cs.primary,
                  unselectedLabelColor: cs.onSurfaceVariant,
                  indicatorColor: cs.primary,
                  dividerHeight: 0,
                  tabs: const [
                    Tab(icon: Icon(Icons.list_outlined, size: 20), text: 'Sumário'),
                    Tab(icon: Icon(Icons.grid_view_outlined, size: 20), text: 'Miniaturas'),
                  ],
                ),
              ),

              // Content
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    _SumarioTab(
                      outline: widget.outline,
                      document: widget.document,
                      controller: widget.controller,
                      currentPage: widget.currentPage,
                    ),
                    _MiniaturasTab(
                      document: widget.document,
                      controller: widget.controller,
                      currentPage: widget.currentPage,
                    ),
                  ],
                ),
              ),

              // Bottom safe area
              SizedBox(height: bottomPadding),
            ],
          ),
        );
      },
    );
  }
}

/// Tab de sumário (TOC/Outline).
class _SumarioTab extends StatelessWidget {
  final List<PdfOutlineNode>? outline;
  final PdfDocument document;
  final PdfViewerController controller;
  final int currentPage;

  const _SumarioTab({
    required this.outline,
    required this.document,
    required this.controller,
    required this.currentPage,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    if (outline == null) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (outline!.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.menu_book_outlined,
              size: 48,
              color: cs.onSurfaceVariant.withValues(alpha: 0.4),
            ),
            const SizedBox(height: PapelTokens.space12),
            Text(
              'Este PDF não possui sumário',
              style: PapelTokens.body.copyWith(
                color: cs.onSurfaceVariant,
              ),
            ),
          ],
        ),
      );
    }

    final entries = _flattenOutline(outline!);

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: PapelTokens.space8),
      itemCount: entries.length,
      itemBuilder: (context, index) {
        final entry = entries[index];
        final dest = entry.node.dest;
        final isCurrentPage = dest != null && dest.pageNumber == currentPage;

        return Padding(
          padding: EdgeInsets.only(
            left: PapelTokens.space8 + entry.depth * PapelTokens.space16,
            right: PapelTokens.space8,
          ),
          child: Material(
            color: isCurrentPage
                ? cs.primaryContainer.withValues(alpha: 0.4)
                : Colors.transparent,
            borderRadius: BorderRadius.circular(PapelTokens.radiusMedium),
            child: InkWell(
              borderRadius: BorderRadius.circular(PapelTokens.radiusMedium),
              onTap: dest == null
                  ? null
                  : () {
                      HapticFeedback.lightImpact();
                      controller.goToDest(dest);
                      Navigator.of(context).pop();
                    },
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: PapelTokens.space12,
                  vertical: PapelTokens.space12,
                ),
                child: Row(
                  children: [
                    Icon(
                      entry.node.children.isEmpty
                          ? Icons.article_outlined
                          : Icons.folder_outlined,
                      size: 18,
                      color: isCurrentPage
                          ? cs.primary
                          : cs.onSurfaceVariant.withValues(alpha: 0.6),
                    ),
                    const SizedBox(width: PapelTokens.space12),
                    Expanded(
                      child: Text(
                        entry.node.title.isEmpty ? 'Sem título' : entry.node.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: PapelTokens.body.copyWith(
                          color: isCurrentPage ? cs.primary : cs.onSurface,
                          fontWeight:
                              isCurrentPage ? FontWeight.w600 : FontWeight.normal,
                        ),
                      ),
                    ),
                    if (dest != null)
                      Text(
                        '${dest.pageNumber}',
                        style: PapelTokens.caption.copyWith(
                          color: cs.onSurfaceVariant,
                          fontFeatures: const [FontFeature.tabularFigures()],
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  List<({PdfOutlineNode node, int depth})> _flattenOutline(
    List<PdfOutlineNode> nodes, {
    int depth = 0,
  }) {
    return [
      for (final node in nodes) ...[
        (node: node, depth: depth),
        ..._flattenOutline(node.children, depth: depth + 1),
      ],
    ];
  }
}

/// Tab de miniaturas das páginas.
class _MiniaturasTab extends StatelessWidget {
  final PdfDocument document;
  final PdfViewerController controller;
  final int currentPage;

  const _MiniaturasTab({
    required this.document,
    required this.controller,
    required this.currentPage,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return GridView.builder(
      padding: const EdgeInsets.all(PapelTokens.space12),
      gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: 140,
        mainAxisExtent: 190,
        mainAxisSpacing: PapelTokens.space8,
        crossAxisSpacing: PapelTokens.space8,
      ),
      itemCount: document.pages.length,
      itemBuilder: (context, index) {
        final pageNumber = index + 1;
        final isCurrentPage = pageNumber == currentPage;

        return Material(
          clipBehavior: Clip.antiAlias,
          color: isCurrentPage
              ? cs.primaryContainer.withValues(alpha: 0.4)
              : cs.surfaceContainerLow,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(PapelTokens.radiusMedium),
            side: BorderSide(
              color: isCurrentPage
                  ? cs.primary
                  : cs.outlineVariant.withValues(alpha: 0.3),
              width: isCurrentPage ? 2 : 1,
            ),
          ),
          child: InkWell(
            borderRadius: BorderRadius.circular(PapelTokens.radiusMedium),
            onTap: () {
              HapticFeedback.lightImpact();
              controller.goToPage(pageNumber: pageNumber);
              Navigator.of(context).pop();
            },
            child: Padding(
              padding: const EdgeInsets.all(PapelTokens.space8),
              child: Column(
                children: [
                  Expanded(
                    child: PdfPageView(
                      document: document,
                      pageNumber: pageNumber,
                      maximumDpi: 72,
                    ),
                  ),
                  const SizedBox(height: PapelTokens.space4),
                  Text(
                    '$pageNumber',
                    style: PapelTokens.caption.copyWith(
                      color: isCurrentPage ? cs.primary : cs.onSurfaceVariant,
                      fontWeight:
                          isCurrentPage ? FontWeight.w600 : FontWeight.normal,
                      fontFeatures: const [FontFeature.tabularFigures()],
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
