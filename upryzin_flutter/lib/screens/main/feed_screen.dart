import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/models.dart';
import '../../theme/colors.dart';

class FeedScreen extends StatefulWidget {
  const FeedScreen({super.key});
  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  late List<PostModel> _posts;
  @override
  void initState() { super.initState(); _posts = List.from(samplePosts); }

  @override
  Widget build(BuildContext context) {
    return ListView(padding: EdgeInsets.zero, children: [
      _StoriesRow(),
      Container(height: 1, color: Colors.white.withOpacity(0.05)),
      ..._posts.map((p) => _PostCard(post: p,
        onLike: () => setState(() => p.isLiked = !p.isLiked),
        onBookmark: () => setState(() => p.isBookmarked = !p.isBookmarked))),
      const SizedBox(height: 20),
    ]);
  }
}

// ─── Stories ──────────────────────────────────────────────────────────────────
class _StoriesRow extends StatefulWidget {
  @override
  State<_StoriesRow> createState() => _StoriesRowState();
}

class _StoriesRowState extends State<_StoriesRow> {
  final Set<int> _seen = {};

  @override
  Widget build(BuildContext context) {
    return SizedBox(height: 96,
      child: ListView.builder(scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        itemCount: storyUsers.length + 1,
        itemBuilder: (_, i) {
          if (i == 0) return Padding(padding: const EdgeInsets.only(right: 16),
            child: Column(children: [
              Container(width: 56, height: 56, decoration: BoxDecoration(shape: BoxShape.circle, color: AppColors.card, border: Border.all(color: AppColors.primary.withOpacity(0.3), width: 1.5)),
                child: const Icon(Icons.add_rounded, color: AppColors.primary, size: 22)),
              const SizedBox(height: 5),
              Text('Your story', style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 10)),
            ]));
          final u = storyUsers[i - 1];
          final seen = _seen.contains(i);
          return GestureDetector(onTap: () => setState(() => _seen.add(i)),
            child: Padding(padding: const EdgeInsets.only(right: 14),
              child: Column(children: [
                Container(width: 56, height: 56, padding: const EdgeInsets.all(2.5),
                  decoration: BoxDecoration(shape: BoxShape.circle,
                    gradient: seen ? null : const LinearGradient(colors: [AppColors.primary, Color(0xFFEC4899), Color(0xFFF59E0B)], begin: Alignment.topLeft, end: Alignment.bottomRight),
                    color: seen ? const Color(0xFF1A3540) : null),
                  child: Container(decoration: const BoxDecoration(shape: BoxShape.circle, color: AppColors.card), padding: const EdgeInsets.all(2),
                    child: CircleAvatar(backgroundImage: CachedNetworkImageProvider(u.avatarUrl), backgroundColor: AppColors.card))),
                const SizedBox(height: 5),
                SizedBox(width: 56, child: Text(u.name.split(' ').first, style: GoogleFonts.dmSans(color: AppColors.foreground, fontSize: 10), textAlign: TextAlign.center, maxLines: 1, overflow: TextOverflow.ellipsis)),
              ])));
        }));
  }
}

