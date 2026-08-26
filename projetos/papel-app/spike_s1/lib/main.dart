import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:file_picker/file_picker.dart';

import 'models/pdf_item.dart';
import 'theme/themes.dart';
import 'theme/tokens.dart';
import 'services/prefs_service.dart';
import 'services/file_service.dart';
import 'screens/biblioteca_screen.dart';
import 'screens/leitor_screen.dart';
import 'roda_leitura.dart';
import 'widgets/slide_up_route.dart';
import 'widgets/sheet_ajustes.dart' show ModoTela;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Orientação portrait
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Barra de status transparente
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.light,
    systemNavigationBarColor: Colors.transparent,
    systemNavigationBarIconBrightness: Brightness.light,
  ));

  // Inicializar preferências
  final prefs = PrefsService();
  await prefs.init();

  runApp(PapelApp(prefs: prefs));
}

class PapelApp extends StatefulWidget {
  final PrefsService prefs;

  const PapelApp({super.key, required this.prefs});

  @override
  State<PapelApp> createState() => _PapelAppState();
}

class _PapelAppState extends State<PapelApp> {
  late String _themeMode;

  @override
  void initState() {
    super.initState();
    _themeMode = widget.prefs.themeMode;
  }

  void _onThemeChanged(String mode) {
    setState(() => _themeMode = mode);
  }

  @override
  Widget build(BuildContext context) {
    final brightness = themeForMode(_themeMode).brightness;
    final isDark = brightness == Brightness.dark;

    // AnnotatedRegion atualiza a SystemUI de forma declarativa (sem efeito
    // colateral no build).
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: isDark ? Brightness.light : Brightness.dark,
        systemNavigationBarColor: Colors.transparent,
        systemNavigationBarIconBrightness:
            isDark ? Brightness.light : Brightness.dark,
      ),
      child: MaterialApp(
        title: 'Papel',
        debugShowCheckedModeBanner: false,
        theme: themeForMode(_themeMode),
        home: PaginaInicial(
          prefs: widget.prefs,
          onThemeChanged: _onThemeChanged,
        ),
      ),
    );
  }
}

/// Página inicial — 3 modos de leitura.
class PaginaInicial extends StatefulWidget {
  final PrefsService prefs;
  final ValueChanged<String> onThemeChanged;

  const PaginaInicial({
    super.key,
    required this.prefs,
    required this.onThemeChanged,
  });

  @override
  State<PaginaInicial> createState() => _PaginaInicialState();
}

