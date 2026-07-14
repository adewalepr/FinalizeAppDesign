import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../theme/colors.dart';
import '../../widgets/logo_mark.dart';
import 'feed_screen.dart';
import 'explore_screen.dart';
import 'opportunities_screen.dart';
import 'messages_screen.dart';
import 'profile_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _tab = 0;

  static const _screens = [
    FeedScreen(), ExploreScreen(), SizedBox.shrink(),
    OpportunitiesScreen(), ProfileScreen(),
  ];

  void _onTap(int i) {
    if (i == 2) { _showCreate(); return; }
    setState(() => _tab = i);
  }

  void _showCreate() {
    showModalBottomSheet(context: context, backgroundColor: Colors.transparent,
        isScrollControlled: true, builder: (_) => _CreateSheet());
  }

  bool get _showAppBar => _tab != 4;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: _showAppBar ? AppBar(
        backgroundColor: AppColors.background.withOpacity(0.96),
        surfaceTintColor: Colors.transparent, elevation: 0,
        titleSpacing: 16, title: const UpryzinLogo(),
        actions: [
          IconButton(icon: const Icon(Icons.search_rounded, color: AppColors.muted), onPressed: () {}),
          Stack(alignment: Alignment.topRight, children: [
            IconButton(icon: const Icon(Icons.chat_bubble_outline_rounded, color: AppColors.muted), onPressed: () => setState(() => _tab = 3)),
            Positioned(top: 12, right: 12, child: Container(width: 7, height: 7, decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle))),
          ]),
          Stack(alignment: Alignment.topRight, children: [
            IconButton(icon: const Icon(Icons.notifications_none_rounded, color: AppColors.muted), onPressed: () {}),
            Positioned(top: 12, right: 12, child: Container(width: 7, height: 7, decoration: BoxDecoration(color: Colors.red.shade500, shape: BoxShape.circle))),
          ]),
          const SizedBox(width: 4),
        ],
      ) : null,
      body: IndexedStack(index: _tab == 2 ? 0 : _tab, children: _screens),
      bottomNavigationBar: _BottomBar(tab: _tab, onTap: _onTap),
    );
  }
}

class _BottomBar extends StatelessWidget {
  final int tab;
  final ValueChanged<int> onTap;
  const _BottomBar({required this.tab, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xF2051418),
        border: Border(top: BorderSide(color: Color(0x0FFFFFFF))),
      ),
      child: SafeArea(top: false, child: SizedBox(height: 62,
        child: Row(children: [
          _NavItem(icon: Icons.home_rounded, label: 'Home', active: tab == 0, onTap: () => onTap(0)),
          _NavItem(icon: Icons.explore_rounded, label: 'Explore', active: tab == 1, onTap: () => onTap(1)),
          // Raised create
          Expanded(child: GestureDetector(onTap: () => onTap(2),
            child: Center(child: Container(
              width: 50, height: 50,
              decoration: BoxDecoration(
                color: AppColors.primary, borderRadius: BorderRadius.circular(15),
                boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.4), blurRadius: 14, offset: const Offset(0, 4))],
              ),
              child: const Icon(Icons.add_rounded, color: Colors.white, size: 26),
            )))),
          _NavItem(icon: Icons.work_outline_rounded, label: 'Jobs', active: tab == 3, onTap: () => onTap(3)),
          _NavItem(icon: Icons.person_outline_rounded, label: 'Profile', active: tab == 4, onTap: () => onTap(4)),
        ]),
      )),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon; final String label; final bool active; final VoidCallback onTap;
  const _NavItem({required this.icon, required this.label, required this.active, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final color = active ? AppColors.primary : const Color(0xFF5A5A7A);
    return Expanded(child: GestureDetector(onTap: onTap, behavior: HitTestBehavior.opaque,
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Stack(clipBehavior: Clip.none, children: [
          Icon(icon, color: color, size: 23),
          if (active) Positioned(bottom: -5, left: 0, right: 0,
            child: Center(child: Container(width: 4, height: 4, decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle)))),
        ]),
        const SizedBox(height: 5),
        Text(label, style: GoogleFonts.dmSans(color: color, fontSize: 10, fontWeight: active ? FontWeight.w600 : FontWeight.w400)),
      ]),
    ));
  }
}

