import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/models.dart';
import '../../theme/colors.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});
  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  String _cat = 'All';
  final Set<String> _followed = {};
  static const _cats = ['All', 'Design', 'Photography', 'Motion', 'Music', 'Dev', 'Fashion'];

  @override
  Widget build(BuildContext context) {
    return ListView(padding: const EdgeInsets.only(bottom: 24), children: [
      // Category pills
      Padding(padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
        child: SizedBox(height: 38, child: ListView.separated(scrollDirection: Axis.horizontal,
          itemCount: _cats.length, separatorBuilder: (_, __) => const SizedBox(width: 8),
          itemBuilder: (_, i) {
            final active = _cats[i] == _cat;
            return GestureDetector(onTap: () => setState(() => _cat = _cats[i]),
              child: AnimatedContainer(duration: const Duration(milliseconds: 150),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: active ? AppColors.primary : Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: active ? AppColors.primary : Colors.white.withOpacity(0.06))),
                child: Text(_cats[i], style: GoogleFonts.dmSans(color: active ? Colors.white : AppColors.muted, fontSize: 13, fontWeight: active ? FontWeight.w600 : FontWeight.w400))));
          }))),
      // Creator grid — 3/4 aspect ratio cards like web
      Padding(padding: const EdgeInsets.symmetric(horizontal: 16),
        child: GridView.builder(shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, crossAxisSpacing: 10, mainAxisSpacing: 10, childAspectRatio: 3 / 4),
          itemCount: sampleCreators.length,
          itemBuilder: (_, i) => _CreatorCard(creator: sampleCreators[i], followed: _followed.contains(sampleCreators[i].username),
            onFollow: () => setState(() {
              final u = sampleCreators[i].username;
              if (_followed.contains(u)) _followed.remove(u); else _followed.add(u);
            })))),
    ]);
  }
}

class _CreatorCard extends StatelessWidget {
  final UserModel creator;
  final bool followed;
  final VoidCallback onFollow;
  const _CreatorCard({required this.creator, required this.followed, required this.onFollow});

  @override
  Widget build(BuildContext context) {
    final coverUrl = creator.portfolioItems.isNotEmpty ? creator.portfolioItems.first.imageUrl : '';
    return ClipRRect(borderRadius: BorderRadius.circular(16),
      child: Stack(fit: StackFit.expand, children: [
        // Cover image
        CachedNetworkImage(imageUrl: coverUrl, fit: BoxFit.cover,
            placeholder: (_, __) => Container(color: AppColors.card)),
        // Gradient overlay
        const DecoratedBox(decoration: BoxDecoration(gradient: LinearGradient(
            colors: [Colors.transparent, Color(0xE6000000)], begin: Alignment.topCenter, end: Alignment.bottomCenter))),
        // Border
        DecoratedBox(decoration: BoxDecoration(borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.white.withOpacity(0.06)))),
        // Content
        Positioned(bottom: 0, left: 0, right: 0,
          child: Padding(padding: const EdgeInsets.all(12),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
              Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(creator.name, style: GoogleFonts.spaceGrotesk(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w700), maxLines: 1, overflow: TextOverflow.ellipsis),
                  Text(creator.role, style: GoogleFonts.dmSans(color: Colors.white60, fontSize: 11), maxLines: 1, overflow: TextOverflow.ellipsis),
                ])),
                const SizedBox(width: 8),
                Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                  Container(padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                    decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(20)),
                    child: Row(mainAxisSize: MainAxisSize.min, children: [
                      const Icon(Icons.bolt_rounded, color: AppColors.primary, size: 10),
                      const SizedBox(width: 2),
                      Text('${creator.creditsScore}', style: GoogleFonts.dmSans(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700)),
                    ])),
                  const SizedBox(height: 6),
                  GestureDetector(onTap: onFollow,
                    child: AnimatedContainer(duration: const Duration(milliseconds: 150),
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(color: followed ? Colors.white30 : AppColors.primary, borderRadius: BorderRadius.circular(8)),
                      child: Text(followed ? '✓' : 'Follow', style: GoogleFonts.dmSans(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700)))),
                ]),
              ]),
            ])),
        ),
      ]));
  }
}
