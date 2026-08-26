import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:file_picker/file_picker.dart';
import '../models/pdf_item.dart';
import '../services/file_service.dart';
import '../services/prefs_service.dart';
import '../services/share_utils.dart';
import '../theme/tokens.dart';
import '../widgets/card_pdf.dart';
import '../widgets/shimmer_skeleton.dart';
import '../widgets/slide_up_route.dart';
import 'leitor_screen.dart';

/// Tela de biblioteca — lista de PDFs recentes.
class BibliotecaScreen extends StatefulWidget {
  final PrefsService prefs;

  const BibliotecaScreen({super.key, required this.prefs});

  @override
  State<BibliotecaScreen> createState() => _BibliotecaScreenState();
}

enum _SortOrder { recent, name, size, reading }

class _BibliotecaScreenState extends State<BibliotecaScreen> {
  late final FileService _fileService;
  List<PdfItem> _items = [];
  List<PdfItem> _filtered = [];
  bool _loading = true;
  String _searchQuery = '';
  _SortOrder _sortOrder = _SortOrder.recent;
  final _searchController = TextEditingController();
  final _searchFocusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    _fileService = FileService(widget.prefs);
    _carregar();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

  Future<void> _carregar() async {
    setState(() => _loading = true);
    final items = await _fileService.getLibrary();
    if (mounted) {
      setState(() {
        _items = items;
        _aplicarFiltro();
        _loading = false;
      });
    }
  }

  void _aplicarFiltro() {
    var lista = _items.toList();
    if (_searchQuery.isNotEmpty) {
      lista = lista
          .where((i) => i.name.toLowerCase().contains(_searchQuery.toLowerCase()))
          .toList();
    }
    switch (_sortOrder) {
      case _SortOrder.recent:
        lista.sort((a, b) => b.lastOpened.compareTo(a.lastOpened));
      case _SortOrder.name:
        lista.sort((a, b) => a.name.compareTo(b.name));
      case _SortOrder.size:
        lista.sort((a, b) =>
            (b.fileSizeBytes ?? 0).compareTo(a.fileSizeBytes ?? 0));
      case _SortOrder.reading:
        lista.sort((a, b) =>
            b.totalReadingSeconds.compareTo(a.totalReadingSeconds));
    }
    _filtered = lista;
  }

  Future<void> _recarregar() async {
    HapticFeedback.mediumImpact();
    await _carregar();
  }