// ─── Create Sheet ─────────────────────────────────────────────────────────────
class _CreateSheet extends StatefulWidget {
  @override
  State<_CreateSheet> createState() => _CreateSheetState();
}

class _CreateSheetState extends State<_CreateSheet> {
  int _type = 0;
  final _caption = TextEditingController();
  static const _types = [
    (Icons.image_outlined, 'Post'),
    (Icons.play_circle_outline_rounded, 'Reel'),
    (Icons.folder_open_outlined, 'Project'),
  ];
  @override
  void dispose() { _caption.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom + 24),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Center(child: Container(margin: const EdgeInsets.only(top: 12, bottom: 4), width: 36, height: 4, decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(2)))),
        Padding(padding: const EdgeInsets.fromLTRB(20, 8, 8, 8),
          child: Row(children: [
            Text('Create', style: GoogleFonts.spaceGrotesk(color: AppColors.foreground, fontSize: 17, fontWeight: FontWeight.w700)),
            const Spacer(),
            IconButton(icon: const Icon(Icons.close_rounded, color: AppColors.muted, size: 20), onPressed: () => Navigator.pop(context)),
          ])),
        Padding(padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Container(padding: const EdgeInsets.all(4), decoration: BoxDecoration(color: const Color(0xFF051418), borderRadius: BorderRadius.circular(12)),
            child: Row(children: List.generate(_types.length, (i) {
              final active = i == _type;
              return Expanded(child: GestureDetector(onTap: () => setState(() => _type = i),
                child: AnimatedContainer(duration: const Duration(milliseconds: 150),
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  decoration: BoxDecoration(color: active ? AppColors.primary : Colors.transparent, borderRadius: BorderRadius.circular(8)),
                  child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Icon(_types[i].$1, size: 15, color: active ? Colors.white : AppColors.muted),
                    const SizedBox(width: 5),
                    Text(_types[i].$2, style: GoogleFonts.dmSans(color: active ? Colors.white : AppColors.muted, fontSize: 12, fontWeight: FontWeight.w600)),
                  ]))));
            })))),
        const SizedBox(height: 14),
        Padding(padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Container(height: 90, decoration: BoxDecoration(border: Border.all(color: Colors.white12), borderRadius: BorderRadius.circular(12)),
            child: Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
              const Icon(Icons.cloud_upload_outlined, color: AppColors.primary, size: 26),
              const SizedBox(height: 4),
              Text('Drop files or tap to upload', style: GoogleFonts.dmSans(color: AppColors.foreground, fontSize: 12, fontWeight: FontWeight.w500)),
              Text('JPG, PNG up to 50MB', style: GoogleFonts.dmSans(color: AppColors.muted, fontSize: 11)),
            ])))),
        const SizedBox(height: 12),
        Padding(padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Container(decoration: BoxDecoration(color: Colors.white.withOpacity(0.04), borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.white12)),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            child: TextField(controller: _caption, maxLines: 3,
              style: GoogleFonts.dmSans(color: AppColors.foreground, fontSize: 14),
              decoration: InputDecoration.collapsed(hintText: 'Tell the story...', hintStyle: GoogleFonts.dmSans(color: const Color(0xFF7B7A9A)))))),
        const SizedBox(height: 16),
        Padding(padding: const EdgeInsets.symmetric(horizontal: 16),
          child: SizedBox(width: double.infinity, height: 50,
            child: ElevatedButton(onPressed: () => Navigator.pop(context),
              child: Text('Publish', style: GoogleFonts.spaceGrotesk(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.background))))),
      ]),
    );
  }
}
