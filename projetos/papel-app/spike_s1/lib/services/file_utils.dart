import 'file_utils_web.dart'
    if (dart.library.io) 'file_utils_native.dart';

Future<bool> fileExists(String path) => platformFileExists(path);
