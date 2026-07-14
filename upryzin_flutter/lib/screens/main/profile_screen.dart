import 'dart:math' as math;
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/models.dart';
import '../../theme/colors.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});
  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> with SingleTickerProviderStateMixin {
  late TabController _tabs;
  @override
  void initState() { super.initState(); _tabs = TabController(length: 3, vsync: this); }
  @override
  void dispose() { _tabs.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return NestedScrollView(
      headerSliverBuilder: (_, __) => [
        SliverToBoxAdapter(child: _ProfileHeader(tabs: _tabs)),
      ],
      body: TabBarView(controller: _tabs, children: [
        _PortfolioGrid(items: me.portfolioItems),
        _PortfolioGrid(items: me.portfolioItems.take(4).toList()),
        _PortfolioGrid(items: me.portfolioItems.where((p) => p.likes > 2000).toList()),
      ]),
    );
  }
}

// ─── Profile Header ───────────────────────────────────────────────────────────
class _ProfileHeader extends StatelessWidget {
  final TabController tabs;
  const _ProfileHeader({required this.tabs});

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      // Cover image
      Stack(children: [
        Container(height: 140,
          decoration: const BoxDecoration(
            image: DecorationImage(
              image: CachedNetworkImageProvider('https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=1200&h=300&fit=crop&auto=format'),
              fit: BoxFit.cover),
          ),
          foregroundDecoration: const BoxDecoration(gradient: LinearGradient(
              colors: [Color(0xFF07191E), Color(0x4007191E), Colors.transparent],
              begin: Alignment.bottomCenter, end: Alignment.topCenter))),
      ]),
      // Avatar + actions row
      Padding(padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
        child: Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
          Transform.translate(offset: const Offset(0, -28),
            child: Container(padding: const EdgeInsets.all(3),
              decoration: const BoxDecoration(shape: BoxShape.circle, color: AppColors.background),
              child: CircleAvatar(radius: 38, backgroundImage: const CachedNetworkImageProvider('https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format'), backgroundColor: AppColors.card))),
          const Spacer(),
          Transform.translate(offset: const Offset(0, -6),
            child: Row(children: [
              Container(padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(10), boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 10)]),
                child: Text('Edit Profile', style: GoogleFonts.spaceGrotesk(color: AppColors.background, fontSize: 13, fontWeight: FontWeight.w700))),
              const SizedBox(width: 8),
              Container(width: 38, height: 38, decoration: BoxDecoration(color: Colors.white.withOpacity(0.05), borderRadius: BorderRadius.circular(10), border: Border.all(color: Colors.white12)),
                child: const Icon(Icons.settings_outlined, color: AppColors.muted, size: 18)),
            ])),
        ])),
      // Name + info
      Transform.translate(offset: const Offset(0, -16),
        child: Padding(padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Text(me.name, style: GoogleFonts.spaceGrotesk(color: AppColors.foreground, fontSize: 22, fontWeight: FontWeight.w700)),
              const SizedBox(width: 6),
              if (me.verified) const Icon(Icons.verified_rounded, color: AppColors.primary, size: 18),
            ]),
            Text('@${me.username}', style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 13)),
            const SizedBox(height: 6),
            Row(children: [
              const Icon(Icons.location_on_outlined, color: AppColors.muted, size: 13),
              const SizedBox(width: 4),
              Text(me.location, style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 12)),
              const SizedBox(width: 12),
              const Icon(Icons.language_rounded, color: AppColors.primary, size: 13),
              const SizedBox(width: 4),
              Text('amara.creates.co', style: GoogleFonts.dmSans(color: AppColors.primary, fontSize: 12)),
            ]),
            const SizedBox(height: 10),
            Text(me.bio, style: GoogleFonts.dmSans(color: const Color(0xFFC8E8E8), fontSize: 14, height: 1.5)),
            const SizedBox(height: 10),
            // Skills
            Wrap(spacing: 6, runSpacing: 6, children: me.skills.map((s) =>
              Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.08), borderRadius: BorderRadius.circular(20), border: Border.all(color: AppColors.primary.withOpacity(0.2))),
                child: Text(s, style: GoogleFonts.dmSans(color: const Color(0xFF3DDEAA), fontSize: 11)))).toList()),
          ]))),
      // Score + stats row
      Padding(padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
        child: Row(children: [
          // Score ring
          Column(children: [
            _ScoreRing(score: me.creditsScore, size: 72),
            const SizedBox(height: 4),
            Row(children: [const Icon(Icons.bolt_rounded, color: AppColors.primary, size: 10), const SizedBox(width: 2), Text('SCORE', style: GoogleFonts.dmSans(color: AppColors.primary, fontSize: 9, fontWeight: FontWeight.w700, letterSpacing: 1))]),
          ]),
          Expanded(child: Padding(padding: const EdgeInsets.only(left: 20),
            child: Row(children: [
              _Stat(fmtNum(me.posts), 'Projects'),
              Container(width: 1, height: 32, color: Colors.white12),
              _Stat(fmtNum(me.followers), 'Followers'),
              Container(width: 1, height: 32, color: Colors.white12),
              _Stat(fmtNum(me.following), 'Following'),
            ]))),
        ])),
      const SizedBox(height: 16),
      // Tab bar
      Container(decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: Color(0x0FFFFFFF)))),
        child: TabBar(controller: tabs, tabs: const [Tab(text: 'Projects'), Tab(text: 'Posts'), Tab(text: 'Saved')],
          labelStyle: GoogleFonts.dmSans(fontSize: 14, fontWeight: FontWeight.w600),
          unselectedLabelStyle: GoogleFonts.dmSans(fontSize: 14, fontWeight: FontWeight.w400),
          labelColor: AppColors.foreground, unselectedLabelColor: AppColors.muted,
          indicatorColor: AppColors.primary, indicatorWeight: 2,
          dividerColor: Colors.transparent)),
    ]);
  }
}

