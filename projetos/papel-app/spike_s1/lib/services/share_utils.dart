import 'package:flutter/foundation.dart';
import 'package:share_plus/share_plus.dart';

Future<void> sharePdf(String path, String name) async {
  if (kIsWeb) return;
  try {
    await SharePlus.instance.share(
      ShareParams(files: [XFile(path)], subject: name),
    );
  } catch (_) {}
}
