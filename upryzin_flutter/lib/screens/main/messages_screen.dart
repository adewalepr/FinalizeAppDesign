import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/models.dart';
import '../../theme/colors.dart';

class MessagesScreen extends StatefulWidget {
  const MessagesScreen({super.key});
  @override
  State<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends State<MessagesScreen> {
  MessageThread? _open;

  @override
  Widget build(BuildContext context) {
    if (_open != null) return _ChatView(thread: _open!, onBack: () => setState(() => _open = null));
    return Column(children: [
      Padding(padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
        child: TextField(style: GoogleFonts.dmSans(color: AppColors.foreground),
          decoration: const InputDecoration(hintText: 'Search messages...',
              prefixIcon: Icon(Icons.search_rounded, size: 20)))),
      Expanded(child: ListView.separated(
        itemCount: sampleThreads.length,
        separatorBuilder: (_, __) => const Divider(height: 1, color: AppColors.border),
        itemBuilder: (_, i) => _ThreadTile(thread: sampleThreads[i],
            onTap: () => setState(() => _open = sampleThreads[i])))),
    ]);
  }
}

class _ThreadTile extends StatelessWidget {
  final MessageThread thread; final VoidCallback onTap;
  const _ThreadTile({required this.thread, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return ListTile(contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      onTap: onTap,
      leading: Stack(clipBehavior: Clip.none, children: [
        CircleAvatar(radius: 26,
            backgroundImage: CachedNetworkImageProvider(thread.participant.avatarUrl),
            backgroundColor: AppColors.card),
        if (thread.isOnline) Positioned(bottom: 0, right: 0,
          child: Container(width: 12, height: 12,
              decoration: BoxDecoration(color: AppColors.primary, shape: BoxShape.circle,
                  border: Border.all(color: AppColors.background, width: 2)))),
      ]),
      title: Row(children: [
        Expanded(child: Text(thread.participant.name, style: GoogleFonts.spaceGrotesk(
            color: AppColors.foreground, fontSize: 15,
            fontWeight: thread.unread > 0 ? FontWeight.w600 : FontWeight.w500))),
        Text(thread.timeAgo, style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 11)),
      ]),
      subtitle: Row(children: [
        Expanded(child: Text(thread.lastMessage, style: GoogleFonts.dmSans(
            color: thread.unread > 0 ? AppColors.foreground : AppColors.muted, fontSize: 13),
            maxLines: 1, overflow: TextOverflow.ellipsis)),
        if (thread.unread > 0) Container(margin: const EdgeInsets.only(left: 8),
          width: 20, height: 20,
          decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
          child: Center(child: Text('${thread.unread}', style: GoogleFonts.dmSans(
              color: AppColors.background, fontSize: 11, fontWeight: FontWeight.w700)))),
      ]),
    );
  }
}

class _ChatView extends StatefulWidget {
  final MessageThread thread; final VoidCallback onBack;
  const _ChatView({required this.thread, required this.onBack});
  @override
  State<_ChatView> createState() => _ChatViewState();
}

class _ChatViewState extends State<_ChatView> {
  final _ctrl = TextEditingController();
  final _scroll = ScrollController();
  final _msgs = [
    (text: 'Hey! Loved your recent work on the fashion editorial.', isMe: false),
    (text: 'Thank you so much! Really appreciated the challenge of shooting in natural light only.', isMe: true),
    (text: 'Can we schedule a call to discuss the project?', isMe: false),
  ];

  @override
  void dispose() { _ctrl.dispose(); _scroll.dispose(); super.dispose(); }

  void _send() {
    final t = _ctrl.text.trim(); if (t.isEmpty) return;
    setState(() { _msgs.add((text: t, isMe: true)); _ctrl.clear(); });
    Future.delayed(const Duration(milliseconds: 100), () =>
      _scroll.animateTo(_scroll.position.maxScrollExtent,
          duration: const Duration(milliseconds: 200), curve: Curves.easeOut));
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.thread.participant;
    return Column(children: [
      Container(color: AppColors.card, padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(children: [
          GestureDetector(onTap: widget.onBack,
              child: const Icon(Icons.arrow_back_ios_new_rounded, size: 18, color: AppColors.foreground)),
          const SizedBox(width: 12),
          CircleAvatar(radius: 18, backgroundImage: CachedNetworkImageProvider(p.avatarUrl)),
          const SizedBox(width: 10),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(p.name, style: GoogleFonts.spaceGrotesk(
                color: AppColors.foreground, fontSize: 15, fontWeight: FontWeight.w600)),
            Text(widget.thread.isOnline ? 'Online' : p.role,
                style: GoogleFonts.dmSans(
                    color: widget.thread.isOnline ? AppColors.primary : AppColors.muted, fontSize: 12)),
          ])),
          const Icon(Icons.videocam_outlined, color: AppColors.muted, size: 22),
        ])),
      Expanded(child: ListView.builder(controller: _scroll, padding: const EdgeInsets.all(16),
        itemCount: _msgs.length,
        itemBuilder: (_, i) {
          final m = _msgs[i];
          return Align(alignment: m.isMe ? Alignment.centerRight : Alignment.centerLeft,
            child: Container(margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.72),
              decoration: BoxDecoration(
                color: m.isMe ? AppColors.primary : AppColors.card,
                borderRadius: BorderRadius.circular(16).copyWith(
                    bottomRight: m.isMe ? const Radius.circular(4) : const Radius.circular(16),
                    bottomLeft: m.isMe ? const Radius.circular(16) : const Radius.circular(4)),
                border: m.isMe ? null : Border.all(color: AppColors.border)),
              child: Text(m.text, style: GoogleFonts.dmSans(
                  color: m.isMe ? AppColors.background : AppColors.foreground, fontSize: 14))));
        })),
      Container(color: AppColors.card, padding: const EdgeInsets.fromLTRB(16, 10, 16, 28),
        child: Row(children: [
          Expanded(child: TextField(controller: _ctrl,
            style: GoogleFonts.dmSans(color: AppColors.foreground),
            decoration: const InputDecoration(hintText: 'Message...',
                contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 10)),
            onSubmitted: (_) => _send())),
          const SizedBox(width: 10),
          GestureDetector(onTap: _send, child: Container(width: 44, height: 44,
              decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
              child: const Icon(Icons.send_rounded, color: AppColors.background, size: 18))),
        ])),
    ]);
  }
}
