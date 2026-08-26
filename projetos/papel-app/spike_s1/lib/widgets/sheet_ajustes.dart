import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/tokens.dart';

/// Modos de tela disponíveis.
enum ModoTela {
  original('Original', 'Cores originais do PDF'),
  sepia('Sépia', 'Tons quentes de papel antigo'),
  noite('Noite', 'Fundo escuro, ideal para escuro'),
  ereader('E-reader', 'Monocromático tipo Kindle'),
  papel('Papel', 'Textura e grão de papel real');

  final String rotulo;
  final String descricao;
  const ModoTela(this.rotulo, this.descricao);
}

/// Sheet de ajustes de leitura — estilo Kindle/Apple Books.
/// Brilho, temperatura, modo de tela, contraste, grão.
class SheetAjustes extends StatefulWidget {
  final ModoTela modoAtual;
  final double temperatura;
  final double brilho;
  final double contraste;
  final double grao;
  final ValueChanged<ModoTela> onModoChanged;
  final ValueChanged<double> onTemperaturaChanged;
  final ValueChanged<double> onBrilhoChanged;
  final ValueChanged<double> onContrasteChanged;
  final ValueChanged<double> onGraoChanged;

  const SheetAjustes({
    super.key,
    required this.modoAtual,
    required this.temperatura,
    required this.brilho,
    required this.contraste,
    required this.grao,
    required this.onModoChanged,
    required this.onTemperaturaChanged,
    required this.onBrilhoChanged,
    required this.onContrasteChanged,
    required this.onGraoChanged,
  });

  @override
  State<SheetAjustes> createState() => _SheetAjustesState();
}

class _SheetAjustesState extends State<SheetAjustes> {
  late ModoTela _modo;
  late double _temp;
  late double _brilho;
  late double _contraste;
  late double _grao;

  @override
  void initState() {
    super.initState();
    _modo = widget.modoAtual;
    _temp = widget.temperatura;
    _brilho = widget.brilho;
    _contraste = widget.contraste;
    _grao = widget.grao;
  }

  void _mudarModo(ModoTela m) {
    setState(() => _modo = m);
    HapticFeedback.lightImpact();
    widget.onModoChanged(m);
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

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
              top: Radius.circular(PapelTokens.radiusLarge),
            ),
          ),
          child: ListView(
            controller: scrollController,
            padding: const EdgeInsets.fromLTRB(PapelTokens.space20, 0, PapelTokens.space20, PapelTokens.space32),
            children: [
              // Handle
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

              // ─── Modos de tela ───
              Text(
                'Modo de tela',
                style: PapelTokens.headline.copyWith(color: cs.onSurface),
              ),
              const SizedBox(height: PapelTokens.space12),              SizedBox(
                height: 42,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: ModoTela.values.length,
                  separatorBuilder: (_, _) => const SizedBox(width: 8),
                  itemBuilder: (context, i) {
                    final m = ModoTela.values[i];
                    final selected = m == _modo;
                    return GestureDetector(
                      onTap: () => _mudarModo(m),
                      child: AnimatedContainer(
                        duration: PapelTokens.durationFast,
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        decoration: BoxDecoration(
                          color: selected
                              ? cs.primary.withValues(alpha: 0.12)
                              : cs.surfaceContainerHighest,
                          borderRadius: BorderRadius.circular(PapelTokens.radiusFull),
                          border: Border.all(
                            color: selected ? cs.primary : cs.outline,
                          ),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          m.rotulo,
                          style: PapelTokens.subhead.copyWith(
                            color: selected ? cs.primary : cs.onSurfaceVariant,
                            fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: PapelTokens.space24),

              // ─── Brilho ───
              _SliderRow(
                icon: Icons.brightness_6_outlined,
                label: 'Brilho',
                value: _brilho,
                min: 0.1,
                max: 1.0,
                divisions: 9,
                display: '${(_brilho * 100).round()}%',
                onChanged: (v) {
                  setState(() => _brilho = v);
                  widget.onBrilhoChanged(v);
                },
              ),

              // ─── Temperatura ───
              if (_modo != ModoTela.ereader) ...[
                _SliderRow(
                  icon: Icons.thermostat_outlined,
                  label: 'Temperatura',
                  value: _temp,
                  min: PapelTokens.tempMin,
                  max: PapelTokens.tempMax,
                  divisions: 19,
                  display: '${_temp.round()}K',
                  displayColor: _tempColor(_temp),
                  onChanged: (v) {
                    setState(() => _temp = v);
                    widget.onTemperaturaChanged(v);
                  },
                ),
              ],

              // ─── Contraste ───
              _SliderRow(
                icon: Icons.contrast_outlined,
                label: 'Contraste',
                value: _contraste,
                min: 0.7,
                max: 1.3,
                divisions: 6,
                display: '${(_contraste * 100).round()}%',
                onChanged: (v) {
                  setState(() => _contraste = v);
                  widget.onContrasteChanged(v);
                },
              ),

              // ─── Grão (textura de papel) ───
              if (_modo == ModoTela.papel || _modo == ModoTela.sepia) ...[
                _SliderRow(
                  icon: Icons.grain_outlined,
                  label: 'Textura',
                  value: _grao,
                  min: 0.0,
                  max: 0.15,
                  divisions: 5,
                  display: '${(_grao * 100 / 0.15).round()}%',
                  onChanged: (v) {
                    setState(() => _grao = v);
                    widget.onGraoChanged(v);
                  },
                ),
              ],

              const SizedBox(height: PapelTokens.space16),

              // ─── Botão de reset ───
              Center(
                child: TextButton(
                  onPressed: () {
                    HapticFeedback.lightImpact();
                    setState(() {
                      _modo = ModoTela.original;
                      _temp = PapelTokens.tempDefault;
                      _brilho = 1.0;
                      _contraste = 1.0;
                      _grao = 0.0;
                    });
                    widget.onModoChanged(ModoTela.original);
                    widget.onTemperaturaChanged(PapelTokens.tempDefault);
                    widget.onBrilhoChanged(1.0);
                    widget.onContrasteChanged(1.0);
                    widget.onGraoChanged(0.0);
                  },
                  child: Text(
                    'Redefinir',
                    style: PapelTokens.subhead.copyWith(color: cs.onSurfaceVariant),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Color _tempColor(double kelvin) {
    final t = (kelvin - PapelTokens.tempMin) / (PapelTokens.tempMax - PapelTokens.tempMin);
    return Color.lerp(
      const Color(0xFFFF8C42),
      const Color(0xFFE8E4DC),
      t.clamp(0.0, 1.0),
    )!;
  }
}

class _SliderRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final double value;
  final double min;
  final double max;
  final int divisions;
  final String display;
  final Color? displayColor;
  final ValueChanged<double> onChanged;

  const _SliderRow({
    required this.icon,
    required this.label,
    required this.value,
    required this.min,
    required this.max,
    required this.divisions,
    required this.display,
    this.displayColor,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Padding(
      padding: const EdgeInsets.only(bottom: PapelTokens.space20),
      child: Row(
        children: [
          Icon(icon, size: 20, color: cs.onSurfaceVariant),
          const SizedBox(width: PapelTokens.space12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      label,
                      style: PapelTokens.caption.copyWith(
                        color: cs.onSurfaceVariant,
                      ),
                    ),
                    Text(
                      display,
                      style: PapelTokens.caption.copyWith(
                        color: displayColor ?? cs.primary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                Slider(
                  value: value.clamp(min, max),
                  min: min,
                  max: max,
                  divisions: divisions,
                  onChangeStart: (_) => HapticFeedback.selectionClick(),
                  onChanged: onChanged,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