// ─── Post Card ────────────────────────────────────────────────────────────────
class _PostCard extends StatelessWidget {
  final PostModel post;
  final VoidCallback onLike, onBookmark;
  const _PostCard({required this.post, required this.onLike, required this.onBookmark});

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      // Header
      Padding(padding: const EdgeInsets.fromLTRB(16, 16, 12, 10),
        child: Row(children: [
          CircleAvatar(radius: 20, backgroundImage: CachedNetworkImageProvider(post.user.avatarUrl), backgroundColor: AppColors.card),
          const SizedBox(width: 10),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Text(post.user.name, style: GoogleFonts.spaceGrotesk(color: AppColors.foreground, fontSize: 14, fontWeight: FontWeight.w600)),
              if (post.user.verified) ...[const SizedBox(width: 4), const Icon(Icons.verified_rounded, color: AppColors.primary, size: 13)],
            ]),
            Text('${post.user.username} · ${post.timeAgo}', style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 12)),
          ])),
          Container(padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
            decoration: BoxDecoration(color: const Color(0xFF011A12), borderRadius: BorderRadius.circular(8), border: Border.all(color: AppColors.primary.withOpacity(0.2))),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              const Icon(Icons.bolt_rounded, color: AppColors.primary, size: 11),
              const SizedBox(width: 2),
              Text('${post.user.score}', style: GoogleFonts.dmSans(color: const Color(0xFF3DDEAA), fontSize: 11, fontWeight: FontWeight.w700)),
            ])),
          const SizedBox(width: 6),
          const Icon(Icons.more_horiz_rounded, color: AppColors.muted, size: 20),
        ])),
      // Caption + tags
      Padding(padding: const EdgeInsets.fromLTRB(16, 0, 16, 10),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(post.caption, style: GoogleFonts.dmSans(color: const Color(0xFFC8E8E8), fontSize: 14, height: 1.45)),
          if (post.tags.isNotEmpty) ...[
            const SizedBox(height: 6),
            Wrap(spacing: 8, children: post.tags.map((t) => Text(t, style: GoogleFonts.dmSans(color: AppColors.primary, fontSize: 13))).toList()),
          ],
        ])),
      // Media
      if (post.mediaUrl != null)
        Padding(padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
          child: ClipRRect(borderRadius: BorderRadius.circular(14),
            child: Stack(children: [
              AspectRatio(aspectRatio: post.type == PostType.reel ? 4 / 5 : 16 / 9,
                child: CachedNetworkImage(imageUrl: post.mediaUrl!, fit: BoxFit.cover,
                    placeholder: (_, __) => Container(color: AppColors.card))),
              if (post.type == PostType.reel) ...[
                Positioned.fill(child: Container(decoration: const BoxDecoration(gradient: LinearGradient(
                    colors: [Colors.transparent, Color(0x99000000)], begin: Alignment.topCenter, end: Alignment.bottomCenter)))),
                const Positioned.fill(child: Center(child: _PlayButton())),
                Positioned(bottom: 10, left: 12,
                  child: Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3), decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(6)),
                    child: Text('REEL · 1:32', style: GoogleFonts.dmSans(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600)))),
              ],
            ]))),
      // Action bar
      Padding(padding: const EdgeInsets.fromLTRB(6, 4, 6, 0),
        child: Row(children: [
          _ActionBtn(icon: post.isLiked ? Icons.favorite_rounded : Icons.favorite_border_rounded,
            label: fmtNum(post.likes + (post.isLiked ? 1 : 0)),
            color: post.isLiked ? const Color(0xFFF87171) : AppColors.muted, onTap: onLike),
          _ActionBtn(icon: Icons.chat_bubble_outline_rounded, label: fmtNum(post.comments), color: AppColors.muted, onTap: () {}),
          _ActionBtn(icon: Icons.ios_share_rounded, label: fmtNum(post.shares), color: AppColors.muted, onTap: () {}),
          const Spacer(),
          _ActionBtn(icon: post.isBookmarked ? Icons.bookmark_rounded : Icons.bookmark_border_rounded,
            label: '', color: post.isBookmarked ? const Color(0xFFF59E0B) : AppColors.muted, onTap: onBookmark),
        ])),
      Container(height: 1, margin: const EdgeInsets.only(top: 8), color: Colors.white.withOpacity(0.04)),
    ]);
  }
}

class _PlayButton extends StatelessWidget {
  const _PlayButton();
  @override
  Widget build(BuildContext context) => Container(width: 52, height: 52,
    decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withOpacity(0.15), border: Border.all(color: Colors.white30)),
    child: const Icon(Icons.play_arrow_rounded, color: Colors.white, size: 28));
}

class _ActionBtn extends StatelessWidget {
  final IconData icon; final String label; final Color color; final VoidCallback onTap;
  const _ActionBtn({required this.icon, required this.label, required this.color, required this.onTap});
  @override
  Widget build(BuildContext context) => GestureDetector(onTap: onTap, behavior: HitTestBehavior.opaque,
    child: Padding(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
      child: Row(children: [
        Icon(icon, color: color, size: 20),
        if (label.isNotEmpty) ...[const SizedBox(width: 4), Text(label, style: GoogleFonts.dmSans(color: color, fontSize: 13))],
      ])));
}
