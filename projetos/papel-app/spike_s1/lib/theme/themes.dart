import 'package:flutter/material.dart';
import 'tokens.dart';

/// Temas do Papel: claro, escuro, e-reader e papel.
/// Cada tema é uma cidadã de primeira classe — UI inteira muda.
class PapelThemes {
  PapelThemes._();

  // ─── Tema CLARO ───
  static ThemeData get light => _build(
        brightness: Brightness.light,
        scaffoldBg: const Color(0xFFF8F6F1),
        surface: Colors.white,
        surfaceVariant: const Color(0xFFF2F0EB),
        onSurface: const Color(0xFF1A1612),
        onSurfaceVariant: const Color(0xFF5A5550),
        accent: const Color(0xFF8B6914),
        accentSoft: const Color(0xFF8B6914).withValues(alpha: 0.1),
        divider: const Color(0xFFE5E0D8),
        shadowColor: Colors.black.withValues(alpha: 0.08),
      );

  // ─── Tema ESCURO ───
  static ThemeData get dark => _build(
        brightness: Brightness.dark,
        scaffoldBg: const Color(0xFF0E0D0B),
        surface: const Color(0xFF1A1816),
        surfaceVariant: const Color(0xFF242220),
        onSurface: const Color(0xFFE8E0D4),
        onSurfaceVariant: const Color(0xFF9A9088),
        accent: const Color(0xFFD4A854),
        accentSoft: const Color(0xFFD4A854).withValues(alpha: 0.12),
        divider: const Color(0xFF2A2826),
        shadowColor: Colors.black.withValues(alpha: 0.3),
      );

  // ─── Tema E-READER ───
  static ThemeData get ereader => _build(
        brightness: Brightness.light,
        scaffoldBg: const Color(0xFFE8E2D6),
        surface: const Color(0xFFEDE8DD),
        surfaceVariant: const Color(0xFFDDD8CC),
        onSurface: const Color(0xFF2C2820),
        onSurfaceVariant: const Color(0xFF5A5548),
        accent: const Color(0xFF5C4A2A),
        accentSoft: const Color(0xFF5C4A2A).withValues(alpha: 0.1),
        divider: const Color(0xFFC8C0B0),
        shadowColor: Colors.black.withValues(alpha: 0.06),
      );

  // ─── Tema PAPEL (textura + grão) ───
  static ThemeData get papel => _build(
        brightness: Brightness.light,
        scaffoldBg: const Color(0xFFF5F0E5),
        surface: const Color(0xFFFAF6ED),
        surfaceVariant: const Color(0xFFEDE8DC),
        onSurface: const Color(0xFF3A352D),
        onSurfaceVariant: const Color(0xFF6A6458),
        accent: const Color(0xFF7A5C2A),
        accentSoft: const Color(0xFF7A5C2A).withValues(alpha: 0.1),
        divider: const Color(0xFFD8D0C0),
        shadowColor: Colors.black.withValues(alpha: 0.05),
      );

