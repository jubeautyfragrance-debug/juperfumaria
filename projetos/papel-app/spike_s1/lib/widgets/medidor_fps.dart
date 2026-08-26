import 'dart:ui' show FramePhase;
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

/// Medidor de FPS em tempo real — overlay discreto.
class MedidorFps extends StatefulWidget {
  const MedidorFps({super.key});

  @override
  State<MedidorFps> createState() => _MedidorFpsState();
}

class _MedidorFpsState extends State<MedidorFps> {
  final ValueNotifier<double> _fps = ValueNotifier(0);
  int _quadros = 0;
  int _inicioJanelaUs = 0;
  bool _primeiro = true;

  @override
  void initState() {
    super.initState();
    SchedulerBinding.instance.addTimingsCallback(_aoMedir);
  }

  @override
  void dispose() {
    SchedulerBinding.instance.removeTimingsCallback(_aoMedir);
    super.dispose();
  }

  void _aoMedir(List<FrameTiming> timings) {
    for (final t in timings) {
      if (_primeiro) {
        _inicioJanelaUs = t.timestampInMicroseconds(FramePhase.rasterFinish);
        _primeiro = false;
      }
      _quadros++;
      final decorrido =
          t.timestampInMicroseconds(FramePhase.rasterFinish) - _inicioJanelaUs;
      if (decorrido >= 1000000) {
        _fps.value = _quadros * 1000000 / decorrido;
        _quadros = 0;
        _primeiro = true;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<double>(
      valueListenable: _fps,
      builder: (_, v, _) {
        final cor = v >= 55
            ? const Color(0xFF34C759)
            : v > 0
                ? const Color(0xFFFF9F0A)
                : Theme.of(context).colorScheme.onSurfaceVariant;

        return AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
          decoration: BoxDecoration(
            color: Colors.black.withValues(alpha: 0.65),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 6,
                height: 6,
                decoration: BoxDecoration(
                  color: cor,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 6),
              Text(
                '${v.toStringAsFixed(0)} fps',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  fontFeatures: [FontFeature.tabularFigures()],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
