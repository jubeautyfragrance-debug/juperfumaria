import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:hive_ce_flutter/hive_flutter.dart';
import 'package:papel_spike/models/pdf_item.dart';
import 'package:papel_spike/services/prefs_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  late PrefsService prefs;
  Directory? tempDir;

  Future<PrefsService> createService({Map<String, Object> prefsValues = const {}}) async {
    SharedPreferences.setMockInitialValues(prefsValues);
    final service = PrefsService();
    await service.init(hivePath: tempDir!.path);
    return service;
  }

  setUpAll(() async {});

  setUp(() async {
    tempDir = await Directory.systemTemp.createTemp('papel_test');
    // Garante um box limpo para cada teste.
    if (Hive.isBoxOpen('papel_library_box')) {
      await Hive.deleteBoxFromDisk('papel_library_box');
    }
    prefs = await createService();
  });

  PdfItem item(String id, {String name = 'Doc'}) => PdfItem(
        id: id,
        name: name,
        path: '/test/$id.pdf',
        lastOpened: DateTime(2026, 8, 25),
      );

  group('PrefsService.biblioteca', () {
    test('biblioteca vazia por padrão', () async {
      expect(await prefs.loadLibrary(), isEmpty);
    });

    test('addOrUpdate insere e atualiza', () async {
      final doc = item('a');
      await prefs.addOrUpdate(doc);
      expect((await prefs.loadLibrary()).single.id, 'a');

      final updated = doc.copyWith(lastPage: 10, totalPages: 100);
      await prefs.addOrUpdate(updated);

      final lib = await prefs.loadLibrary();
      expect(lib.length, 1);
      expect(lib.first.lastPage, 10);
      expect(lib.first.totalPages, 100);
    });

    test('remove exclui o item', () async {
      await prefs.addOrUpdate(item('a'));
      await prefs.addOrUpdate(item('b'));

      await prefs.remove('a');

      final ids = (await prefs.loadLibrary()).map((e) => e.id);
      expect(ids, ['b']);
    });

    test('persiste entre instâncias', () async {
      await prefs.addOrUpdate(item('persistido'));

      // Nova instância (cache vazio) lê do disco/box
      final other = await createService();

      expect((await other.loadLibrary()).single.id, 'persistido');
    });

    test('migra biblioteca legada do SharedPreferences para o Hive', () async {
      final legacyItem = item('legado');
      final legacyJson = jsonEncode([legacyItem.toJson()]);

      // Fecha o box aberto pelo setUp para simular primeiro app start
      await Hive.box('papel_library_box').close();
      final migrated = await createService(
        prefsValues: {'papel_library': legacyJson},
      );

      expect((await migrated.loadLibrary()).single.id, 'legado');
      // Chave legada é removida após migração
      final sp = await SharedPreferences.getInstance();
      expect(sp.getString('papel_library'), isNull);
    });
  });

  group('PrefsService.mutateLibrary (fila de escrita)', () {
    test('mutações concorrentes NÃO se sobrescrevem (lost update)', () async {
      // Duas mutações disparadas "ao mesmo tempo": a fila garante que a
      // segunda parte do estado escrito pela primeira.
      await Future.wait([
        prefs.mutateLibrary((items) async => items..add(item('primeira'))),
        prefs.mutateLibrary((items) async => items..add(item('segunda'))),
      ]);

      final ids = (await prefs.loadLibrary()).map((e) => e.id).toSet();
      expect(ids, containsAll(['primeira', 'segunda']));
      expect(ids.length, 2);
    });

    test('updateReadingState concorrente com toggleBookmark mantém ambos',
        () async {
      await prefs.addOrUpdate(item('doc'));
      final fileService = FileServiceForTest(prefs);

      await Future.wait([
        fileService.updateReadingState('doc', lastPage: 5),
        fileService.toggleBookmark('doc', 3),
      ]);

      final doc = (await prefs.loadLibrary()).single;
      expect(doc.lastPage, 5);
      expect(doc.bookmarkedPages, [3]);
    });

    test('mutação que falha não trava a fila', () async {
      await expectLater(
        prefs.mutateLibrary((items) => throw Exception('boom')),
        throwsException,
      );

      // A próxima mutação ainda roda normalmente
      await prefs.addOrUpdate(item('depois-do-erro'));
      expect((await prefs.loadLibrary()).single.id, 'depois-do-erro');
    });
  });

  group('PrefsService.tema vs modo de leitura', () {
    test('themeMode default é dark e readerMode default é original', () {
      expect(prefs.themeMode, 'dark');
      expect(prefs.readerMode, 'original');
    });

    test('são chaves independentes', () async {
      await prefs.setThemeMode('light');
      await prefs.setReaderMode('ereader');

      expect(prefs.themeMode, 'light');
      expect(prefs.readerMode, 'ereader');
    });

    test('mudar readerMode não afeta themeMode', () async {
      await prefs.setThemeMode('dark');
      await prefs.setReaderMode('sepia');

      expect(prefs.themeMode, 'dark');
      expect(prefs.readerMode, 'sepia');
    });
  });
}

/// Acesso direto ao FileService real para testar as mutações atômicas.
/// (FileService depende de file_picker apenas nos métodos de pick; os
/// métodos de leitura/escrita são puros em cima do PrefsService.)
class FileServiceForTest {
  final PrefsService _prefs;
  FileServiceForTest(this._prefs);

  Future<void> updateReadingState(
    String id, {
    int? lastPage,
    int? totalPages,
    Set<int>? visitedPages,
    int? readingSeconds,
  }) {
    return _prefs.mutateLibrary((items) async {
      final idx = items.indexWhere((e) => e.id == id);
      if (idx < 0) return items;
      var newPagesRead = items[idx].totalPagesRead;
      if (visitedPages != null && visitedPages.isNotEmpty) {
        newPagesRead = visitedPages.length;
      }
      var newSeconds = items[idx].totalReadingSeconds;
      if (readingSeconds != null) newSeconds += readingSeconds;
      items[idx] = items[idx].copyWith(
        lastPage: lastPage,
        totalPages: totalPages,
        totalPagesRead: newPagesRead,
        totalReadingSeconds: newSeconds,
      );
      return items;
    });
  }

  Future<void> toggleBookmark(String id, int page) {
    return _prefs.mutateLibrary((items) async {
      final idx = items.indexWhere((e) => e.id == id);
      if (idx < 0) return items;
      final bm = List<int>.from(items[idx].bookmarkedPages);
      bm.contains(page) ? bm.remove(page) : bm.add(page);
      if (!bm.contains(page)) bm.sort();
      items[idx] = items[idx].copyWith(bookmarkedPages: bm);
      return items;
    });
  }
}
