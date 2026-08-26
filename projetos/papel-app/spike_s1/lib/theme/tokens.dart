import 'package:flutter/material.dart';

/// Design tokens do Papel — grid 8pt, tipografia semântica, paleta por modo.
class PapelTokens {
  PapelTokens._();

  // ─── Espaçamento (grid 8pt) ───
  static const double space2 = 2;
  static const double space4 = 4;
  static const double space8 = 8;
  static const double space12 = 12;
  static const double space16 = 16;
  static const double space20 = 20;
  static const double space24 = 24;
  static const double space32 = 32;
  static const double space40 = 40;
  static const double space48 = 48;
  static const double space64 = 64;

  // ─── Border radius (squircle Apple) ───
  static const double radiusSmall = 8;
  static const double radiusMedium = 14;
  static const double radiusLarge = 20;
  static const double radiusXL = 28;
  static const double radiusFull = 999;

  // ─── Tipografia ───
  static const String _fontDisplay = 'New York';
  static const String _fontBody = '.SF Pro Text';

  static const TextStyle largeTitle = TextStyle(
    fontFamily: _fontDisplay,
    fontSize: 34,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.4,
    height: 1.15,
  );

  static const TextStyle title1 = TextStyle(
    fontFamily: _fontDisplay,
    fontSize: 28,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.3,
    height: 1.2,
  );

  static const TextStyle title2 = TextStyle(
    fontFamily: _fontDisplay,
    fontSize: 22,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.2,
    height: 1.25,
  );

  static const TextStyle title3 = TextStyle(
    fontFamily: _fontDisplay,
    fontSize: 20,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.1,
    height: 1.3,
  );

  static const TextStyle headline = TextStyle(
    fontFamily: _fontBody,
    fontSize: 17,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.1,
    height: 1.3,
  );

  static const TextStyle body = TextStyle(
    fontFamily: _fontBody,
    fontSize: 17,
    fontWeight: FontWeight.w400,
    letterSpacing: -0.1,
    height: 1.5,
  );

  static const TextStyle callout = TextStyle(
    fontFamily: _fontBody,
    fontSize: 16,
    fontWeight: FontWeight.w400,
    letterSpacing: -0.1,
    height: 1.4,
  );

  static const TextStyle subhead = TextStyle(
    fontFamily: _fontBody,
    fontSize: 15,
    fontWeight: FontWeight.w400,
    letterSpacing: -0.1,
    height: 1.4,
  );

  static const TextStyle footnote = TextStyle(
    fontFamily: _fontBody,
    fontSize: 13,
    fontWeight: FontWeight.w400,
    letterSpacing: -0.1,
    height: 1.4,
  );

  static const TextStyle caption = TextStyle(
    fontFamily: _fontBody,
    fontSize: 12,
    fontWeight: FontWeight.w400,
    letterSpacing: 0,
    height: 1.3,
  );

  // ─── Shadows ───
  static List<BoxShadow> get shadowSmall => [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.06),
      blurRadius: 8,
      offset: const Offset(0, 2),
    ),
  ];

  static List<BoxShadow> get shadowMedium => [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.1),
      blurRadius: 16,
      offset: const Offset(0, 4),
    ),
  ];

  static List<BoxShadow> get shadowLarge => [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.14),
      blurRadius: 32,
      offset: const Offset(0, 8),
    ),
  ];

  // ─── Duração de animação ───
  static const Duration durationFast = Duration(milliseconds: 150);
  static const Duration durationNormal = Duration(milliseconds: 300);
  static const Duration durationSlow = Duration(milliseconds: 500);
  static const Duration durationVerySlow = Duration(milliseconds: 800);

  // ─── Spring animation ───
  static const SpringDescription springNormal = SpringDescription(
    mass: 1,
    stiffness: 220,
    damping: 20,
  );

  static const SpringDescription springSlow = SpringDescription(
    mass: 1,
    stiffness: 120,
    damping: 14,
  );

  // ─── Temperatura de cor (Kelvin) ───
  static const double tempMin = 2700;
  static const double tempMax = 6500;
  static const double tempDefault = 6500;
}
