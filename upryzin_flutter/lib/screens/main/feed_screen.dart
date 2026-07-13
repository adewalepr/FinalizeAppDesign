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
  void initState() { super.initState(); _posts = samplePosts; }

  @override
  Widget build(BuildContext context) {
    return ListView(padding: EdgeInsets.zero, children: [
      _StoriesRow(users: sampleUsers),
      const Divider(height: 1, color: AppColors.border),
      ..._posts.map((p) => _PostCard(post: p,
        onLike: () => setState(() => p.isLiked = !p.isLiked),
        onBookmark: () => setState(() => p.isBookmarked = !p.isBookmarked))),
      const SizedBox(height: 20),
    ]);
  }
}

class _StoriesRow extends StatelessWidget {
  final List<UserModel> users;
  const _StoriesRow({required this.users});

  @override
  Widget build(BuildContext context) {
    return SizedBox(height: 94,
      child: ListView.builder(scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        itemCount: users.length + 1,
        itemBuilder: (_, i) {
          if (i == 0) return Padding(padding: const EdgeInsets.only(right: 14),
            child: Column(children: [
              Container(width: 56, height: 56,
                decoration: BoxDecoration(shape: BoxShape.circle, color: AppColors.card,
                    border: Border.all(color: AppColors.primary.withOpacity(0.3), width: 1.5)),
                child: const Icon(Icons.add_rounded, color: AppColors.primary, size: 24)),
              const SizedBox(height: 4),
              Text('Your story', style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 10)),
            ]));
          final u = users[i - 1];
          return Padding(padding: const EdgeInsets.only(right: 14),
            child: Column(children: [
              Container(width: 56, height: 56, padding: const EdgeInsets.all(2),
                decoration: BoxDecoration(shape: BoxShape.circle,
                    gradient: LinearGradient(colors: [AppColors.primary, AppColors.primary.withOpacity(0.4)],
                        begin: Alignment.topLeft, end: Alignment.bottomRight)),
                child: CircleAvatar(backgroundImage: CachedNetworkImageProvider(u.avatarUrl),
                    backgroundColor: AppColors.card)),
              const SizedBox(height: 4),
              SizedBox(width: 56, child: Text(u.name.split(' ').first,
                  style: GoogleFonts.dmSans(color: AppColors.foreground, fontSize: 10),
                  textAlign: TextAlign.center, maxLines: 1, overflow: TextOverflow.ellipsis)),
            ]));
        }));
  }
}

class _PostCard extends StatelessWidget {
  final PostModel post;
  final VoidCallback onLike, onBookmark;
  const _PostCard({required this.post, required this.onLike, required this.onBookmark});

  String _fmt(int n) => n >= 1000 ? '${(n / 1000).toStringAsFixed(1)}k' : '$n';

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Padding(padding: const EdgeInsets.fromLTRB(16, 16, 16, 10),
        child: Row(children: [
          CircleAvatar(radius: 20,
              backgroundImage: CachedNetworkImageProvider(post.author.avatarUrl),
              backgroundColor: AppColors.card),
          const SizedBox(width: 10),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(post.author.name, style: GoogleFonts.spaceGrotesk(
                color: AppColors.foreground, fontSize: 14, fontWeight: FontWeight.w600)),
            Text('${post.author.role} · ${post.timeAgo}',
                style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 12)),
          ])),
          Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.primary.withOpacity(0.2))),
            child: Text('Follow', style: GoogleFonts.dmSans(
                color: AppColors.primary, fontSize: 12, fontWeight: FontWeight.w600))),
        ])),
      AspectRatio(aspectRatio: 1, child: CachedNetworkImage(imageUrl: post.imageUrl,
          fit: BoxFit.cover,
          placeholder: (_, __) => Container(color: AppColors.card,
              child: const Center(child: CircularProgressIndicator(
                  color: AppColors.primary, strokeWidth: 2))),
          errorWidget: (_, __, ___) => Container(color: AppColors.card))),
      Padding(padding: const EdgeInsets.fromLTRB(16, 10, 16, 0),
        child: Row(children: [
          _Btn(post.isLiked ? Icons.favorite_rounded : Icons.favorite_border_rounded,
              _fmt(post.likes + (post.isLiked ? 1 : 0)),
              post.isLiked ? const Color(0xFFEF4444) : AppColors.muted, onLike),
          const SizedBox(width: 18),
          _Btn(Icons.chat_bubble_outline_rounded, _fmt(post.comments), AppColors.muted, () {}),
          const SizedBox(width: 18),
          _Btn(Icons.send_rounded, 'Share', AppColors.muted, () {}),
          const Spacer(),
          _Btn(post.isBookmarked ? Icons.bookmark_rounded : Icons.bookmark_border_rounded,
              '', post.isBookmarked ? AppColors.primary : AppColors.muted, onBookmark),
        ])),
      Padding(padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
        child: RichText(text: TextSpan(
            style: GoogleFonts.dmSans(color: AppColors.foreground, fontSize: 14),
            children: [
              TextSpan(text: '${post.author.name.split(' ').first} ',
                  style: const TextStyle(fontWeight: FontWeight.w600)),
              TextSpan(text: post.caption),
            ]))),
      if (post.tags.isNotEmpty)
        Padding(padding: const EdgeInsets.only(left: 16, bottom: 4),
          child: Wrap(spacing: 6, children: post.tags.map((t) =>
            Text('#$t', style: GoogleFonts.dmSans(color: AppColors.primary, fontSize: 13))).toList())),
      const Padding(padding: EdgeInsets.only(top: 12),
          child: Divider(height: 1, color: AppColors.border)),
    ]);
  }
}

class _Btn extends StatelessWidget {
  final IconData icon; final String label; final Color color; final VoidCallback onTap;
  const _Btn(this.icon, this.label, this.color, this.onTap);
  @override
  Widget build(BuildContext context) => GestureDetector(onTap: onTap,
    behavior: HitTestBehavior.opaque,
    child: Row(children: [
      Icon(icon, color: color, size: 22),
      if (label.isNotEmpty) ...[const SizedBox(width: 4),
        Text(label, style: GoogleFonts.dmSans(color: color, fontSize: 13))],
    ]));
}
