import 'dart:math';

/// Gera matrizes de cor para os modos de tela do Papel.
/// Algoritmo de temperatura baseado em Tanner Helland.
class ColorFilterService {
  ColorFilterService._();

  /// Converte Kelvin para multiplicadores RGB usando o algoritmo de Tanner Helland.
  /// Retorna uma lista de 20 valores para ColorFilter.matrix.
  static List<double> temperatureToMatrix(double kelvin) {
    final temp = kelvin.clamp(1000, 40000) / 100;
    double r, g, b;

    if (temp <= 66) {
      r = 255;
      g = 99.4708025861 * log(temp) - 161.1195681661;
      if (temp <= 19) {
        b = 0;
      } else {
        b = 138.5177312231 * log(temp - 10) - 305.0447927307;
      }
    } else {
      r = 329.698727446 * pow(temp - 60, -0.1332047592);
      g = 288.1221695283 * pow(temp - 60, -0.0755148492);
      b = 255;
    }

    r = r.clamp(0, 255) / 255;
    g = g.clamp(0, 255) / 255;
    b = b.clamp(0, 255) / 255;

    return [
      r, 0, 0, 0, 0,
      0, g, 0, 0, 0,
      0, 0, b, 0, 0,
      0, 0, 0, 1, 0,
    ];
  }

  /// Combina temperatura com contraste.
  static List<double> withContrast(List<double> matrix, double contrast) {
    final c = contrast;
    final t = (1 - c) / 2;
    return [
      matrix[0] * c, matrix[1] * c, matrix[2] * c, matrix[3], matrix[4] + t,
      matrix[5] * c, matrix[6] * c, matrix[7] * c, matrix[8], matrix[9] + t,
      matrix[10] * c, matrix[11] * c, matrix[12] * c, matrix[13], matrix[14] + t,
      matrix[15], matrix[16], matrix[17], matrix[18], matrix[19],
    ];
  }
}
