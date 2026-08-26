import 'package:flutter_test/flutter_test.dart';
import 'package:papel_spike/services/color_filter_service.dart';

void main() {
  group('ColorFilterService', () {
    group('temperatureToMatrix', () {
      test('retorna matriz 4x5 (20 elementos)', () {
        final matrix = ColorFilterService.temperatureToMatrix(6500);
        expect(matrix.length, 20);
      });

      test('temperatura 6500K (daylight) retorna valores válidos', () {
        final matrix = ColorFilterService.temperatureToMatrix(6500);
        // Todos os canais RGB devem estar entre 0 e 1
        expect(matrix[0], inInclusiveRange(0.0, 1.0)); // R
        expect(matrix[6], inInclusiveRange(0.0, 1.0)); // G
        expect(matrix[10], inInclusiveRange(0.0, 1.0)); // B
      });

      test('temperatura 2700K (warm) = mais vermelho, menos azul', () {
        final matrix = ColorFilterService.temperatureToMatrix(2700);
        // R deve ser 1.0 (clamp em 255)
        expect(matrix[0], 1.0);
        // B deve ser menor que R
        expect(matrix[10], lessThan(matrix[0]));
      });

      test('temperatura baixa (1000K) não estoura', () {
        final matrix = ColorFilterService.temperatureToMatrix(1000);
        for (var i = 0; i < 20; i++) {
          if (i % 5 != 4) { // pular offsets de translate
            expect(matrix[i], inInclusiveRange(0.0, 1.0));
          }
        }
      });

      test('temperatura alta (40000K) não estoura', () {
        final matrix = ColorFilterService.temperatureToMatrix(40000);
        for (var i = 0; i < 20; i++) {
          if (i % 5 != 4) {
            expect(matrix[i], inInclusiveRange(0.0, 1.0));
          }
        }
      });

      test('clampa valores entre 1000 e 40000', () {
        // Abaixo do mínimo
        final m1 = ColorFilterService.temperatureToMatrix(500);
        expect(m1.length, 20);
        // Acima do máximo
        final m2 = ColorFilterService.temperatureToMatrix(50000);
        expect(m2.length, 20);
      });

      test('canal alpha (row 4) permanece inalterado', () {
        final matrix = ColorFilterService.temperatureToMatrix(3000);
        // Row 4: [0, 0, 0, 1, 0]
        expect(matrix[15], 0.0);
        expect(matrix[16], 0.0);
        expect(matrix[17], 0.0);
        expect(matrix[18], 1.0);
        expect(matrix[19], 0.0);
      });
    });

    group('withContrast', () {
      test('contraste 1.0 = matriz inalterada', () {
        final original = <double>[0.5, 0.2, 0.1, 0, 0.1,
                           0.3, 0.6, 0.1, 0, 0.2,
                           0.1, 0.2, 0.7, 0, 0.3,
                           0,   0,   0,   1, 0];
        final result = ColorFilterService.withContrast(original, 1.0);
        expect(result.length, 20);
        for (var i = 0; i < 20; i++) {
          expect(result[i], closeTo(original[i], 0.001));
        }
      });

      test('contraste 0.0 zera canais de cor', () {
        final original = <double>[0.5, 0.2, 0.1, 0, 0.1,
                           0.3, 0.6, 0.1, 0, 0.2,
                           0.1, 0.2, 0.7, 0, 0.3,
                           0,   0,   0,   1, 0];
        final result = ColorFilterService.withContrast(original, 0.0);
        // Canais RGB multiplicados por 0
        expect(result[0], 0.0);
        expect(result[6], 0.0);
        expect(result[12], 0.0);
        // Alpha row inalterada
        expect(result[18], 1.0);
      });

      test('contraste 1.5 aumenta separação', () {
        final original = <double>[0.5, 0.5, 0.5, 0, 0,
                           0.5, 0.5, 0.5, 0, 0,
                           0.5, 0.5, 0.5, 0, 0,
                           0,   0,   0,   1, 0];
        final result = ColorFilterService.withContrast(original, 1.5);
        // Multiplicado por 1.5
        expect(result[0], closeTo(0.75, 0.001));
        // Offset: (1 - 1.5) / 2 = -0.25
        expect(result[4], closeTo(-0.25, 0.001));
      });

      test('preserva coluna alpha (col 3 e 4 da row 4)', () {
        final original = <double>[0.5, 0.2, 0.1, 0, 0.1,
                           0.3, 0.6, 0.1, 0, 0.2,
                           0.1, 0.2, 0.7, 0, 0.3,
                           0.1, 0.2, 0.3, 0.8, 0.5];
        final result = ColorFilterService.withContrast(original, 1.2);
        // Row 4 preservada
        expect(result[15], original[15]);
        expect(result[16], original[16]);
        expect(result[17], original[17]);
        expect(result[18], original[18]);
        expect(result[19], original[19]);
      });
    });
  });
}
