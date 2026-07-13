import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/models.dart';
import '../../theme/colors.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final u = sampleUsers[0];
    return ListView(padding: EdgeInsets.zero, children: [
      _Header(user: u),
      _CreditsCard(score: u.creditsScore),
      const SizedBox(height: 20),
      _StatsRow(user: u),
      const SizedBox(height: 20),
      Padding(padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Text('Portfolio', style: GoogleFonts.spaceGrotesk(
            color: AppColors.foreground, fontSize: 17, fontWeight: FontWeight.w700))),
      const SizedBox(height: 12),
      GridView.builder(shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3, crossAxisSpacing: 3, mainAxisSpacing: 3),
        itemCount: u.portfolioUrls.length,
        itemBuilder: (_, i) => CachedNetworkImage(imageUrl: u.portfolioUrls[i],
            fit: BoxFit.cover,
            placeholder: (_, __) => Container(color: AppColors.card))),
      const SizedBox(height: 32),
    ]);
  }
}

class _Header extends StatelessWidget {
  final UserModel user;
  const _Header({required this.user});

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Container(height: 140,
        decoration: const BoxDecoration(gradient: LinearGradient(
            colors: [Color(0xFF0C3028), Color(0xFF07191E)],
            begin: Alignment.topLeft, end: Alignment.bottomRight))),
      Padding(padding: const EdgeInsets.fromLTRB(20, 0, 20, 0),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
            Transform.translate(offset: const Offset(0, -34),
              child: Container(padding: const EdgeInsets.all(3),
                decoration: const BoxDecoration(shape: BoxShape.circle, color: AppColors.background),
                child: CircleAvatar(radius: 40,
                    backgroundImage: CachedNetworkImageProvider(user.avatarUrl),
                    backgroundColor: AppColors.card))),
            const Spacer(),
            Transform.translate(offset: const Offset(0, -8),
              child: Container(padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(color: AppColors.card,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColors.border)),
                child: Text('Edit Profile', style: GoogleFonts.dmSans(
                    color: AppColors.foreground, fontSize: 13, fontWeight: FontWeight.w500)))),
          ]),
          Transform.translate(offset: const Offset(0, -20),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                Text(user.name, style: GoogleFonts.spaceGrotesk(
                    color: AppColors.foreground, fontSize: 22, fontWeight: FontWeight.w700)),
                const SizedBox(width: 6),
                const Icon(Icons.verified_rounded, color: AppColors.primary, size: 18),
              ]),
              Text('@${user.username}',
                  style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 14)),
              const SizedBox(height: 6),
              Row(children: [
                const Icon(Icons.work_outline_rounded, color: AppColors.primary, size: 14),
                const SizedBox(width: 4),
                Text(user.role, style: GoogleFonts.dmSans(color: AppColors.primary,
                    fontSize: 13, fontWeight: FontWeight.w500)),
                const SizedBox(width: 12),
                const Icon(Icons.location_on_outlined, color: AppColors.muted, size: 14),
                const SizedBox(width: 4),
                Text(user.location, style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 13)),
              ]),
              const SizedBox(height: 10),
              Text(user.bio, style: GoogleFonts.dmSans(
                  color: AppColors.foreground.withOpacity(0.8), fontSize: 14, height: 1.5)),
            ])),
        ])),
    ]);
  }
}

class _CreditsCard extends StatelessWidget {
  final int score;
  const _CreditsCard({required this.score});

  Color get _color => score >= 800 ? AppColors.primary : score >= 600 ? AppColors.amber : AppColors.muted;
  String get _tier => score >= 900 ? 'Elite' : score >= 800 ? 'Pro' : score >= 600 ? 'Rising' : 'Starter';

  @override
  Widget build(BuildContext context) {
    return Container(margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: AppColors.card,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.border)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          const Icon(Icons.bolt_rounded, color: AppColors.amber, size: 18),
          const SizedBox(width: 6),
          Text('Upryzin Credits', style: GoogleFonts.spaceGrotesk(
              color: AppColors.foreground, fontSize: 14, fontWeight: FontWeight.w600)),
          const Spacer(),
          Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(color: _color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: _color.withOpacity(0.3))),
            child: Text(_tier, style: GoogleFonts.dmSans(color: _color,
                fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 0.5))),
        ]),
        const SizedBox(height: 10),
        Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
          Text('$score', style: GoogleFonts.spaceGrotesk(
              color: _color, fontSize: 36, fontWeight: FontWeight.w700)),
          Padding(padding: const EdgeInsets.only(bottom: 6, left: 4),
            child: Text('/ 1000', style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 14))),
        ]),
        const SizedBox(height: 8),
        ClipRRect(borderRadius: BorderRadius.circular(6),
          child: LinearProgressIndicator(value: score / 1000,
              backgroundColor: AppColors.cardDeep, color: _color, minHeight: 6)),
        const SizedBox(height: 6),
        Text('${1000 - score} credits to next tier',
            style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 12)),
      ]));
  }
}

class _StatsRow extends StatelessWidget {
  final UserModel user;
  const _StatsRow({required this.user});
  String _fmt(int n) => n >= 1000 ? '${(n / 1000).toStringAsFixed(1)}k' : '$n';

  @override
  Widget build(BuildContext context) {
    return Padding(padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(children: [
        _Stat(_fmt(user.posts), 'Posts'),
        Container(width: 1, height: 36, color: AppColors.border),
        _Stat(_fmt(user.followers), 'Followers'),
        Container(width: 1, height: 36, color: AppColors.border),
        _Stat(_fmt(user.following), 'Following'),
      ]));
  }
}

class _Stat extends StatelessWidget {
  final String value; final String label;
  const _Stat(this.value, this.label);
  @override
  Widget build(BuildContext context) => Expanded(child: Column(children: [
    Text(value, style: GoogleFonts.spaceGrotesk(
        color: AppColors.foreground, fontSize: 20, fontWeight: FontWeight.w700)),
    Text(label, style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 12)),
  ]));
}
