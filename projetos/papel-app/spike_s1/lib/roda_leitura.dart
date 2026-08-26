import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:pdfrx/pdfrx.dart';

class RodaLeituraPage extends StatefulWidget {
  final String? pdfAsset;
  final String? pdfPath;

  const RodaLeituraPage({super.key, this.pdfAsset, this.pdfPath});

  @override
  State<RodaLeituraPage> createState() => _RodaLeituraPageState();
}

enum Nivel { palavra, frase, trecho }

extension RotuloNivel on Nivel {
  String get rotulo => switch (this) {
        Nivel.palavra => 'Palavra',
        Nivel.frase => 'Frase',
        Nivel.trecho => 'Trecho',
      };
}

class _RodaLeituraPageState extends State<RodaLeituraPage> {
  static const _itemExtent = 52.0;
  static const _limitePaginas = 12;

  late final Future<String> _textoFuturo;
  final _controller = FixedExtentScrollController();
  final _pontos = <int, Offset>{};
  double _spanInicial = 0;
  Nivel _nivel = Nivel.palavra;
  int _ultimoIndiceCentral = -1;

  @override
  void initState() {
    super.initState();
    _textoFuturo = _extrairTextoPdf();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<String> _extrairTextoPdf() async {
    try {
      final doc = widget.pdfPath != null
          ? await PdfDocument.openFile(widget.pdfPath!)
          : await PdfDocument.openAsset(widget.pdfAsset ?? 'assets/teste.pdf');
      final buffer = StringBuffer();
      final paginas =
          doc.pages.length < _limitePaginas ? doc.pages.length : _limitePaginas;
      for (var p = 0; p < paginas; p++) {
        final page = doc.pages[p];
        final texto = await page.loadStructuredText();
        buffer.write(texto.fullText);
        buffer.write(' ');
      }
      final resultado = buffer.toString().trim();
      if (resultado.length > 200) return resultado;
      return _fallback;
    } catch (_) {
      return _fallback;
    }
  }

  static const _fallback =
      'Ler em tela brilha e cansa os olhos depois de poucos minutos. '
      'O papel reflete a luz do ambiente e por isso não cansa. '
      'Este app traz essa sensação para a tela do seu celular. '
      'Arraste para girar as palavras como uma roda. '
      'Abra dois dedos para ver frases inteiras passarem. '
      'Feche os dedos para voltar ao detalhe da palavra única. '
      'A leitura fica leve quando o texto se move com você. ';

  List<String> _fatiar(String texto, Nivel nivel) {
    final limpo = texto.replaceAll(RegExp(r'\s+'), ' ');
    return switch (nivel) {
      Nivel.palavra => limpo.split(' ').where((s) => s.isNotEmpty).toList(),
      Nivel.frase => limpo
          .split(RegExp(r'(?<=[.!?…])\s'))
          .where((s) => s.trim().isNotEmpty)
          .toList(),
      Nivel.trecho => _agruparFrases(limpo, 3),
    };
  }

  List<String> _agruparFrases(String texto, int qtd) {
    final frases = texto.split(RegExp(r'(?<=[.!?…])\s'));
    final trechos = <String>[];
    final atual = StringBuffer();
    for (var i = 0; i < frases.length; i++) {
      atual.write(frases[i]);
      atual.write(' ');
      if ((i + 1) % qtd == 0) {
        trechos.add(atual.toString().trim());
        atual.clear();
      }
    }
    final resto = atual.toString().trim();
    if (resto.isNotEmpty) trechos.add(resto);
    return trechos;
  }

  void _mudarNivel(Nivel novo, String textoAtual) {
    if (novo == _nivel) return;
    final totalAntigo = _fatiar(textoAtual, _nivel).length;
    final fracao = totalAntigo == 0 ? 0.0 : _controller.offset / totalAntigo;
    setState(() => _nivel = novo);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final totalNovo = _fatiar(textoAtual, novo).length;
      if (totalNovo > 0) {
        _controller.jumpTo((fracao * totalNovo).clamp(0.0, totalNovo - 1.0));
      }
    });
    HapticFeedback.mediumImpact();
  }

  void _aoPonta(PointerEvent e) {
    if (e is PointerDownEvent) {
      _pontos[e.pointer] = e.localPosition;
      if (_pontos.length == 2) {
        final spans = _pontos.values.toList();
        _spanInicial = (spans[0] - spans[1]).distance;
      }
    } else if (e is PointerMoveEvent && _pontos.containsKey(e.pointer)) {
      _pontos[e.pointer] = e.localPosition;
      if (_pontos.length >= 2 && _spanInicial > 0) {
        final spans = _pontos.values.toList();
        final razao = (spans[0] - spans[1]).distance / _spanInicial;
        final texto = _textoCache;
        if (razao >= 1.30) {
          _spanInicial = (spans[0] - spans[1]).distance;
          if (_nivel.index < Nivel.values.length - 1) {
            _mudarNivel(Nivel.values[_nivel.index + 1], texto);
          }
        } else if (razao <= 0.72) {
          _spanInicial = (spans[0] - spans[1]).distance;
          if (_nivel.index > 0) {
            _mudarNivel(Nivel.values[_nivel.index - 1], texto);
          }
        }
      }
    } else if (e is PointerUpEvent || e is PointerCancelEvent) {
      _pontos.remove(e.pointer);
      if (_pontos.length < 2) _spanInicial = 0;
    }
  }

  String _textoCache = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF141210),
      body: FutureBuilder<String>(
        future: _textoFuturo,
        builder: (context, snap) {
          if (!snap.hasData) {
            return const Center(child: CircularProgressIndicator());
          }
          final texto = snap.data!;
          if (_textoCache.isEmpty) _textoCache = texto;
          final itens = _fatiar(texto, _nivel);
          return Stack(
            children: [
              Positioned.fill(
                child: ShaderMask(
                  shaderCallback: (r) => const LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black,
                      Colors.black,
                      Colors.transparent,
                    ],
                    stops: [0.02, 0.22, 0.78, 0.98],
                  ).createShader(r),
                  blendMode: BlendMode.dstIn,
                  child: Listener(
                    onPointerDown: _aoPonta,
                    onPointerMove: _aoPonta,
                    onPointerUp: _aoPonta,
                    onPointerCancel: _aoPonta,
                    child: ListWheelScrollView.useDelegate(
                      key: ValueKey(_nivel),
                      controller: _controller,
                      itemExtent: _itemExtent,
                      physics: const FixedExtentScrollPhysics(),
                      diameterRatio: 1.7,
                      onSelectedItemChanged: (i) {
                        if (i != _ultimoIndiceCentral) {
                          _ultimoIndiceCentral = i;
                          HapticFeedback.selectionClick();
                        }
                      },
                      childDelegate: ListWheelChildBuilderDelegate(
                        childCount: itens.length,
                        builder: (context, i) =>
                            _linha(itens[i], i, _controller),
                      ),
                    ),
                  ),
                ),
              ),
              _faixaCentral(),
              Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(24, 0, 24, 16),
                    child: _barraZoom(itens.length),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _faixaCentral() {
    return IgnorePointer(
      child: Center(
        child: Container(
          height: _itemExtent,
          margin: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.04),
            border: Border(
              top: BorderSide(color: Colors.white.withValues(alpha: 0.18)),
              bottom: BorderSide(color: Colors.white.withValues(alpha: 0.18)),
            ),
          ),
        ),
      ),
    );
  }

  Widget _linha(String texto, int indice, FixedExtentScrollController ctrl) {
    var distancia = 99.0;
    if (ctrl.hasClients) distancia = (indice - ctrl.offset).abs();
    final t = distancia.clamp(0.0, 4.0);
    final opacidade = 1.0 - (t * 0.22);
    final escala = 1.0 - (t * 0.06);
    final central = distancia < 0.5;
    return Center(
      child: Transform.scale(
        scale: escala,
        child: Text(
          texto,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: central ? 26 : 22,
            fontWeight: central ? FontWeight.w700 : FontWeight.w400,
            color: Colors.white.withValues(alpha: opacidade.clamp(0.15, 1.0)),
          ),
        ),
      ),
    );
  }

  Widget _barraZoom(int totalItens) {
    return Container(
      height: 54,
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(27),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          IconButton(
            icon: const Icon(Icons.remove_circle_outline, color: Colors.white70),
            onPressed: _nivel.index > 0
                ? () => _mudarNivel(Nivel.values[_nivel.index - 1], _textoCache)
                : null,
          ),
          Text(
            '${_nivel.rotulo}  ·  $totalItens',
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 15,
              letterSpacing: 0.3,
            ),
          ),
          IconButton(
            icon: const Icon(Icons.add_circle_outline, color: Colors.white70),
            onPressed: _nivel.index < Nivel.values.length - 1
                ? () => _mudarNivel(Nivel.values[_nivel.index + 1], _textoCache)
                : null,
          ),
        ],
      ),
    );
  }
}
