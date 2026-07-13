import 'package:flutter/material.dart';
import '../theme/colors.dart';

class LogoMark extends StatelessWidget {
  final double height;
  final Color color;
  const LogoMark({super.key, this.height = 28, this.color = AppColors.primary});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: height * (100 / 90),
      height: height,
      child: CustomPaint(painter: _RMarkPainter(color: color)),
    );
  }
}

class _RMarkPainter extends CustomPainter {
  final Color color;
  const _RMarkPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = color..style = PaintingStyle.fill..isAntiAlias = true;
    final sx = size.width / 100;
    final sy = size.height / 90;

    final outer = Path()
      ..moveTo(0, 0)
      ..lineTo(78 * sx, 0)
      ..cubicTo(100 * sx, 0, 100 * sx, 0, 100 * sx, 24 * sy)
      ..cubicTo(100 * sx, 48 * sy, 86 * sx, 54 * sy, 72 * sx, 54 * sy)
      ..lineTo(60 * sx, 54 * sy)
      ..lineTo(84 * sx, 90 * sy)
      ..lineTo(62 * sx, 90 * sy)
      ..lineTo(38 * sx, 54 * sy)
      ..lineTo(25 * sx, 54 * sy)
      ..lineTo(25 * sx, 90 * sy)
      ..lineTo(0, 90 * sy)
      ..close();

    final bowlHole = Path()
      ..moveTo(25 * sx, 20 * sy)
      ..lineTo(64 * sx, 20 * sy)
      ..cubicTo(78 * sx, 20 * sy, 80 * sx, 30 * sy, 80 * sx, 42 * sy)
      ..cubicTo(80 * sx, 52 * sy, 72 * sx, 54 * sy, 62 * sx, 54 * sy)
      ..lineTo(25 * sx, 54 * sy)
      ..close();

    final arrow1 = Path()
      ..moveTo(25 * sx, 54 * sy)
      ..lineTo(37 * sx, 54 * sy)
      ..lineTo(49 * sx, 20 * sy)
      ..lineTo(37 * sx, 20 * sy)
      ..close();

    final arrow2 = Path()
      ..moveTo(43 * sx, 54 * sy)
      ..lineTo(55 * sx, 54 * sy)
      ..lineTo(67 * sx, 20 * sy)
      ..lineTo(55 * sx, 20 * sy)
      ..close();

    final withHole = Path.combine(PathOperation.difference, outer, bowlHole);
    final withArrow1 = Path.combine(PathOperation.union, withHole, arrow1);
    final full = Path.combine(PathOperation.union, withArrow1, arrow2);
    canvas.drawPath(full, paint);
  }

  @override
  bool shouldRepaint(_RMarkPainter old) => old.color != color;
}

class UpryzinLogo extends StatelessWidget {
  final double height;
  const UpryzinLogo({super.key, this.height = 28});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        LogoMark(height: height),
        const SizedBox(width: 8),
        Text(
          'UPRYZIN',
          style: TextStyle(
            fontFamily: 'SpaceGrotesk',
            fontSize: height * 0.75,
            fontWeight: FontWeight.w700,
            color: AppColors.primary,
            letterSpacing: height * 0.12,
          ),
        ),
      ],
    );
  }
}
