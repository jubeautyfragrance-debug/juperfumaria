import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/tokens.dart';

/// Timer de sono — bottom sheet de seleção de tempo.
class TimerSono {
  TimerSono._();

  static const _opcoes = <({String label, int minutos})>[
    (label: '15 min', minutos: 15),
    (label: '30 min', minutos: 30),
    (label: '45 min', minutos: 45),
    (label: '1 hora', minutos: 60),
    (label: '2 horas', minutos: 120),
  ];

  /// Abre o sheet de seleção de tempo.
  static void mostrar(BuildContext context, ValueChanged<int> onSelecionar) {
    HapticFeedback.mediumImpact();
    final cs = Theme.of(context).colorScheme;
    showModalBottomSheet(
      context: context,
      builder: (_) => Container(
        padding: const EdgeInsets.fromLTRB(PapelTokens.space20, 0, PapelTokens.space20, PapelTokens.space32),
        decoration: BoxDecoration(
          color: cs.surface,
          borderRadius: const BorderRadius.vertical(
            top: Radius.circular(PapelTokens.radiusLarge),
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Center(
              child: Container(
                width: 36,
                height: 4,
                margin: const EdgeInsets.only(bottom: 20),
                decoration: BoxDecoration(
                  color: cs.outline,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            Text(
              'Timer de sono',
              style: PapelTokens.headline.copyWith(color: cs.onSurface),
            ),
            const SizedBox(height: 4),
            Text(
              'A tela será desligada ao término',
              style: PapelTokens.caption.copyWith(color: cs.onSurfaceVariant),
            ),
            const SizedBox(height: 16),
            ..._opcoes.map(
              (o) => ListTile(
                leading: Icon(Icons.bedtime_outlined, color: cs.primary),
                title: Text(
                  o.label,
                  style: PapelTokens.body.copyWith(color: cs.onSurface),
                ),
                onTap: () {
                  HapticFeedback.lightImpact();
                  Navigator.of(context).pop();
                  onSelecionar(o.minutos);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
