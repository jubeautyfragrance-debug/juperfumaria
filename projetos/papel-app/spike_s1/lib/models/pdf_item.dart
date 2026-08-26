import 'dart:typed_data';

/// Modelo de um PDF na biblioteca do Papel.
class PdfItem {
  /// Sentinel usado no [copyWith] para distinguir "não informado" de "limpar para null".
  static const _unset = Object();

  final String id;
  final String name;
  final String path;
  final DateTime lastOpened;
  final int? lastPage;
  final int totalPages;
  final int? fileSizeBytes;
  final int totalPagesRead;
  final int totalReadingSeconds;
  final List<int> bookmarkedPages;
  final String? thumbnailPath;
  final Uint8List? pdfBytes;

  const PdfItem({
    required this.id,
    required this.name,
    required this.path,
    required this.lastOpened,
    this.lastPage,
    this.totalPages = 0,
    this.fileSizeBytes,
    this.totalPagesRead = 0,
    this.totalReadingSeconds = 0,
    this.bookmarkedPages = const [],
    this.thumbnailPath,
    this.pdfBytes,
  });

  /// Campos nullable podem ser limpos explicitamente: `copyWith(lastPage: null)`
  /// define o campo como null; omitir o argumento preserva o valor atual.
  PdfItem copyWith({
    String? name,
    DateTime? lastOpened,
    Object? lastPage = _unset,
    int? totalPages,
    Object? fileSizeBytes = _unset,
    int? totalPagesRead,
    int? totalReadingSeconds,
    List<int>? bookmarkedPages,
    Object? thumbnailPath = _unset,
    Object? pdfBytes = _unset,
  }) {
    return PdfItem(
      id: id,
      name: name ?? this.name,
      path: path,
      lastOpened: lastOpened ?? this.lastOpened,
      lastPage: lastPage == _unset ? this.lastPage : lastPage as int?,
      totalPages: totalPages ?? this.totalPages,
      fileSizeBytes: fileSizeBytes == _unset
          ? this.fileSizeBytes
          : fileSizeBytes as int?,
      totalPagesRead: totalPagesRead ?? this.totalPagesRead,
      totalReadingSeconds: totalReadingSeconds ?? this.totalReadingSeconds,
      bookmarkedPages: bookmarkedPages ?? this.bookmarkedPages,
      thumbnailPath: thumbnailPath == _unset
          ? this.thumbnailPath
          : thumbnailPath as String?,
      pdfBytes: pdfBytes == _unset ? this.pdfBytes : pdfBytes as Uint8List?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'path': path,
        'lastOpened': lastOpened.toIso8601String(),
        'lastPage': lastPage,
        'totalPages': totalPages,
        'fileSizeBytes': fileSizeBytes,
        'totalPagesRead': totalPagesRead,
        'totalReadingSeconds': totalReadingSeconds,
        'bookmarkedPages': bookmarkedPages,
        'thumbnailPath': thumbnailPath,
      };

  factory PdfItem.fromJson(Map<String, dynamic> json) => PdfItem(
        id: json['id'] as String,
        name: json['name'] as String,
        path: json['path'] as String,
        lastOpened: DateTime.parse(json['lastOpened'] as String),
        lastPage: json['lastPage'] as int?,
        totalPages: json['totalPages'] as int? ?? 0,
        fileSizeBytes: json['fileSizeBytes'] as int?,
        totalPagesRead: json['totalPagesRead'] as int? ?? 0,
        totalReadingSeconds: json['totalReadingSeconds'] as int? ?? 0,
        bookmarkedPages: (json['bookmarkedPages'] as List<dynamic>?)
                ?.map((e) => e as int)
                .toList() ??
            const [],
        thumbnailPath: json['thumbnailPath'] as String?,
      );

  String get fileSizeFormatted {
    if (fileSizeBytes == null) return '';
    final kb = fileSizeBytes! / 1024;
    if (kb < 1024) return '${kb.toStringAsFixed(0)} KB';
    final mb = kb / 1024;
    return '${mb.toStringAsFixed(1)} MB';
  }

  String get readingTimeFormatted {
    if (totalReadingSeconds <= 0) return '';
    final h = totalReadingSeconds ~/ 3600;
    final m = (totalReadingSeconds % 3600) ~/ 60;
    if (h > 0) return '${h}h ${m}min';
    if (m > 0) return '${m}min';
    return '${totalReadingSeconds}s';
  }
}
