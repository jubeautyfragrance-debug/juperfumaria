import 'package:flutter/material.dart';

/// Textura de grão animada (modo Papel/Sépia).
///
/// Conforme ADR-003, o efeito é puramente visual e local: a animação roda
/// num [AnimationController] próprio dentro de um [RepaintBoundary], então
/// cada frame repinta APENAS esta camada — o PdfViewer e o resto da árvore
/// não são reconstruídos.
class TexturaGrao extends StatefulWidget {
  /// Intensidade do grão (0.0 a 0.15).
  final double opacity;

  const TexturaGrao({super.key, required this.opacity});

  @override
  State<TexturaGrao> createState() => _TexturaGraoState();
}

class _TexturaGraoState extends State<TexturaGrao>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    // ~8 fps: cadência sutil de "papel vivo" sem custo de GPU relevante.
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 120),
      value: 0,
    )..repeat();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return RepaintBoundary(
      child: AnimatedBuilder(
        animation: _ctrl,
        builder: (context, _) => CustomPaint(
          painter: _GrainPainter(
            opacity: widget.opacity,
            tick: (_ctrl.value * 256).round(),
          ),
        ),
      ),
    );
  }
}

/// Pintor de ruído pseudo-aleatório determinístico por tick.
class _GrainPainter extends CustomPainter {
  final double opacity;
  final int tick;

  _GrainPainter({required this.opacity, required this.tick});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..style = PaintingStyle.fill;
    final seed = tick * 3571;
    final w = size.width.toInt();
    final h = size.height.toInt();

    for (var i = 0; i < 3000; i++) {
      final s = (seed + i * 7919) & 0xFFFFFF;
      final x = (s % w).toDouble();
      final y = ((s * 31) % h).toDouble();
      final brightness = ((s * 17) % 256) / 255.0;

      paint.color = Colors.white.withValues(alpha: brightness * opacity * 0.3);
      canvas.drawRect(Rect.fromLTWH(x, y, 1.5, 1.5), paint);
    }
  }

  @override
  bool shouldRepaint(_GrainPainter old) =>
      old.opacity != opacity || old.tick != tick;
}
