import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:pdfrx/pdfrx.dart';
import 'package:wakelock_plus/wakelock_plus.dart';
import '../models/pdf_item.dart';
import '../models/highlight.dart';
import '../services/prefs_service.dart';
import '../services/file_service.dart';
import '../services/color_filter_service.dart';
import '../services/share_utils.dart';
import '../theme/tokens.dart';
import '../widgets/medidor_fps.dart';
import '../widgets/barra_ferramentas_leitor.dart';
import '../widgets/sheet_ajustes.dart';
import '../widgets/barra_busca_leitor.dart';
import '../widgets/timer_sono.dart';
import '../widgets/sheet_navegacao.dart';
import '../widgets/textura_grao.dart';

/// Tela principal de leitura de PDF com filtros de tela.
class LeitorScreen extends StatefulWidget {
  final PdfItem pdfItem;
  final PrefsService prefs;

  /// Modo de tela inicial (opcional). Se null, usa o [PrefsService.readerMode]
  /// salvo. Não afeta o tema global do app.
  final ModoTela? modoInicial;

  const LeitorScreen({
    super.key,
    required this.pdfItem,
    required this.prefs,
    this.modoInicial,
  });

  @override
  State<LeitorScreen> createState() => _LeitorScreenState();
}

class _LeitorScreenState extends State<LeitorScreen>
    with SingleTickerProviderStateMixin {
  late PdfDocumentRef _docRef;
  final PdfViewerController _controller = PdfViewerController();
  late PdfTextSearcher _searcher;
  late ModoTela _modo;
  late double _temperatura;
  late double _brilho;
  late double _contraste;
  late double _grao;

  bool _uiVisivel = true;
  int _paginaAtual = 1;
  int _totalPaginas = 0;
  bool _buscaAberta = false;

  // PDF outline (TOC)
  List<PdfOutlineNode>? _outline;
  PdfDocument? _document;

  // Highlights
  final List<PdfHighlight> _highlights = [];
  PdfTextSelection? _currentSelection;
  Color _highlightColor = highlightColors.first;

  // Double-tap toggle
  ModoTela? _ultimoModo;

  // Sleep timer
  Timer? _sleepTimer;
  int _sleepSegundos = 0;

  // Auto-hide timer
  Timer? _hideTimer;
  static const _hideDelay = PapelTokens.durationSlow;

  // Reading stats
  DateTime? _sessionStart;
  final Set<int> _visitedPages = {};
  bool _isBookmarked = false;

  late final FileService _fileService;

  @override
  void initState() {
    super.initState();
    _fileService = FileService(widget.prefs);
    _sessionStart = DateTime.now();
    _visitedPages.add(widget.pdfItem.lastPage ?? 1);
    _isBookmarked =
        widget.pdfItem.bookmarkedPages.contains(widget.pdfItem.lastPage ?? 1);

    // Restaurar preferências — modo de leitura é independente do tema do app
    _modo = widget.modoInicial ?? _modoFromName(widget.prefs.readerMode);
    _temperatura = widget.prefs.temperature;
    _brilho = widget.prefs.brightness;
    _contraste = widget.prefs.contrast;
    _grao = widget.prefs.grainIntensity;

    // Pagina inicial (restaurar posição)
    _paginaAtual = widget.pdfItem.lastPage ?? 1;

    // Carregar PDF — web usa bytes, nativo usa file path
    if (kIsWeb && widget.pdfItem.pdfBytes != null) {
      _docRef = PdfDocumentRefData(
        widget.pdfItem.pdfBytes!,
        sourceName: widget.pdfItem.name,
      );
    } else {
      _docRef = PdfDocumentRefFile(widget.pdfItem.path);
    }

    // Inicializar searcher (será vinculado ao controller depois)
    _searcher = PdfTextSearcher(_controller);

    // Iniciar auto-hide
    _programarHide();

    // Manter tela acesa
    WakelockPlus.enable();
  }

  @override
  void dispose() {
    _hideTimer?.cancel();
    _sleepTimer?.cancel();
    _searcher.dispose();
    // Save session stats (persistência atômica via fila do PrefsService)
    final sessionSeconds = _sessionStart != null
        ? DateTime.now().difference(_sessionStart!).inSeconds
        : 0;
    if (sessionSeconds > 0) {
      _fileService.updateReadingState(
        widget.pdfItem.id,
        lastPage: _paginaAtual,
        readingSeconds: sessionSeconds,
        visitedPages: _visitedPages,
      );
    }
    WakelockPlus.disable();
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
    super.dispose();
  }

  ModoTela _modoFromName(String name) => switch (name) {
        'sepia' => ModoTela.sepia,
        'noite' => ModoTela.noite,
        'ereader' => ModoTela.ereader,
        'papel' => ModoTela.papel,
        _ => ModoTela.original,
      };

  String _modoToName(ModoTela m) => switch (m) {
        ModoTela.original => 'original',
        ModoTela.sepia => 'sepia',
        ModoTela.noite => 'noite',
        ModoTela.ereader => 'ereader',
        ModoTela.papel => 'papel',
      };

  // ─── Auto-hide ───
  void _programarHide() {
    _hideTimer?.cancel();
    _hideTimer = Timer(_hideDelay, () {
      if (mounted && _uiVisivel && !_buscaAberta) {
        _toggleUi(show: false);
      }
    });
  }

  void _onInteracao() {
    if (!_uiVisivel) {
      _toggleUi(show: true);
    }
    _programarHide();
  }

  ColorFilter? _buildFilter() {
    if (_modo == ModoTela.ereader) {
      return const ColorFilter.matrix([
        0.2126, 0.7152, 0.0722, 0, -0.03, //
        0.2126, 0.7152, 0.0722, 0, -0.03,
        0.2126, 0.7152, 0.0722, 0, -0.03,
        0, 0, 0, 1, 0,
      ]);
    }

    if (_modo == ModoTela.sepia) {
      final base = ColorFilterService.withContrast(
        [
          0.393, 0.769, 0.189, 0, 0, //
          0.349, 0.686, 0.168, 0, 0,
          0.272, 0.534, 0.131, 0, 0,
          0, 0, 0, 1, 0,
        ],
        _contraste,
      );
      return ColorFilter.matrix(base);
    }

    if (_modo == ModoTela.noite) {
      final base = ColorFilterService.withContrast(
        [
          1.00, 0, 0, 0, 0.02, //
          0, 0.88, 0, 0, 0.01,
          0, 0, 0.52, 0, 0,
          0, 0, 0, 1, 0,
        ],
        _contraste,
      );
      return ColorFilter.matrix(base);
    }

    if (_modo == ModoTela.papel) {
      final temp = ColorFilterService.temperatureToMatrix(_temperatura);
      final adjusted = ColorFilterService.withContrast(temp, _contraste);
      return ColorFilter.matrix(adjusted);
    }

    if (_temperatura < 6500) {
      final temp = ColorFilterService.temperatureToMatrix(_temperatura);
      final adjusted = ColorFilterService.withContrast(temp, _contraste);
      return ColorFilter.matrix(adjusted);
    }

    if (_contraste != 1.0) {
      return ColorFilter.matrix([
        _contraste, 0, 0, 0, (1 - _contraste) / 2, //
        0, _contraste, 0, 0, (1 - _contraste) / 2,
        0, 0, _contraste, 0, (1 - _contraste) / 2,
        0, 0, 0, 1, 0,
      ]);
    }

    return null;
  }

  void _toggleUi({bool? show}) {
    final novo = show ?? !_uiVisivel;
    setState(() => _uiVisivel = novo);
    if (novo) {
      SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
      _programarHide();
    } else {
      SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
      _hideTimer?.cancel();
    }
  }

  void _abrirAjustes() {
    HapticFeedback.mediumImpact();
    _hideTimer?.cancel();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => SheetAjustes(
        modoAtual: _modo,
        temperatura: _temperatura,
        brilho: _brilho,
        contraste: _contraste,
        grao: _grao,
        onModoChanged: (m) {
          setState(() => _modo = m);
          _salvarPreferencias();
        },
        onTemperaturaChanged: (v) {
          setState(() => _temperatura = v);
          _salvarPreferencias();
        },
        onBrilhoChanged: (v) {
          setState(() => _brilho = v);
          _salvarPreferencias();
        },
        onContrasteChanged: (v) {
          setState(() => _contraste = v);
          _salvarPreferencias();
        },
        onGraoChanged: (v) {
          setState(() => _grao = v);
          _salvarPreferencias();
        },
      ),
    ).then((_) => _programarHide());
  }

  void _abrirBusca() {
    HapticFeedback.mediumImpact();
    setState(() => _buscaAberta = true);
    _hideTimer?.cancel();
  }

  void _abrirNavegacao() {
    HapticFeedback.mediumImpact();
    _hideTimer?.cancel();
    if (_document == null) return;
    SheetNavegacao.mostrar(
      context,
      document: _document!,
      controller: _controller,
      outline: _outline,
      currentPage: _paginaAtual,
    ).then((_) => _programarHide());
  }

  void _onTextSelectionChanged(PdfTextSelection selection) {
    setState(() => _currentSelection = selection);
  }

  Future<void> _addHighlight() async {
    if (_currentSelection == null) return;
    HapticFeedback.mediumImpact();

    final ranges = await _currentSelection!.getSelectedTextRanges();
    for (final range in ranges) {
      _highlights.add(PdfHighlight(_highlightColor, range));
    }

    setState(() {});
    _controller.textSelectionDelegate.clearTextSelection();
    _programarHide();
  }

  void _showHighlightColorPicker() {
    HapticFeedback.mediumImpact();
    _hideTimer?.cancel();
    showModalBottomSheet(
      context: context,
      builder: (ctx) {
        final cs = Theme.of(context).colorScheme;
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(PapelTokens.space16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Cor do destaque',
                  style: PapelTokens.subhead.copyWith(color: cs.onSurface),
                ),
                const SizedBox(height: PapelTokens.space12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: highlightColors.map((color) {
                    final isSelected = color == _highlightColor;
                    return GestureDetector(
                      onTap: () {
                        HapticFeedback.selectionClick();
                        setState(() => _highlightColor = color);
                        Navigator.of(ctx).pop();
                      },
                      child: Container(
                        width: 40,
                        height: 40,
                        margin: const EdgeInsets.symmetric(
                          horizontal: PapelTokens.space4,
                        ),
                        decoration: BoxDecoration(
                          color: color,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color:
                                isSelected ? cs.onSurface : Colors.transparent,
                            width: 2,
                          ),
                          boxShadow: isSelected
                              ? [
                                  BoxShadow(
                                    color: color.withValues(alpha: 0.4),
                                    blurRadius: 8,
                                    spreadRadius: 2,
                                  ),
                                ]
                              : null,
                        ),
                        child: isSelected
                            ? Icon(
                                Icons.check,
                                color: cs.onSurface.withValues(alpha: 0.7),
                                size: 20,
                              )
                            : null,
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        );
      },
    ).then((_) => _programarHide());
  }

  void _paintHighlights(Canvas canvas, Rect pageRect, PdfPage page) {
    paintHighlights(canvas, pageRect, page, _highlights);
  }

  void _fecharBusca() {
    setState(() => _buscaAberta = false);
    _programarHide();
  }

  void _compartilhar() async {
    HapticFeedback.lightImpact();
    if (kIsWeb) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Compartilhar não disponível no web')),
      );
      return;
    }
    sharePdf(widget.pdfItem.path, widget.pdfItem.name);
  }

  void _toggleBookmark() {
    HapticFeedback.mediumImpact();
    _fileService.toggleBookmark(widget.pdfItem.id, _paginaAtual);
    setState(() => _isBookmarked = !_isBookmarked);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          _isBookmarked ? 'Página $_paginaAtual marcada' : 'Marca removida',
        ),
        duration: const Duration(seconds: 1),
      ),
    );
  }

  void _irParaPagina() {
    HapticFeedback.mediumImpact();
    _hideTimer?.cancel();
    final ctrl = TextEditingController(text: _paginaAtual.toString());
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Ir para página'),
        content: TextField(
          controller: ctrl,
          keyboardType: TextInputType.number,
          autofocus: true,
          decoration: InputDecoration(
            hintText: '1–$_totalPaginas',
            suffixText: 'de $_totalPaginas',
          ),
          onSubmitted: (v) {
            final page = int.tryParse(v);
            if (page != null && page >= 1 && page <= _totalPaginas) {
              Navigator.pop(ctx);
              _controller.goToPage(pageNumber: page);
            }
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () {
              final page = int.tryParse(ctrl.text);
              if (page != null && page >= 1 && page <= _totalPaginas) {
                Navigator.pop(ctx);
                _controller.goToPage(pageNumber: page);
              }
            },
            child: const Text('Ir'),
          ),
        ],
      ),
    ).then((_) => _programarHide());
  }

  // ─── Sleep timer ───
  void _abrirTimerSono() {
    TimerSono.mostrar(context, (minutos) {
      _sleepTimer?.cancel();
      setState(() => _sleepSegundos = minutos * 60);
      _sleepTimer = Timer.periodic(const Duration(seconds: 1), (t) {
        if (_sleepSegundos <= 1) {
          t.cancel();
          setState(() => _sleepSegundos = 0);
          _voltar();
        } else {
          setState(() => _sleepSegundos--);
        }
      });
    });
  }

  void _cancelarTimerSono() {
    HapticFeedback.lightImpact();
    _sleepTimer?.cancel();
    setState(() => _sleepSegundos = 0);
  }

  String _formatarTempo(int s) {
    final h = s ~/ 3600;
    final m = (s % 3600) ~/ 60;
    final seg = s % 60;
    if (h > 0) return '${h}h ${m.toString().padLeft(2, '0')}min';
    return '${m.toString().padLeft(2, '0')}:${seg.toString().padLeft(2, '0')}';
  }

  Widget? _buildTimerBadge() {
    if (_sleepSegundos <= 0) return null;
    return GestureDetector(
      onTap: _cancelarTimerSono,
      child: Container(
        padding: const EdgeInsets.symmetric(
            horizontal: PapelTokens.space8, vertical: PapelTokens.space4),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.primaryContainer,
          borderRadius: BorderRadius.circular(PapelTokens.radiusFull),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.bedtime_outlined,
              size: 14,
              color: Theme.of(context).colorScheme.primary,
            ),
            const SizedBox(width: PapelTokens.space4),
            Text(
              _formatarTempo(_sleepSegundos),
              style: PapelTokens.caption.copyWith(
                color: Theme.of(context).colorScheme.primary,
                fontWeight: FontWeight.w600,
                fontFeatures: [const FontFeature.tabularFigures()],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _salvarPreferencias() {
    widget.prefs.setReaderMode(_modoToName(_modo));
    widget.prefs.setTemperature(_temperatura);
    widget.prefs.setBrightness(_brilho);
    widget.prefs.setContrast(_contraste);
    widget.prefs.setGrainIntensity(_grao);
  }

  void _voltar() {
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
    Navigator.of(context).pop();
  }

  bool get _showGrain =>
      _grao > 0 && (_modo == ModoTela.papel || _modo == ModoTela.sepia);

  void _onDoubleTap() {
    HapticFeedback.mediumImpact();
    if (_ultimoModo != null && _ultimoModo != _modo) {
      final tmp = _modo;
      setState(() => _modo = _ultimoModo!);
      _ultimoModo = tmp;
      _salvarPreferencias();
    } else {
      // Cycle: original -> ereader -> original
      final next =
          _modo == ModoTela.ereader ? ModoTela.original : ModoTela.ereader;
      _ultimoModo = _modo;
      setState(() => _modo = next);
      _salvarPreferencias();
    }
  }

  @override
  Widget build(BuildContext context) {
    final filter = _buildFilter();

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // ─── PDF com filtro ───
          Positioned.fill(
            child: ColorFiltered(
              colorFilter: filter ??
                  const ColorFilter.mode(Colors.transparent, BlendMode.dst),
              child: Opacity(
                opacity: _brilho,
                child: GestureDetector(
                  onTap: _onInteracao,
                  onDoubleTap: _onDoubleTap,
                  child: PdfViewer(
                    _docRef,
                    controller: _controller,
                    params: PdfViewerParams(
                      textSelectionParams: PdfTextSelectionParams(
                        onTextSelectionChange: _onTextSelectionChanged,
                      ),
                      pagePaintCallbacks: [
                        _paintHighlights,
                      ],
                      onPageChanged: (page) {
                        if (page == null) return;
                        HapticFeedback.lightImpact();
                        setState(() {
                          _paginaAtual = page;
                          _visitedPages.add(page);
                          _isBookmarked =
                              widget.pdfItem.bookmarkedPages.contains(page);
                        });
                        _fileService.updateReadingState(
                          widget.pdfItem.id,
                          lastPage: page,
                          visitedPages: _visitedPages,
                        );
                        _programarHide();
                      },
                      onViewerReady: (doc, ctrl) async {
                        final total = doc.pages.length;
                        setState(() {
                          _totalPaginas = total;
                          _document = doc;
                        });
                        _fileService.updateReadingState(
                          widget.pdfItem.id,
                          totalPages: total,
                        );
                        // Load TOC outline
                        final loadedOutline = await doc.loadOutline();
                        if (mounted) {
                          setState(() => _outline = loadedOutline);
                        }
                        final savedPage = widget.pdfItem.lastPage;
                        if (savedPage != null &&
                            savedPage > 1 &&
                            savedPage <= total) {
                          ctrl.goToPage(pageNumber: savedPage);
                        }
                      },
                      loadingBannerBuilder:
                          (context, bytesDownloaded, totalBytes) {
                        final cs = Theme.of(context).colorScheme;
                        return Center(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              CircularProgressIndicator(color: cs.onSurface),
                              const SizedBox(height: 16),
                              Text(
                                'Carregando PDF...',
                                style: TextStyle(color: cs.onSurface),
                              ),
                            ],
                          ),
                        );
                      },
                      errorBannerBuilder: (context, error, stackTrace, docRef) {
                        final cs = Theme.of(context).colorScheme;
                        return Center(
                          child: Padding(
                            padding: const EdgeInsets.all(PapelTokens.space32),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.error_outline,
                                  size: 48,
                                  color: cs.error,
                                ),
                                const SizedBox(height: PapelTokens.space16),
                                Text(
                                  'Erro ao abrir PDF',
                                  style: TextStyle(
                                    color: cs.onSurface,
                                    fontSize: 20,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                const SizedBox(height: PapelTokens.space8),
                                Text(
                                  error.toString(),
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    color: cs.onSurfaceVariant,
                                    fontSize: 12,
                                  ),
                                ),
                                const SizedBox(height: PapelTokens.space24),
                                TextButton(
                                  onPressed: _voltar,
                                  child: const Text('Voltar'),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ),
              ),
            ),
          ),

          // ─── Textura de grão animada (repaint isolado no widget) ───
          if (_showGrain)
            Positioned.fill(
              child: IgnorePointer(
                child: TexturaGrao(opacity: _grao),
              ),
            ),

          // ─── FPS (debug e profile — profile tem performance de release) ───
          if (_uiVisivel && (kDebugMode || kProfileMode))
            Positioned(
              top: MediaQuery.of(context).padding.top + PapelTokens.space64,
              left: PapelTokens.space12,
              child: const MedidorFps(),
            ),

          // ─── Barra de busca ───
          if (_buscaAberta)
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              child: BarraBuscaLeitor(
                searcher: _searcher,
                onClose: _fecharBusca,
              ),
            ),

          // ─── Barra de ferramentas ───
          Positioned.fill(
            child: BarraFerramentasLeitor(
              currentPage: _paginaAtual,
              totalPages: _totalPaginas,
              modoAtual: _modo,
              visible: _uiVisivel,
              documentName: widget.pdfItem.name,
              onBack: _voltar,
              onSettings: _abrirAjustes,
              onSearch: _abrirBusca,
              onToc: _abrirNavegacao,
              onGoToPage: _irParaPagina,
              onSleepTimer: _sleepSegundos <= 0 ? _abrirTimerSono : null,
              onBookmark: _toggleBookmark,
              isBookmarked: _isBookmarked,
              onShare: _compartilhar,
              onHighlight: _addHighlight,
              onHighlightColor: _showHighlightColorPicker,
              hasSelection: _currentSelection != null,
              timerWidget: _buildTimerBadge(),
              onPageChanged: (page) {
                _controller.goToPage(pageNumber: page);
              },
            ),
          ),
        ],
      ),
    );
  }
}
