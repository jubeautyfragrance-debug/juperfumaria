import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:papel_spike/models/pdf_item.dart';

void main() {
  group('PdfItem', () {
    final now = DateTime(2026, 8, 25, 14, 30);

    PdfItem createTestItem({
      String? id,
      String? name,
      String? path,
      DateTime? lastOpened,
      int? lastPage,
      int? totalPages,
      int? fileSizeBytes,
      int? totalPagesRead,
      int? totalReadingSeconds,
      List<int>? bookmarkedPages,
      String? thumbnailPath,
    }) {
      return PdfItem(
        id: id ?? 'test-id-123',
        name: name ?? 'Documento Teste',
        path: path ?? '/storage/emulated/0/Download/teste.pdf',
        lastOpened: lastOpened ?? now,
        lastPage: lastPage,
        totalPages: totalPages ?? 0,
        fileSizeBytes: fileSizeBytes,
        totalPagesRead: totalPagesRead ?? 0,
        totalReadingSeconds: totalReadingSeconds ?? 0,
        bookmarkedPages: bookmarkedPages ?? const [],
        thumbnailPath: thumbnailPath,
      );
    }

    group('toJson / fromJson', () {
      test('serializa e desserializa corretamente', () {
        final item = createTestItem(
          lastPage: 42,
          totalPages: 100,
          fileSizeBytes: 5242880,
          totalPagesRead: 15,
          totalReadingSeconds: 3600,
          bookmarkedPages: [1, 5, 10],
          thumbnailPath: '/path/to/thumb.png',
        );

        final json = item.toJson();
        final restored = PdfItem.fromJson(json);

        expect(restored.id, item.id);
        expect(restored.name, item.name);
        expect(restored.path, item.path);
        expect(restored.lastPage, 42);
        expect(restored.totalPages, 100);
        expect(restored.fileSizeBytes, 5242880);
        expect(restored.totalPagesRead, 15);
        expect(restored.totalReadingSeconds, 3600);
        expect(restored.bookmarkedPages, [1, 5, 10]);
        expect(restored.thumbnailPath, '/path/to/thumb.png');
      });

      test('desserializa com campos opcionais nulos', () {
        final json = {
          'id': 'test-id',
          'name': 'Test',
          'path': '/test.pdf',
          'lastOpened': now.toIso8601String(),
          'lastPage': null,
          'totalPages': null,
          'fileSizeBytes': null,
          'totalPagesRead': null,
          'totalReadingSeconds': null,
          'bookmarkedPages': null,
          'thumbnailPath': null,
        };

        final item = PdfItem.fromJson(json);
        expect(item.lastPage, isNull);
        expect(item.totalPages, 0);
        expect(item.fileSizeBytes, isNull);
        expect(item.bookmarkedPages, isEmpty);
        expect(item.thumbnailPath, isNull);
      });

      test('roundtrip JSON completo', () {
        final item = createTestItem();
        final jsonStr = jsonEncode(item.toJson());
        final restored = PdfItem.fromJson(jsonDecode(jsonStr));
        expect(restored.id, item.id);
      });
    });

    group('copyWith', () {
      test('não altera campos originais', () {
        final original = createTestItem(name: 'Original');
        final copy = original.copyWith(name: 'Cópia');

        expect(original.name, 'Original');
        expect(copy.name, 'Cópia');
        expect(copy.path, original.path);
        expect(copy.id, original.id);
      });

      test('preserva todos os campos quando nenhum argumento', () {
        final original = createTestItem(
          lastPage: 10,
          totalPages: 50,
          bookmarkedPages: [1, 2],
        );
        final copy = original.copyWith();

        expect(copy.lastPage, 10);
        expect(copy.totalPages, 50);
        expect(copy.bookmarkedPages, [1, 2]);
      });

      test('atualiza apenas campos especificados', () {
        final original = createTestItem(lastPage: 5, totalPages: 100);
        final copy = original.copyWith(lastPage: 50);

        expect(copy.lastPage, 50);
        expect(copy.totalPages, 100); // preservado
      });

      test('limpa campos nullable explicitamente com null', () {
        final original = createTestItem(
          lastPage: 5,
          thumbnailPath: '/thumb.png',
        );
        final cleared = original.copyWith(lastPage: null, thumbnailPath: null);

        expect(cleared.lastPage, isNull);
        expect(cleared.thumbnailPath, isNull);
        // Campos não informados permanecem
        expect(cleared.name, original.name);
        expect(cleared.path, original.path);
      });
    });

    group('formatação', () {
      test('fileSizeFormatted com bytes', () {
        final item = createTestItem(fileSizeBytes: 512000);
        expect(item.fileSizeFormatted, '500 KB');
      });

      test('fileSizeFormatted com megabytes', () {
        final item = createTestItem(fileSizeBytes: 5242880);
        expect(item.fileSizeFormatted, '5.0 MB');
      });

      test('fileSizeFormatted sem tamanho', () {
        final item = createTestItem();
        expect(item.fileSizeFormatted, '');
      });

      test('readingTimeFormatted em horas', () {
        final item = createTestItem(totalReadingSeconds: 3720); // 1h 2m
        expect(item.readingTimeFormatted, '1h 2min');
      });

      test('readingTimeFormatted em minutos', () {
        final item = createTestItem(totalReadingSeconds: 150); // 2m 30s
        expect(item.readingTimeFormatted, '2min');
      });

      test('readingTimeFormatted em segundos', () {
        final item = createTestItem(totalReadingSeconds: 45);
        expect(item.readingTimeFormatted, '45s');
      });

      test('readingTimeFormatted sem tempo', () {
        final item = createTestItem();
        expect(item.readingTimeFormatted, '');
      });
    });

    group('valores padrão', () {
      test('totalPages default é 0', () {
        final item = createTestItem();
        expect(item.totalPages, 0);
      });

      test('totalPagesRead default é 0', () {
        final item = createTestItem();
        expect(item.totalPagesRead, 0);
      });

      test('totalReadingSeconds default é 0', () {
        final item = createTestItem();
        expect(item.totalReadingSeconds, 0);
      });

      test('bookmarkedPages default é lista vazia', () {
        final item = createTestItem();
        expect(item.bookmarkedPages, isEmpty);
      });
    });
  });
}
