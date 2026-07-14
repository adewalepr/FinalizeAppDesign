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
      // Search bar
      Padding(padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
        child: Container(decoration: BoxDecoration(color: Colors.white.withOpacity(0.05), borderRadius: BorderRadius.circular(14), border: Border.all(color: Colors.white12)),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          child: Row(children: [
            const Icon(Icons.search_rounded, color: AppColors.muted, size: 18),
            const SizedBox(width: 8),
            Expanded(child: Text('Search messages...', style: GoogleFonts.dmSans(color: const Color(0xFF7B7A9A), fontSize: 14))),
          ]))),
      Expanded(child: ListView.separated(
        itemCount: sampleThreads.length,
        separatorBuilder: (_, __) => Container(height: 1, color: Colors.white.withOpacity(0.04)),
        itemBuilder: (_, i) => _ThreadTile(thread: sampleThreads[i], onTap: () => setState(() => _open = sampleThreads[i])))),
    ]);
  }
}

class _ThreadTile extends StatelessWidget {
  final MessageThread thread; final VoidCallback onTap;
  const _ThreadTile({required this.thread, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(onTap: onTap,
      child: Padding(padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(children: [
          Stack(clipBehavior: Clip.none, children: [
            CircleAvatar(radius: 24, backgroundImage: CachedNetworkImageProvider(thread.participant.avatarUrl), backgroundColor: AppColors.card),
            if (thread.isOnline) Positioned(bottom: 0, right: 0,
              child: Container(width: 12, height: 12, decoration: BoxDecoration(color: AppColors.primary, shape: BoxShape.circle, border: Border.all(color: AppColors.background, width: 2)))),
          ]),
          const SizedBox(width: 12),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Expanded(child: Text(thread.participant.name, style: GoogleFonts.spaceGrotesk(color: AppColors.foreground, fontSize: 14,
                  fontWeight: thread.unread > 0 ? FontWeight.w700 : FontWeight.w500))),
              Text(thread.timeAgo, style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 11)),
            ]),
            const SizedBox(height: 2),
            Row(children: [
              Expanded(child: Text(thread.lastMessage, style: GoogleFonts.dmSans(color: thread.unread > 0 ? AppColors.foreground : AppColors.muted, fontSize: 13), maxLines: 1, overflow: TextOverflow.ellipsis)),
              if (thread.unread > 0)
                Container(margin: const EdgeInsets.only(left: 8), width: 20, height: 20, decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
                  child: Center(child: Text('${thread.unread}', style: GoogleFonts.dmSans(color: AppColors.background, fontSize: 11, fontWeight: FontWeight.w700)))),
            ]),
          ])),
        ])));
  }
}

// ─── Chat View ────────────────────────────────────────────────────────────────
class _ChatView extends StatefulWidget {
  final MessageThread thread; final VoidCallback onBack;
  const _ChatView({required this.thread, required this.onBack});
  @override
  State<_ChatView> createState() => _ChatViewState();
}

class _ChatViewState extends State<_ChatView> {
  final _ctrl = TextEditingController();
  final _scroll = ScrollController();
  late List<({String text, bool isMe})> _msgs;

  @override
  void initState() {
    super.initState();
    _msgs = [
      (text: "Hey! I saw your motion reel — absolutely incredible work", isMe: false),
      (text: "Thank you so much! I've been experimenting with fluid transitions for months.", isMe: true),
      (text: "The timing on those brand state transitions is perfect. How did you handle the easing?", isMe: false),
      (text: "Custom cubic bezier curves. I use a spreadsheet to preview easing before After Effects.", isMe: true),
      (text: "Genius. Would love to collaborate — working on a rebrand for a music label right now.", isMe: false),
      (text: "Send me the brief. Let's see what we can build.", isMe: true),
    ];
  }

  @override
  void dispose() { _ctrl.dispose(); _scroll.dispose(); super.dispose(); }

  void _send() {
    final t = _ctrl.text.trim(); if (t.isEmpty) return;
    setState(() { _msgs.add((text: t, isMe: true)); _ctrl.clear(); });
    Future.delayed(const Duration(milliseconds: 80), () {
      if (_scroll.hasClients) _scroll.animateTo(_scroll.position.maxScrollExtent, duration: const Duration(milliseconds: 200), curve: Curves.easeOut);
    });
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.thread.participant;
    return Column(children: [
      // Thread header
      Container(color: AppColors.card,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        child: Row(children: [
          IconButton(icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 17, color: AppColors.foreground), onPressed: widget.onBack),
          const SizedBox(width: 4),
          Stack(children: [
            CircleAvatar(radius: 18, backgroundImage: CachedNetworkImageProvider(p.avatarUrl)),
            if (widget.thread.isOnline) Positioned(bottom: 0, right: 0,
              child: Container(width: 10, height: 10, decoration: BoxDecoration(color: AppColors.primary, shape: BoxShape.circle, border: Border.all(color: AppColors.card, width: 1.5)))),
          ]),
          const SizedBox(width: 10),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(p.name, style: GoogleFonts.spaceGrotesk(color: AppColors.foreground, fontSize: 14, fontWeight: FontWeight.w600)),
            Text(widget.thread.isOnline ? 'Active now' : 'Last seen 2h ago', style: GoogleFonts.dmSans(color: widget.thread.isOnline ? AppColors.primary : AppColors.muted, fontSize: 11)),
          ])),
          IconButton(icon: const Icon(Icons.videocam_outlined, color: AppColors.muted, size: 22), onPressed: () {}),
          IconButton(icon: const Icon(Icons.more_horiz_rounded, color: AppColors.muted, size: 22), onPressed: () {}),
        ])),
      // Messages
      Expanded(child: ListView.builder(controller: _scroll, padding: const EdgeInsets.all(16),
        itemCount: _msgs.length,
        itemBuilder: (_, i) {
          final m = _msgs[i];
          return Align(alignment: m.isMe ? Alignment.centerRight : Alignment.centerLeft,
            child: Container(margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
              decoration: BoxDecoration(
                color: m.isMe ? AppColors.primary : AppColors.card,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(16), topRight: const Radius.circular(16),
                  bottomLeft: m.isMe ? const Radius.circular(16) : const Radius.circular(4),
                  bottomRight: m.isMe ? const Radius.circular(4) : const Radius.circular(16)),
                border: m.isMe ? null : Border.all(color: Colors.white.withOpacity(0.06))),
              child: Text(m.text, style: GoogleFonts.dmSans(color: m.isMe ? AppColors.background : AppColors.foreground, fontSize: 14, height: 1.4))));
        })),
      // Input bar
      Container(color: AppColors.card,
        padding: EdgeInsets.fromLTRB(12, 10, 12, MediaQuery.of(context).padding.bottom + 10),
        child: Row(children: [
          IconButton(icon: const Icon(Icons.attach_file_rounded, color: AppColors.muted, size: 20), onPressed: () {}),
          Expanded(child: Container(decoration: BoxDecoration(color: Colors.white.withOpacity(0.05), borderRadius: BorderRadius.circular(24), border: Border.all(color: Colors.white12)),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            child: TextField(controller: _ctrl, style: GoogleFonts.dmSans(color: AppColors.foreground, fontSize: 14),
              decoration: InputDecoration.collapsed(hintText: 'Type a message...', hintStyle: GoogleFonts.dmSans(color: const Color(0xFF7B7A9A))),
              onSubmitted: (_) => _send()))),
          const SizedBox(width: 8),
          GestureDetector(onTap: _send,
            child: Container(width: 42, height: 42, decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
              child: const Icon(Icons.send_rounded, color: Colors.white, size: 18))),
        ])),
    ]);
  }
}
