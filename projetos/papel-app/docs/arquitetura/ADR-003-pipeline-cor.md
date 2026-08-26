# ADR-003: Pipeline de cor dos modos de tela (shader, não overlay)

> Data: 24/08/2026 | Status: DECIDIDO

## Contexto
Os três modos especiais (Conforto/luz azul, E-reader, Papel) precisam transformar a cor do conteúdo renderizado sem quebrar 60fps e sem permissões de sistema.

## Opções consideradas
1. **Overlay transparente** (janela amarela semi-transparente sobre o app) — técnica dos apps genéricos de filtro
2. **Transformação no pipeline de renderização** (ColorFilter/fragment shader sobre as páginas e a UI)

## Decisão: transformação via shader (opção 2)

### Justificativa
1. **Preserva contraste** — overlay reduz contraste e aumenta cansaço; transformação de cor mantém ([Horus X](https://us.horus-x.com/blogs/news/blue-light-blocking-glasses-vs-night-mode))
2. **Sem permissões** — overlay global exige `SYSTEM_ALERT_WINDOW` (Android) e nem existe no iOS; como filtro é só dentro do app, shader não pede nada às lojas
3. **Zero custo de GPU perceptível** — ColorFilter/matriz 4x5 aplicada na composição do frame pelo Impeller
4. É exatamente o que o Android nativo faz internamente (Night Light = `setColorTransform` com rampa em Kelvin) ([AOSP](https://source.android.com/docs/core/display/night-light))

## Especificação técnica

### Um único pipeline paramétrico
```dart
// Pseudocódigo conceitual
class ScreenMode {
  final double temperatureK;   // 6500 neutro → 2700 velas
  final double saturation;     // 1.0 cor → 0.0 grayscale
  final double contrast;       // curva tipo papel
  final Color paperTint;       // off-white #FAF8F2 no modo papel
  final double grainOpacity;   // textura fosca (0 desligado)
}
```
- Kelvin→RGB: algoritmo Tanner Helland (curvas quadráticas por canal)
- Grayscale: luma Rec.709 + curva de contraste
- Aplicação: página PDF = `ColorFiltered` wrapper; UI do app = tema derivado do modo

### Presets (MVP)
| Preset | Temp | Saturação | Uso |
|---|---|---|---|
| Normal | 6500K | 100% | padrão |
| Conforto | slider 6500→2700K | 100% | noite |
| E-reader | n/a | 0% + contraste papel | leitura longa |
| Papel | ~4000K fixa | ~15% + grão + brilho limitado | luz externa/reflexo |

### Transição entre modos
Crossfade animado (~300ms spring) + haptic `.light` — nunca corte seco.

## Consequências
- ✅ Funciona igual nas duas plataformas, sem APIs privadas (risco zero de rejeição)
- ✅ Sliders finos viram diferencial de produto
- ⚠️ Grão/textura precisa de cuidado para não custar GPU (usar noise tile estático repetido, não por-frame)
- 🔧 Validação no spike S1: provar `ColorFiltered` sobre pdfrx a 60fps

## Fontes
- docs/pesquisa/modos-de-tela.md
