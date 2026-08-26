import 'dart:ui';
import 'package:pdfrx/pdfrx.dart';

/// Represents a highlighted text range in a PDF page.
class PdfHighlight {
  final Color color;
  final PdfPageTextRange range;

  const PdfHighlight(this.color, this.range);
}

/// Available highlight colors.
const highlightColors = [
  Color(0xFFFFEB3B), // Yellow
  Color(0xFFFF9800), // Orange
  Color(0xFF4CAF50), // Green
  Color(0xFF2196F3), // Blue
  Color(0xFFE91E63), // Pink
  Color(0xFF9C27B0), // Purple
];

/// Paints highlights on a PDF page canvas.
void paintHighlights(
  Canvas canvas,
  Rect pageRect,
  PdfPage page,
  List<PdfHighlight> highlights,
) {
  final pageHighlights = highlights.where(
    (h) => h.range.pageNumber == page.pageNumber,
  );

  for (final highlight in pageHighlights) {
    final paint = Paint()
      ..color = highlight.color.withAlpha(100)
      ..style = PaintingStyle.fill;

    canvas.drawRect(
      highlight.range.bounds.toRectInDocument(page: page, pageRect: pageRect),
      paint,
    );
  }
}