  static ThemeData _build({
    required Brightness brightness,
    required Color scaffoldBg,
    required Color surface,
    required Color surfaceVariant,
    required Color onSurface,
    required Color onSurfaceVariant,
    required Color accent,
    required Color accentSoft,
    required Color divider,
    required Color shadowColor,
  }) {
    final isDark = brightness == Brightness.dark;
    final colorScheme = ColorScheme(
      brightness: brightness,
      primary: accent,
      onPrimary: isDark ? const Color(0xFF1A1612) : Colors.white,
      primaryContainer: accentSoft,
      secondary: onSurfaceVariant,
      onSecondary: onSurface,
      surface: surface,
      onSurface: onSurface,
      surfaceContainerHighest: surfaceVariant,
      error: const Color(0xFFBA1A1A),
      onError: Colors.white,
      outline: divider,
      outlineVariant: divider,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: scaffoldBg,
      dividerColor: divider,
      splashFactory: NoSplash.splashFactory,
      highlightColor: accentSoft,
      splashColor: accentSoft,
      appBarTheme: AppBarTheme(
        backgroundColor: scaffoldBg,
        foregroundColor: onSurface,
        elevation: 0,
        scrolledUnderElevation: 0,
        titleTextStyle: PapelTokens.headline.copyWith(color: onSurface),
        centerTitle: true,
      ),
      cardTheme: CardThemeData(
        color: surface,
        elevation: 0,
        shadowColor: shadowColor,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(PapelTokens.radiusMedium),
          side: BorderSide(color: divider),
        ),
        margin: EdgeInsets.zero,
      ),
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: accent,
        foregroundColor: isDark ? const Color(0xFF1A1612) : Colors.white,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(PapelTokens.radiusLarge),
        ),
      ),
      segmentedButtonTheme: SegmentedButtonThemeData(
        style: ButtonStyle(
          backgroundColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) return accentSoft;
            return Colors.transparent;
          }),
          foregroundColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) return accent;
            return onSurfaceVariant;
          }),
          side: WidgetStateProperty.all(BorderSide(color: divider)),
          shape: WidgetStateProperty.all(
            RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(PapelTokens.radiusSmall),
            ),
          ),
          padding: WidgetStateProperty.all(
            const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          ),
        ),
      ),
      sliderTheme: SliderThemeData(
        activeTrackColor: accent,
        inactiveTrackColor: divider,
        thumbColor: accent,
        overlayColor: accentSoft,
        trackHeight: 4,
        thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 8),
        overlayShape: const RoundSliderOverlayShape(overlayRadius: 20),
      ),
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return accent;
          return onSurfaceVariant;
        }),
        trackColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return accentSoft;
          return divider;
        }),
      ),
      bottomSheetTheme: BottomSheetThemeData(
        backgroundColor: surface,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(PapelTokens.radiusLarge),
          ),
        ),
        showDragHandle: true,
        dragHandleColor: divider,
      ),
      chipTheme: ChipThemeData(
        backgroundColor: surfaceVariant,
        selectedColor: accentSoft,
        labelStyle: PapelTokens.footnote,
        side: BorderSide(color: divider),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(PapelTokens.radiusFull),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      ),
      iconTheme: IconThemeData(
        color: onSurfaceVariant,
        size: 22,
      ),
      textTheme: TextTheme(
        headlineLarge: PapelTokens.largeTitle.copyWith(color: onSurface),
        titleLarge: PapelTokens.title1.copyWith(color: onSurface),
        titleMedium: PapelTokens.title2.copyWith(color: onSurface),
        titleSmall: PapelTokens.title3.copyWith(color: onSurface),
        headlineMedium: PapelTokens.headline.copyWith(color: onSurface),
        bodyLarge: PapelTokens.body.copyWith(color: onSurface),
        bodyMedium: PapelTokens.callout.copyWith(color: onSurface),
        bodySmall: PapelTokens.subhead.copyWith(color: onSurfaceVariant),
        labelLarge: PapelTokens.footnote.copyWith(color: onSurfaceVariant),
        labelMedium: PapelTokens.caption.copyWith(color: onSurfaceVariant),
        labelSmall: PapelTokens.caption.copyWith(
          color: onSurfaceVariant,
          fontSize: 11,
          letterSpacing: 0,
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: surface,
        contentTextStyle: PapelTokens.body.copyWith(color: onSurface),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(PapelTokens.radiusMedium),
        ),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: surface,
        titleTextStyle: PapelTokens.headline.copyWith(color: onSurface),
        contentTextStyle: PapelTokens.body.copyWith(color: onSurfaceVariant),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(PapelTokens.radiusLarge),
        ),
      ),
    );
  }
}

/// Mapeia nome do modo para tema.
ThemeData themeForMode(String mode) => switch (mode) {
      'dark' => PapelThemes.dark,
      'ereader' => PapelThemes.ereader,
      'papel' => PapelThemes.papel,
      _ => PapelThemes.light,
    };
