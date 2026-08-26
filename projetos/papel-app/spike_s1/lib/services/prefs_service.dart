import 'dart:async';
import 'dart:convert';

import 'package:hive_ce_flutter/hive_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/pdf_item.dart';

/// Serviço de persistência de preferências e biblioteca.
///
/// - Preferências leves (tema, brilho, etc.) ficam no SharedPreferences.
/// - A biblioteca fica num box do Hive (suporta bibliotecas grandes, sem
///   serializar tudo numa única string) com migração automática dos dados
///   antigos do SharedPreferences.
///
/// Toda mutação da biblioteca passa por [mutateLibrary], que serializa as
/// escritas numa fila — eliminando as race conditions de read-modify-write
/// concorrente.
class PrefsService {
  static const _keyLibrary = 'papel_library'; // legado (migração)
  static const _boxLibrary = 'papel_library_box';
  static const _keyThemeMode = 'papel_theme_mode';
  static const _keyReaderMode = 'papel_reader_mode';
  static const _keyTemperature = 'papel_temperature';
  static const _keyBrightness = 'papel_brightness';
  static const _keyGrainIntensity = 'papel_grain';
  static const _keyContrast = 'papel_contrast';

  static bool _hiveInitialized = false;

  SharedPreferences? _prefs;
  Box? _libraryBox;
  List<PdfItem>? _libraryCache;

  /// Fila que serializa todas as mutações da biblioteca.
  Future<void> _writeQueue = Future<void>.value();

  Future<void> init({String? hivePath}) async {
    _prefs = await SharedPreferences.getInstance();

    if (!_hiveInitialized) {
      if (hivePath != null) {
        // Testes: diretório temporário em vez de path_provider.
        Hive.init(hivePath);
      } else {
        await Hive.initFlutter();
      }
      _hiveInitialized = true;
    }
    _libraryBox = await Hive.openBox(_boxLibrary);
    await _migrateFromSharedPreferences();
  }

  /// Migração one-time: importa a biblioteca legada do SharedPreferences
  /// (JSON único) para o box do Hive e remove a chave antiga.
  Future<void> _migrateFromSharedPreferences() async {
    final box = _safeBox;
    if (box.isNotEmpty) return;

    final raw = _safePrefs.getString(_keyLibrary);
    if (raw == null) return;

    try {
      final list = jsonDecode(raw) as List;
      for (final e in list) {
        final item = PdfItem.fromJson(e as Map<String, dynamic>);
        await box.put(item.id, item.toJson());
      }
      await _safePrefs.remove(_keyLibrary);
    } catch (_) {
      // Dados legados corrompidos: descarta silenciosamente.
    }
  }

  SharedPreferences get _safePrefs {
    final p = _prefs;
    if (p == null) throw StateError('PrefsService.init() não foi chamado');
    return p;
  }

  Box get _safeBox {
    final b = _libraryBox;
    if (b == null) throw StateError('PrefsService.init() não foi chamado');
    return b;
  }

  // ─── Biblioteca ───

  /// Carrega a biblioteca (do cache em memória, se já carregada).
  /// Retorna uma cópia — mutações devem passar por [mutateLibrary].
  Future<List<PdfItem>> loadLibrary() async {
    final cached = _libraryCache;
    if (cached != null) return List.of(cached);
    return _loadFromDisk();
  }

  Future<List<PdfItem>> _loadFromDisk() async {
    try {
      return _safeBox.values
          .map((e) => PdfItem.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList();
    } catch (_) {
      return [];
    }
  }

  /// Aplica uma mutação à biblioteca de forma atômica.
  ///
  /// As mutações são enfileiradas: cada uma lê o estado mais recente,
  /// aplica a transformação e persiste antes da próxima rodar. Isso garante
  /// que updates concorrentes (ex.: troca de página + fim de sessão) nunca
  /// sobrescrevam um ao outro.
  Future<void> mutateLibrary(
    FutureOr<List<PdfItem>> Function(List<PdfItem> items) mutate,
  ) {
    final task = _writeQueue.then<void>((_) async {
      var items = await _loadFromDisk();
      items = await mutate(items);
      _libraryCache = items;

      // Sincroniza o box: grava/atualiza itens e remove os excluídos.
      final box = _safeBox;
      final validIds = items.map((e) => e.id).toSet();
      for (final key in box.keys.toList()) {
        if (!validIds.contains(key)) {
          await box.delete(key);
        }
      }
      for (final item in items) {
        if (box.get(item.id) == null ||
            !_sameJson(box.get(item.id), item.toJson())) {
          await box.put(item.id, item.toJson());
        }
      }
    });
    // Mantém a fila viva mesmo se uma mutação falhar.
    _writeQueue = task.then<void>(
      (_) {},
      onError: (Object e, StackTrace s) {},
    );
    return task;
  }

  static bool _sameJson(Object? a, Object? b) =>
      jsonEncode(a) == jsonEncode(b);

  Future<void> saveLibrary(List<PdfItem> items) => mutateLibrary((_) => items);

  Future<void> addOrUpdate(PdfItem item) => mutateLibrary((items) async {
        final idx = items.indexWhere((e) => e.id == item.id);
        if (idx >= 0) {
          items[idx] = item;
        } else {
          items.insert(0, item);
        }
        return items;
      });

  Future<void> remove(String id) => mutateLibrary((items) async {
        items.removeWhere((e) => e.id == id);
        return items;
      });

  // ─── Tema do app (claro/escuro) ───
  String get themeMode => _safePrefs.getString(_keyThemeMode) ?? 'dark';
  Future<void> setThemeMode(String mode) =>
      _safePrefs.setString(_keyThemeMode, mode);

  // ─── Modo de leitura (filtro de tela do leitor) ───
  String get readerMode => _safePrefs.getString(_keyReaderMode) ?? 'original';
  Future<void> setReaderMode(String mode) =>
      _safePrefs.setString(_keyReaderMode, mode);

  // ─── Temperatura (Kelvin) ───
  double get temperature => _safePrefs.getDouble(_keyTemperature) ?? 6500;
  Future<void> setTemperature(double v) =>
      _safePrefs.setDouble(_keyTemperature, v);

  // ─── Brilho ───
  double get brightness => _safePrefs.getDouble(_keyBrightness) ?? 1.0;
  Future<void> setBrightness(double v) =>
      _safePrefs.setDouble(_keyBrightness, v);

  // ─── Intensidade do grão ───
  double get grainIntensity => _safePrefs.getDouble(_keyGrainIntensity) ?? 0.0;
  Future<void> setGrainIntensity(double v) =>
      _safePrefs.setDouble(_keyGrainIntensity, v);

  // ─── Contraste ───
  double get contrast => _safePrefs.getDouble(_keyContrast) ?? 1.0;
  Future<void> setContrast(double v) => _safePrefs.setDouble(_keyContrast, v);
}
