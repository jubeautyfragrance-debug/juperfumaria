import 'dart:io';

Future<bool> platformFileExists(String path) => File(path).exists();
