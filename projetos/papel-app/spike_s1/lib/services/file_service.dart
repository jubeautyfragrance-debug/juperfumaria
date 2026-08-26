import 'dart:io';
import 'dart:ui' as ui;

import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:pdfrx/pdfrx.dart';
import 'package:uuid/uuid.dart';
import '../models/pdf_item.dart';
import 'prefs_service.dart';
import 'file_utils.dart';

class FileService {
  final PrefsService _prefs;
  FileService(this._prefs);

  Future<PdfItem?> pickPdf() async {
    final result = await FilePicker.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );
    if (result.isEmpty) return null;

    final file = result.first;

    if (kIsWeb) {
      final bytes = await file.readAsBytes();
      final items = await _prefs.loadLibrary();
      final existing = items.cast<PdfItem?>().firstWhere(
            (e) => e?.path == file.name,
            orElse: () => null,
          );
      if (existing != null) {
        final updated = existing.copyWith(
          lastOpened: DateTime.now(),
          fileSizeBytes: bytes.length,
          pdfBytes: bytes,
        );
        await _prefs.addOrUpdate(updated);
        return updated;
      }

      final item = PdfItem(
        id: const Uuid().v4(),
        name: p.basenameWithoutExtension(file.name),
        path: file.name,
        lastOpened: DateTime.now(),
        fileSizeBytes: bytes.length,
        pdfBytes: bytes,
      );
      await _prefs.addOrUpdate(item);
      return item;
    }

    if (file.path == null) return null;
    final size = await file.length();
    final items = await _prefs.loadLibrary();
    final existing = items.cast<PdfItem?>().firstWhere(
          (e) => e?.path == file.path,
          orElse: () => null,
        );
    if (existing != null) {
      final updated = existing.copyWith(
        lastOpened: DateTime.now(),
        fileSizeBytes: size,
      );
      await _prefs.addOrUpdate(updated);
      return updated;
    }

    final thumbPath = await _generateThumbnail(file.path!);

    final item = PdfItem(
      id: const Uuid().v4(),
      name: p.basenameWithoutExtension(file.name),
      path: file.path!,
      lastOpened: DateTime.now(),
      fileSizeBytes: size,
      thumbnailPath: thumbPath,
    );
    await _prefs.addOrUpdate(item);
    return item;
  }

  /// Renderiza a primeira página do PDF como PNG e salva no diretório
  /// de documentos do app. Retorna null se a geração falhar (o card
  /// exibe o placeholder).
  Future<String?> _generateThumbnail(String pdfPath) async {
    PdfDocument? doc;
    try {
      doc = await PdfDocument.openFile(pdfPath);
      if (doc.pages.isEmpty) return null;
      final page = doc.pages.first;

      final rendered = await page.render(
        fullWidth: page.width,
        fullHeight: page.height,
        backgroundColor: 0xFFFFFFFF,
      );
      if (rendered == null) return null;

      final image = await rendered.createImage(pixelSizeThreshold: 400);
      rendered.dispose();

      final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      image.dispose();
      if (byteData == null) return null;

      final docsDir = await getApplicationDocumentsDirectory();
      final thumbsDir = Directory(p.join(docsDir.path, 'thumbnails'));
      await thumbsDir.create(recursive: true);
      final file = File(p.join(thumbsDir.path, '${const Uuid().v4()}.png'));
      await file.writeAsBytes(byteData.buffer.asUint8List());
      return file.path;
    } catch (_) {
      return null;
    } finally {
      doc?.dispose();
    }
  }

  Future<List<PdfItem>> getLibrary() async {
    final items = await _prefs.loadLibrary();
    if (kIsWeb) {
      items.sort((a, b) => b.lastOpened.compareTo(a.lastOpened));
      return items;
    }
    final valid = <PdfItem>[];
    for (final item in items) {
      if (await fileExists(item.path)) {
        valid.add(item);
      }
    }
    if (valid.length != items.length) {
      await _prefs.saveLibrary(valid);
    }
    valid.sort((a, b) => b.lastOpened.compareTo(a.lastOpened));
    return valid;
  }

  Future<void> remove(String id) async {
    await _prefs.remove(id);
  }

  /// Atualiza o estado de leitura de forma atômica via fila do PrefsService.
  Future<void> updateReadingState(
    String id, {
    int? lastPage,
    int? totalPages,
    Set<int>? visitedPages,
    int? readingSeconds,
  }) async {
    await _prefs.mutateLibrary((items) async {
      final idx = items.indexWhere((e) => e.id == id);
      if (idx < 0) return items;
      final existing = items[idx];

      var newPagesRead = existing.totalPagesRead;
      if (visitedPages != null && visitedPages.isNotEmpty) {
        newPagesRead = visitedPages.length;
      }

      var newSeconds = existing.totalReadingSeconds;
      if (readingSeconds != null) {
        newSeconds += readingSeconds;
      }

      items[idx] = existing.copyWith(
        lastPage: lastPage,
        totalPages: totalPages,
        lastOpened: DateTime.now(),
        totalPagesRead: newPagesRead,
        totalReadingSeconds: newSeconds,
      );
      return items;
    });
  }

  Future<void> toggleBookmark(String id, int page) async {
    await _prefs.mutateLibrary((items) async {
      final idx = items.indexWhere((e) => e.id == id);
      if (idx < 0) return items;
      final existing = items[idx];
      final bm = List<int>.from(existing.bookmarkedPages);
      if (bm.contains(page)) {
        bm.remove(page);
      } else {
        bm.add(page);
        bm.sort();
      }
      items[idx] = existing.copyWith(bookmarkedPages: bm);
      return items;
    });
  }
}