  Future<void> _abrirPdf() async {
    HapticFeedback.mediumImpact();
    final item = await _fileService.pickPdf();
    if (item == null || !mounted) return;
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${item.name} importado'),
          duration: const Duration(seconds: 2),
        ),
      );
    }
    await Navigator.of(context).push(
      SlideUpPageRoute(
        page: LeitorScreen(
          pdfItem: item,
          prefs: widget.prefs,
        ),
      ),
    );
    _carregar();
  }

  Future<void> _abrirExistente(PdfItem item) async {
    HapticFeedback.lightImpact();

    // On web, pdfBytes are not persisted — ask user to re-select the file
    if (kIsWeb && item.pdfBytes == null) {
      final result = await FilePicker.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf'],
      );
      if (result.isEmpty || !mounted) return;
      final file = result.first;
      final bytes = await file.readAsBytes();
      item = item.copyWith(pdfBytes: bytes);
    }

    if (!mounted) return;
    final nav = Navigator.of(context);
    final prefs = widget.prefs;
    await nav.push(
      SlideUpPageRoute(
        page: LeitorScreen(
          pdfItem: item,
          prefs: prefs,
        ),
      ),
    );
    _carregar();
  }

  void _mostrarOpcoes(PdfItem item) {
    HapticFeedback.mediumImpact();
    showModalBottomSheet(
      context: context,
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(PapelTokens.space20, PapelTokens.space8, PapelTokens.space20, PapelTokens.space4),
                child: Text(
                  item.name,
                  style: PapelTokens.headline.copyWith(
                    color: Theme.of(ctx).colorScheme.onSurface,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(height: 4),
              ListTile(
                leading: const Icon(Icons.share_outlined),
                title: const Text('Compartilhar'),
                onTap: () {
                  Navigator.pop(ctx);
                  _compartilhar(item);
                },
              ),
              ListTile(
                leading: Icon(Icons.delete_outline, color: Theme.of(ctx).colorScheme.error),
                title: Text('Remover', style: TextStyle(color: Theme.of(ctx).colorScheme.error)),
                onTap: () {
                  Navigator.pop(ctx);
                  _confirmarRemover(item);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _compartilhar(PdfItem item) async {
    HapticFeedback.lightImpact();
    sharePdf(item.path, item.name);
  }

  Future<void> _confirmarRemover(PdfItem item) async {
    HapticFeedback.mediumImpact();
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Remover da biblioteca?'),
        content: Text('"${item.name}" será removido da lista.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Remover'),
          ),
        ],
      ),
    );
    if (confirm == true) {
      await _fileService.remove(item.id);
      _carregar();
    }
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: RefreshIndicator(
        onRefresh: _recarregar,
        child: CustomScrollView(
          slivers: [
            // ─── Header ───
            SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.fromLTRB(
                  PapelTokens.space24,
                  MediaQuery.of(context).padding.top + PapelTokens.space16,
                  PapelTokens.space24,
                  PapelTokens.space8,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.auto_stories, color: cs.primary, size: 28),
                        const SizedBox(width: PapelTokens.space8),
                        Text(
                          'Papel',
                          style: PapelTokens.largeTitle.copyWith(color: cs.onSurface),
                        ),
                      ],
                    ),
              const SizedBox(height: PapelTokens.space4),
                    Text(
                      _items.isEmpty
                          ? 'Importe um PDF para começar'
                          : '${_items.length} documento${_items.length > 1 ? 's' : ''}',
                      style: PapelTokens.body.copyWith(color: cs.onSurfaceVariant),
                    ),
                  ],
                ),
              ),
            ),

            // ─── Barra de busca ───
            if (_items.isNotEmpty)
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(
                    PapelTokens.space16, PapelTokens.space8,
                    PapelTokens.space16, PapelTokens.space4,
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Container(
                          height: 40,
                          decoration: BoxDecoration(
                            color: cs.surfaceContainerHighest,
                            borderRadius: BorderRadius.circular(PapelTokens.radiusFull),
                          ),
                          child: TextField(
                            controller: _searchController,
                            focusNode: _searchFocusNode,
                            style: PapelTokens.subhead.copyWith(color: cs.onSurface),
                            onChanged: (v) {
                              setState(() {
                                _searchQuery = v;
                                _aplicarFiltro();
                              });
                            },
                            decoration: InputDecoration(
                              hintText: 'Buscar...',
                              hintStyle: PapelTokens.subhead.copyWith(
                                color: cs.onSurfaceVariant,
                              ),
                              prefixIcon: Icon(
                                Icons.search,
                                size: 20,
                                color: cs.onSurfaceVariant,
                              ),
                              prefixIconConstraints: const BoxConstraints(
                                minWidth: 40,
                                minHeight: 40,
                              ),
                              suffixIcon: _searchQuery.isNotEmpty
                                  ? IconButton(
                                      icon: Icon(
                                        Icons.close,
                                        size: 18,
                                        color: cs.onSurfaceVariant,
                                      ),
                                      onPressed: () {
                                        _searchController.clear();
                                        setState(() {
                                          _searchQuery = '';
                                          _aplicarFiltro();
                                        });
                                      },
                                    )
                                  : null,
                              border: InputBorder.none,
                              isDense: true,
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: PapelTokens.space12,
                                vertical: PapelTokens.space8,
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: PapelTokens.space8),
                      PopupMenuButton<_SortOrder>(
                        icon: Icon(
                          Icons.sort,
                          color: cs.onSurfaceVariant,
                          size: 22,
                        ),
                        tooltip: 'Ordenar',
                        onSelected: (order) {
                          HapticFeedback.lightImpact();
                          setState(() {
                            _sortOrder = order;
                            _aplicarFiltro();
                          });
                        },
                        itemBuilder: (_) => [
                          _sortItem(_SortOrder.recent, 'Recente', Icons.access_time),
                          _sortItem(_SortOrder.name, 'Nome', Icons.sort_by_alpha),
                          _sortItem(_SortOrder.size, 'Tamanho', Icons.storage),
                          _sortItem(_SortOrder.reading, 'Leitura', Icons.auto_stories),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

            // ─── Empty state (search no results) ───
            if (_items.isNotEmpty && _filtered.isEmpty && !_loading)
              SliverFillRemaining(
                child: Center(
                  child: Padding(
                    padding: const EdgeInsets.all(PapelTokens.space32),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.search_off,
                          size: 48,
                          color: cs.onSurfaceVariant.withValues(alpha: 0.5),
                        ),
                        const SizedBox(height: PapelTokens.space12),
                        Text(
                          'Nenhum resultado',
                          style: PapelTokens.headline.copyWith(color: cs.onSurfaceVariant),
                        ),
                        const SizedBox(height: PapelTokens.space4),
                        Text(
                          'Tente buscar com outro termo',
                          style: PapelTokens.caption.copyWith(color: cs.onSurfaceVariant),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

            // ─── Empty state (no PDFs) ───
            if (_items.isEmpty && !_loading)
              SliverFillRemaining(
                child: Center(
                  child: Padding(
                    padding: const EdgeInsets.all(PapelTokens.space32),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 88,
                          height: 88,
                          decoration: BoxDecoration(
                            color: cs.primaryContainer,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.picture_as_pdf_outlined,
                            size: 40,
                            color: cs.primary,
                          ),
                        ),
                        const SizedBox(height: PapelTokens.space24),
                        Text(
                          'Nenhum PDF ainda',
                          style: PapelTokens.title2.copyWith(color: cs.onSurface),
                        ),
                        const SizedBox(height: PapelTokens.space8),
                        Text(
                          'Toque no botão abaixo para importar\num arquivo PDF do seu dispositivo.',
                          textAlign: TextAlign.center,
                          style: PapelTokens.body.copyWith(
                            color: cs.onSurfaceVariant,
                            height: 1.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

            // ─── Loading skeleton ───
            if (_loading)
              const BibliotecaSkeletonGrid(),

            // ─── Grid de PDFs (responsivo) ───
            if (_filtered.isNotEmpty && !_loading)
              SliverPadding(
                padding: const EdgeInsets.all(PapelTokens.space16),
                sliver: SliverLayoutBuilder(
                  builder: (context, constraints) {
                    final width = constraints.crossAxisExtent;
                    final crossAxisCount = width > 800 ? 5 : width > 600 ? 4 : 3;
                    return SliverGrid(
                      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: crossAxisCount,
                        mainAxisSpacing: PapelTokens.space12,
                        crossAxisSpacing: PapelTokens.space12,
                        childAspectRatio: 0.68,
                      ),
                      delegate: SliverChildBuilderDelegate(
                        (context, i) => CardPdf(
                          item: _filtered[i],
                          onTap: () => _abrirExistente(_filtered[i]),
                          onLongPress: () => _mostrarOpcoes(_filtered[i]),
                        ),
                        childCount: _filtered.length,
                      ),
                    );
                  },
                ),
              ),

            // ─── Espaço inferior ───
            SliverToBoxAdapter(
              child: SizedBox(height: MediaQuery.of(context).padding.bottom + 100),
            ),
          ],
        ),
      ),
      // ─── FAB importar ───
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _abrirPdf,
        icon: const Icon(Icons.add, size: 22),
        label: const Text(
          'Importar PDF',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
      ),
    );
  }

  PopupMenuItem<_SortOrder> _sortItem(_SortOrder value, String label, IconData icon) {
    return PopupMenuItem(
      value: value,
      child: Row(
        children: [
          Icon(
            icon,
            size: 20,
            color: _sortOrder == value
                ? Theme.of(context).colorScheme.primary
                : Theme.of(context).colorScheme.onSurfaceVariant,
          ),
          const SizedBox(width: PapelTokens.space12),
          Text(
            label,
            style: PapelTokens.body.copyWith(
              color: _sortOrder == value
                  ? Theme.of(context).colorScheme.primary
                  : Theme.of(context).colorScheme.onSurface,
              fontWeight: _sortOrder == value ? FontWeight.w600 : FontWeight.w400,
            ),
          ),
          if (_sortOrder == value) ...[
            const Spacer(),
            Icon(
              Icons.check,
              size: 18,
              color: Theme.of(context).colorScheme.primary,
            ),
          ],
        ],
      ),
    );
  }
}
