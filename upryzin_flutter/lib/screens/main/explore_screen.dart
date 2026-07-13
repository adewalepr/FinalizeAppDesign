import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/models.dart';
import '../../theme/colors.dart';

const _cats = [
  ('Photography', Icons.camera_alt_outlined), ('Film', Icons.movie_outlined),
  ('Design', Icons.brush_outlined), ('Music', Icons.music_note_outlined),
  ('Animation', Icons.animation_outlined), ('Fashion', Icons.checkroom_outlined),
];

class ExploreScreen extends StatelessWidget {
  const ExploreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(padding: const EdgeInsets.all(16), children: [
      TextField(style: GoogleFonts.dmSans(color: AppColors.foreground),
        decoration: InputDecoration(hintText: 'Search creators, work, opportunities...',
          prefixIcon: const Icon(Icons.search_rounded, size: 20),
          suffixIcon: IconButton(icon: const Icon(Icons.tune_rounded, size: 20), onPressed: () {}))),
      const SizedBox(height: 24),
      Text('Trending Creators', style: GoogleFonts.spaceGrotesk(
          color: AppColors.foreground, fontSize: 17, fontWeight: FontWeight.w700)),
      const SizedBox(height: 14),
      SizedBox(height: 120, child: ListView.separated(scrollDirection: Axis.horizontal,
        itemCount: sampleUsers.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (_, i) {
          final u = sampleUsers[i];
          return Container(width: 100,
            decoration: BoxDecoration(color: AppColors.card,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.border)),
            padding: const EdgeInsets.all(10),
            child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
              CircleAvatar(radius: 26,
                  backgroundImage: CachedNetworkImageProvider(u.avatarUrl),
                  backgroundColor: AppColors.cardDeep),
              const SizedBox(height: 6),
              Text(u.name.split(' ').first, style: GoogleFonts.dmSans(
                  color: AppColors.foreground, fontSize: 12, fontWeight: FontWeight.w600),
                  maxLines: 1, overflow: TextOverflow.ellipsis),
              Text(u.role.split(' ').last, style: GoogleFonts.dmSans(
                  color: AppColors.muted, fontSize: 10), maxLines: 1, overflow: TextOverflow.ellipsis),
            ]));
        })),
      const SizedBox(height: 28),
      Text('Browse by Category', style: GoogleFonts.spaceGrotesk(
          color: AppColors.foreground, fontSize: 17, fontWeight: FontWeight.w700)),
      const SizedBox(height: 14),
      GridView.count(crossAxisCount: 2, shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        crossAxisSpacing: 10, mainAxisSpacing: 10, childAspectRatio: 2.4,
        children: _cats.map((c) => Container(
          decoration: BoxDecoration(color: AppColors.card,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border)),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          child: Row(children: [
            Container(width: 32, height: 32,
              decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8)),
              child: Icon(c.$2, color: AppColors.primary, size: 17)),
            const SizedBox(width: 10),
            Text(c.$1, style: GoogleFonts.dmSans(color: AppColors.foreground,
                fontSize: 13, fontWeight: FontWeight.w500)),
          ]))).toList()),
      const SizedBox(height: 28),
      Text('Featured Work', style: GoogleFonts.spaceGrotesk(
          color: AppColors.foreground, fontSize: 17, fontWeight: FontWeight.w700)),
      const SizedBox(height: 14),
      GridView.count(crossAxisCount: 2, shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        crossAxisSpacing: 8, mainAxisSpacing: 8,
        children: samplePosts.map((p) => ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Stack(fit: StackFit.expand, children: [
            CachedNetworkImage(imageUrl: p.imageUrl, fit: BoxFit.cover,
                placeholder: (_, __) => Container(color: AppColors.card)),
            Positioned(bottom: 0, left: 0, right: 0,
              child: Container(padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(gradient: LinearGradient(
                    colors: [Colors.black.withOpacity(0.75), Colors.transparent],
                    begin: Alignment.bottomCenter, end: Alignment.topCenter)),
                child: Text(p.author.name, style: GoogleFonts.dmSans(
                    color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600)))),
          ]))).toList()),
      const SizedBox(height: 24),
    ]);
  }
}