// ─── Score Ring ───────────────────────────────────────────────────────────────
class _ScoreRing extends StatelessWidget {
  final int score; final double size;
  const _ScoreRing({required this.score, required this.size});

  @override
  Widget build(BuildContext context) {
    return SizedBox(width: size, height: size,
      child: Stack(alignment: Alignment.center, children: [
        CustomPaint(size: Size(size, size), painter: _RingPainter(progress: score / 1000, color: scoreColor(score))),
        Column(mainAxisSize: MainAxisSize.min, children: [
          Text('$score', style: GoogleFonts.spaceGrotesk(color: AppColors.foreground, fontSize: 18, fontWeight: FontWeight.w700, height: 1)),
          Text('/ 1000', style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 9)),
        ]),
      ]));
  }
}

class _RingPainter extends CustomPainter {
  final double progress; final Color color;
  const _RingPainter({required this.progress, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final sw = 5.0;
    final r = (size.width - sw * 2) / 2;
    final center = Offset(size.width / 2, size.height / 2);
    final bg = Paint()..color = Colors.white.withOpacity(0.06)..style = PaintingStyle.stroke..strokeWidth = sw;
    canvas.drawCircle(center, r, bg);
    final fg = Paint()..color = color..style = PaintingStyle.stroke..strokeWidth = sw..strokeCap = StrokeCap.round;
    canvas.drawArc(Rect.fromCircle(center: center, radius: r), -math.pi / 2, 2 * math.pi * progress, false, fg);
  }

  @override
  bool shouldRepaint(_RingPainter old) => old.progress != progress || old.color != color;
}

class _Stat extends StatelessWidget {
  final String value; final String label;
  const _Stat(this.value, this.label);
  @override
  Widget build(BuildContext context) => Expanded(child: Column(children: [
    Text(value, style: GoogleFonts.spaceGrotesk(color: AppColors.foreground, fontSize: 19, fontWeight: FontWeight.w700)),
    Text(label, style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 11)),
  ]));
}

// ─── Portfolio Grid ───────────────────────────────────────────────────────────
class _PortfolioGrid extends StatelessWidget {
  final List<PortfolioItem> items;
  const _PortfolioGrid({required this.items});

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) return Center(child: Text('Nothing here yet', style: GoogleFonts.dmSans(color: AppColors.muted)));
    return GridView.builder(padding: const EdgeInsets.all(12),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 3, crossAxisSpacing: 3, mainAxisSpacing: 3),
      itemCount: items.length,
      itemBuilder: (_, i) => _PortfolioTile(item: items[i]));
  }
}

class _PortfolioTile extends StatefulWidget {
  final PortfolioItem item;
  const _PortfolioTile({required this.item});
  @override
  State<_PortfolioTile> createState() => _PortfolioTileState();
}

class _PortfolioTileState extends State<_PortfolioTile> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) => setState(() => _pressed = false),
      onTapCancel: () => setState(() => _pressed = false),
      child: AnimatedScale(scale: _pressed ? 0.96 : 1.0, duration: const Duration(milliseconds: 120),
        child: ClipRRect(borderRadius: BorderRadius.circular(6),
          child: Stack(fit: StackFit.expand, children: [
            CachedNetworkImage(imageUrl: widget.item.imageUrl, fit: BoxFit.cover,
                placeholder: (_, __) => Container(color: AppColors.card)),
            Positioned.fill(child: Container(decoration: const BoxDecoration(gradient: LinearGradient(
                colors: [Colors.transparent, Color(0xCC000000)], begin: Alignment.topCenter, end: Alignment.bottomCenter)))),
            Positioned(bottom: 6, left: 6, right: 6, child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
              Text(widget.item.title, style: GoogleFonts.dmSans(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w600), maxLines: 1, overflow: TextOverflow.ellipsis),
              Row(children: [
                const Icon(Icons.favorite_rounded, color: Color(0xFFF87171), size: 9),
                const SizedBox(width: 2),
                Text(fmtNum(widget.item.likes), style: GoogleFonts.dmSans(color: Colors.white70, fontSize: 9)),
              ]),
            ])),
          ]))));
  }
}
