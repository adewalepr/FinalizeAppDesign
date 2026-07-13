import 'package:flutter/material.dart';
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
  int _index = 0;

  static const _screens = [
    FeedScreen(), ExploreScreen(), OpportunitiesScreen(),
    MessagesScreen(), ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final isMessages = _index == 3;
    return Scaffold(
      appBar: isMessages ? null : AppBar(
        titleSpacing: 16,
        title: const UpryzinLogo(height: 24),
        bottom: PreferredSize(preferredSize: const Size.fromHeight(1),
            child: Container(height: 1, color: AppColors.border)),
        actions: [
          if (_index == 0) ...[
            IconButton(icon: const Icon(Icons.search_rounded, size: 22, color: AppColors.muted), onPressed: () {}),
            _NotificationBell(),
          ] else if (_index == 4) ...[
            IconButton(icon: const Icon(Icons.settings_outlined, size: 22, color: AppColors.muted), onPressed: () {}),
          ] else
            IconButton(icon: const Icon(Icons.notifications_outlined, size: 22, color: AppColors.muted), onPressed: () {}),
          const SizedBox(width: 4),
        ],
      ),
      body: IndexedStack(index: _index, children: _screens),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home_rounded), label: 'Feed'),
          NavigationDestination(icon: Icon(Icons.explore_outlined), selectedIcon: Icon(Icons.explore_rounded), label: 'Explore'),
          NavigationDestination(icon: Icon(Icons.work_outline_rounded), selectedIcon: Icon(Icons.work_rounded), label: 'Jobs'),
          NavigationDestination(icon: Icon(Icons.chat_bubble_outline_rounded), selectedIcon: Icon(Icons.chat_bubble_rounded), label: 'Messages'),
          NavigationDestination(icon: Icon(Icons.person_outline_rounded), selectedIcon: Icon(Icons.person_rounded), label: 'Profile'),
        ],
      ),
    );
  }
}

class _NotificationBell extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Stack(clipBehavior: Clip.none, children: [
    IconButton(icon: const Icon(Icons.notifications_outlined, size: 22, color: AppColors.muted), onPressed: () {}),
    Positioned(top: 8, right: 8, child: Container(width: 8, height: 8,
        decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle))),
  ]);
}