class _PaginaInicialState extends State<PaginaInicial>
    with SingleTickerProviderStateMixin {
  late final FileService _fileService;
  late final AnimationController _animCtrl;
  late final Animation<double> _fadeAnim;
  late final List<Animation<double>> _cardAnims;
  PdfItem? _lastRead;

  @override
  void initState() {
    super.initState();
    _fileService = FileService(widget.prefs);
    _animCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _fadeAnim = CurvedAnimation(
      parent: _animCtrl,
      curve: const Interval(0, 0.5, curve: Curves.easeOut),
    );
    _cardAnims = List.generate(3, (i) {
      final start = 0.15 + i * 0.15;
      return CurvedAnimation(
        parent: _animCtrl,
        curve: Interval(start, (start + 0.5).clamp(0.0, 1.0), curve: Curves.easeOutCubic),
      );
    });
    _animCtrl.forward();
    _carregarUltimoLido();
  }

  Future<void> _carregarUltimoLido() async {
    final items = await _fileService.getLibrary();
    if (mounted && items.isNotEmpty) {
      setState(() => _lastRead = items.first);
    }
  }

  @override
  void dispose() {
    _animCtrl.dispose();
    super.dispose();
  }

  Future<void> _abrirEreader() async {
    HapticFeedback.mediumImpact();
    final item = await _fileService.pickPdf();
    if (item == null || !mounted) return;
    await Navigator.of(context).push(
      SlideUpPageRoute(
        page: LeitorScreen(
          pdfItem: item,
          prefs: widget.prefs,
          // E-reader abre direto no modo de leitura, sem tocar no tema global.
          modoInicial: ModoTela.ereader,
        ),
      ),
    );
    _carregarUltimoLido();
  }

  Future<void> _abrirRodaLeitura() async {
    HapticFeedback.mediumImpact();
    final item = await _fileService.pickPdf();
    if (item == null || !mounted) return;
    await Navigator.of(context).push(
      SlideUpPageRoute(
        page: RodaLeituraPage(pdfPath: item.path),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    final modos = <(
      String,
      String,
      IconData,
      VoidCallback,
    )>[
      (
        'Biblioteca',
        'Importe e leia PDFs do seu dispositivo',
        Icons.library_books_outlined,
        () => Navigator.of(context).push(
          SlideUpPageRoute(
            page: BibliotecaScreen(prefs: widget.prefs),
          ),
        ),
      ),
      (
        'E-reader',
        'Tela tipo Kindle: alto contraste, tons de papel',
        Icons.menu_book_outlined,
        _abrirEreader,
      ),
      (
        'Roda de Leitura',
        'Gire as palavras como uma roda de leitura',
        Icons.auto_stories_outlined,
        _abrirRodaLeitura,
      ),
    ];

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.fromLTRB(
                PapelTokens.space24,
                MediaQuery.of(context).padding.top + PapelTokens.space24,
                PapelTokens.space24,
                PapelTokens.space8,
              ),
              child: FadeTransition(
                opacity: _fadeAnim,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: cs.primary,
                            borderRadius: BorderRadius.circular(PapelTokens.radiusSmall),
                          ),
                          child: const Icon(
                            Icons.auto_stories,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          'Papel',
                          style: PapelTokens.largeTitle.copyWith(color: cs.onSurface),
                        ),
                        const Spacer(),
                        _ThemeToggleButton(
                          isDark: Theme.of(context).brightness == Brightness.dark,
                          onToggle: () {
                            final current = widget.prefs.themeMode;
                            final next = current == 'dark' ? 'light' : 'dark';
                            widget.prefs.setThemeMode(next);
                            widget.onThemeChanged(next);
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: PapelTokens.space8),
                    Text(
                      'Leia com conforto.',
                      style: PapelTokens.body.copyWith(
                        color: cs.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          // ─── Último PDF lido ───
          if (_lastRead != null)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(PapelTokens.space16, 0, PapelTokens.space16, PapelTokens.space8),
                child: FadeTransition(
                  opacity: _fadeAnim,
                  child: GestureDetector(
                    onTap: () async {
                      HapticFeedback.lightImpact();

                      // Captura o navigator antes de qualquer await para não
                      // usar context através de gaps assíncronos.
                      final nav = Navigator.of(context);
                      final prefs = widget.prefs;

                      // On web, pdfBytes are not persisted — ask user to re-select
                      PdfItem item = _lastRead!;
                      if (kIsWeb && item.pdfBytes == null) {
                        final result = await FilePicker.pickFiles(
                          type: FileType.custom,
                          allowedExtensions: ['pdf'],
                        );
                        if (result.isEmpty || !mounted) return;
                        final file = result.first;
                        final bytes = await file.readAsBytes();
                        if (!mounted) return;
                        item = item.copyWith(pdfBytes: bytes);
                      }

                      if (!mounted) return;
                      nav.push(
                        SlideUpPageRoute(
                          page: LeitorScreen(
                            pdfItem: item,
                            prefs: prefs,
                          ),
                        ),
                      ).then((_) => _carregarUltimoLido());
                    },
                    child: Container(
                      padding: const EdgeInsets.all(PapelTokens.space16),
                      decoration: BoxDecoration(
                        color: cs.primaryContainer,
                        borderRadius: BorderRadius.circular(PapelTokens.radiusMedium),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.play_circle_outline,
                            color: cs.primary,
                            size: 28,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Continuar lendo',
                                  style: PapelTokens.caption.copyWith(
                                    color: cs.primary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  _lastRead!.name,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: PapelTokens.headline.copyWith(
                                    color: cs.onSurface,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          if (_lastRead!.lastPage != null && _lastRead!.totalPages > 0)
                            Text(
                              '${_lastRead!.lastPage}/${_lastRead!.totalPages}',
                              style: PapelTokens.caption.copyWith(
                                color: cs.onSurfaceVariant,
                                fontFeatures: [const FontFeature.tabularFigures()],
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          SliverPadding(
            padding: const EdgeInsets.all(PapelTokens.space16),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, i) {
                  final (nome, descricao, icone, abrir) = modos[i];
                  final anim = _cardAnims[i];
                  return FadeTransition(
                    opacity: anim,
                    child: SlideTransition(
                      position: Tween<Offset>(
                        begin: const Offset(0, 0.08),
                        end: Offset.zero,
                      ).animate(anim),
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: PapelTokens.space12),
                        child: Card(
                          child: ListTile(
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: PapelTokens.space20,
                              vertical: PapelTokens.space16,
                            ),
                            leading: Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: cs.primaryContainer,
                                borderRadius: BorderRadius.circular(PapelTokens.radiusSmall),
                              ),
                              child: Icon(icone, size: 22, color: cs.primary),
                            ),
                            title: Text(
                              nome,
                              style: PapelTokens.headline.copyWith(color: cs.onSurface),
                            ),
                            subtitle: Text(
                              descricao,
                              style: PapelTokens.subhead.copyWith(
                                color: cs.onSurfaceVariant,
                              ),
                            ),
                            trailing: Icon(
                              Icons.chevron_right,
                              color: cs.onSurfaceVariant,
                              size: 22,
                            ),
                            onTap: abrir,
                          ),
                        ),
                      ),
                    ),
                  );
                },
                childCount: modos.length,
              ),
            ),
          ),
          // ─── Versão ───
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(PapelTokens.space16),
              child: FadeTransition(
                opacity: _fadeAnim,
                child: Text(
                  'Papel v1.0.0',
                  textAlign: TextAlign.center,
                  style: PapelTokens.caption.copyWith(
                    color: cs.onSurfaceVariant.withValues(alpha: 0.5),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ThemeToggleButton extends StatelessWidget {
  final bool isDark;
  final VoidCallback onToggle;

  const _ThemeToggleButton({required this.isDark, required this.onToggle});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Tooltip(
      message: isDark ? 'Modo claro' : 'Modo escuro',
      child: GestureDetector(
        onTap: onToggle,
        child: AnimatedContainer(
          duration: PapelTokens.durationNormal,
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: cs.surfaceContainerHighest,
            borderRadius: BorderRadius.circular(PapelTokens.radiusSmall),
          ),
          child: Icon(
            isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
            size: 18,
            color: cs.onSurfaceVariant,
          ),
        ),
      ),
    );
  }
}
