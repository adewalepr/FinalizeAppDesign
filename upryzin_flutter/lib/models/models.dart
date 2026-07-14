import 'package:flutter/material.dart';

// ─── Post types ───────────────────────────────────────────────────────────────
enum PostType { reel, project, text }

// ─── Models ───────────────────────────────────────────────────────────────────
class PostUser {
  final String name, username, avatarUrl, role;
  final int score;
  final bool verified;
  const PostUser({
    required this.name, required this.username, required this.avatarUrl,
    required this.role, required this.score, required this.verified,
  });
}

class PortfolioItem {
  final String imageUrl, title;
  final int likes;
  const PortfolioItem({required this.imageUrl, required this.title, required this.likes});
}

class UserModel {
  final String name, username, avatarUrl, role, location, bio;
  final int creditsScore, posts, followers, following;
  final bool verified;
  final List<String> skills;
  final List<PortfolioItem> portfolioItems;
  const UserModel({
    required this.name, required this.username, required this.avatarUrl,
    required this.role, required this.location, required this.bio,
    required this.creditsScore, required this.posts, required this.followers,
    required this.following, required this.verified, required this.skills,
    required this.portfolioItems,
  });
}

class PostModel {
  final int id;
  final PostType type;
  final PostUser user;
  final String caption, timeAgo;
  final List<String> tags;
  final int likes, comments, shares, saved;
  final String? mediaUrl;
  bool isLiked, isBookmarked;
  PostModel({
    required this.id, required this.type, required this.user,
    required this.caption, required this.timeAgo, required this.tags,
    required this.likes, required this.comments, required this.shares,
    required this.saved, this.mediaUrl, this.isLiked = false, this.isBookmarked = false,
  });
}

class OpportunityModel {
  final int id, applicants, match;
  final String title, company, logoUrl, type, location, salary, posted;
  final List<String> skills;
  final bool isUrgent;
  const OpportunityModel({
    required this.id, required this.title, required this.company,
    required this.logoUrl, required this.type, required this.location,
    required this.salary, required this.posted, required this.match,
    required this.skills, required this.applicants, this.isUrgent = false,
  });
}

class MessageThread {
  final int id, unread;
  final PostUser participant;
  final String lastMessage, timeAgo;
  final bool isOnline;
  const MessageThread({
    required this.id, required this.participant, required this.lastMessage,
    required this.timeAgo, required this.unread, required this.isOnline,
  });
}

// ─── Type badge colors ────────────────────────────────────────────────────────
Color typeBg(String type) {
  switch (type) {
    case 'Full-time': return const Color(0xFF011A12);
    case 'Freelance': return const Color(0xFF422006);
    case 'Contract': return const Color(0xFF1E3A5F);
    default: return const Color(0xFF052E16);
  }
}

Color typeFg(String type) {
  switch (type) {
    case 'Full-time': return const Color(0xFF3DDEAA);
    case 'Freelance': return const Color(0xFFFBBF24);
    case 'Contract': return const Color(0xFF93C5FD);
    default: return const Color(0xFF6EE7B7);
  }
}

Color scoreColor(int s) {
  if (s >= 800) return const Color(0xFF00C27A);
  if (s >= 600) return const Color(0xFFF59E0B);
  return const Color(0xFF5A8888);
}

// ─── Sample data ──────────────────────────────────────────────────────────────
const _kofi = PostUser(name: 'Kofi Mensah', username: '@kofi.motion', avatarUrl: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=48&h=48&fit=crop&auto=format', role: 'Motion Designer', score: 921, verified: true);
const _zara = PostUser(name: 'Zara Adeyemi', username: '@zara.studio', avatarUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=48&h=48&fit=crop&auto=format', role: 'Brand Designer', score: 856, verified: false);
const _emeka = PostUser(name: 'Emeka Nwosu', username: '@emeka.dev', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&auto=format', role: 'Creative Developer', score: 712, verified: false);
const _simi = PostUser(name: 'Simi Adebayo', username: '@simi.lens', avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=48&h=48&fit=crop&auto=format', role: 'Photographer', score: 934, verified: true);

const meUser = PostUser(name: 'Amara Osei', username: '@amara.creates', avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format', role: 'Visual Designer', score: 784, verified: true);

const me = UserModel(
  name: 'Amara Osei', username: 'amara.creates',
  avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format',
  role: 'Visual Designer & Art Director', location: 'Lagos, Nigeria',
  bio: 'Building visual languages for the next wave of African brands. Available for brand identity, editorial, and motion.',
  creditsScore: 784, posts: 47, followers: 12400, following: 890, verified: true,
  skills: ['Brand Identity', 'Motion Design', 'Art Direction', 'Editorial', 'Figma'],
  portfolioItems: [
    PortfolioItem(imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop&auto=format', title: 'Kente & Co.', likes: 2341),
    PortfolioItem(imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=300&fit=crop&auto=format', title: 'Woven App', likes: 1876),
    PortfolioItem(imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop&auto=format', title: 'Motion Reel', likes: 3102),
    PortfolioItem(imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&auto=format', title: 'Afrique Cover', likes: 4567),
    PortfolioItem(imageUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=300&h=300&fit=crop&auto=format', title: 'Harmattan Series', likes: 2198),
    PortfolioItem(imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&h=300&fit=crop&auto=format', title: 'Startup Sprint', likes: 1654),
    PortfolioItem(imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&h=300&fit=crop&auto=format', title: 'Neon Lagos', likes: 2890),
    PortfolioItem(imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f994?w=300&h=300&fit=crop&auto=format', title: 'Heritage Campaign', likes: 3341),
    PortfolioItem(imageUrl: 'https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=300&h=300&fit=crop&auto=format', title: 'Studio Rebrand', likes: 1987),
  ],
);

List<PostModel> samplePosts = [
  PostModel(id: 1, type: PostType.reel, user: _kofi, mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=420&h=640&fit=crop&auto=format', caption: 'Motion study — fluid transitions between brand states. Six weeks of iteration distilled into 90 seconds. Full breakdown in portfolio ✦', tags: ['#MotionDesign', '#Branding', '#AfterEffects'], likes: 2847, comments: 143, shares: 89, saved: 412, timeAgo: '2h'),
  PostModel(id: 2, type: PostType.project, user: _zara, mediaUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=520&h=340&fit=crop&auto=format', caption: 'Brand identity system for Kente & Co. — a luxury textile startup from Accra. The challenge: balance deep heritage with contemporary minimalism.', tags: ['#BrandIdentity', '#LogoDesign', '#Luxury'], likes: 4120, comments: 267, shares: 198, saved: 891, timeAgo: '5h'),
  PostModel(id: 3, type: PostType.text, user: _emeka, caption: "Hot take: the best creative direction comes from constraint, not freedom. Every project I've shipped with tight boundaries has outlasted the open-ended ones. Constraints force clarity.", tags: ['#CreativeProcess', '#Design'], likes: 1893, comments: 412, shares: 234, saved: 167, timeAgo: '8h'),
  PostModel(id: 4, type: PostType.project, user: _simi, mediaUrl: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=520&h=340&fit=crop&auto=format', caption: 'Shot for the Heritage Collection campaign — natural light, raw textures, real people. Sometimes the simplest brief yields the most honest work.', tags: ['#Photography', '#Campaign', '#Heritage'], likes: 5630, comments: 318, shares: 421, saved: 1240, timeAgo: '12h'),
];

const List<UserModel> sampleCreators = [
  UserModel(name: 'Simi Adebayo', username: '@simi.lens', avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&auto=format', role: 'Photographer', location: '', bio: '', creditsScore: 934, posts: 0, followers: 0, following: 0, verified: true, skills: [], portfolioItems: [PortfolioItem(imageUrl: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=280&h=373&fit=crop&auto=format', title: '', likes: 0)]),
  UserModel(name: 'David Kweku', username: '@dkweku.mov', avatarUrl: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=40&h=40&fit=crop&auto=format', role: 'Motion Designer', location: '', bio: '', creditsScore: 889, posts: 0, followers: 0, following: 0, verified: false, skills: [], portfolioItems: [PortfolioItem(imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=280&h=373&fit=crop&auto=format', title: '', likes: 0)]),
  UserModel(name: 'Fatima Al-Hassan', username: '@fatima.type', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&auto=format', role: 'Type Designer', location: '', bio: '', creditsScore: 845, posts: 0, followers: 0, following: 0, verified: false, skills: [], portfolioItems: [PortfolioItem(imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=280&h=373&fit=crop&auto=format', title: '', likes: 0)]),
  UserModel(name: 'Chidi Eze', username: '@chidi.build', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&auto=format', role: 'Creative Developer', location: '', bio: '', creditsScore: 812, posts: 0, followers: 0, following: 0, verified: false, skills: [], portfolioItems: [PortfolioItem(imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=280&h=373&fit=crop&auto=format', title: '', likes: 0)]),
  UserModel(name: 'Ama Boateng', username: '@ama.illus', avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&auto=format', role: 'Illustrator', location: '', bio: '', creditsScore: 798, posts: 0, followers: 0, following: 0, verified: false, skills: [], portfolioItems: [PortfolioItem(imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=280&h=373&fit=crop&auto=format', title: '', likes: 0)]),
  UserModel(name: 'Yemi Hassan', username: '@yemi.brand', avatarUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=40&h=40&fit=crop&auto=format', role: 'Brand Strategist', location: '', bio: '', creditsScore: 776, posts: 0, followers: 0, following: 0, verified: false, skills: [], portfolioItems: [PortfolioItem(imageUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=280&h=373&fit=crop&auto=format', title: '', likes: 0)]),
];

const List<PostUser> storyUsers = [_kofi, _zara, _simi, _emeka];

const List<OpportunityModel> sampleOpportunities = [
  OpportunityModel(id: 1, title: 'Senior Brand Designer', company: 'Flutterwave', logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=48&h=48&fit=crop&auto=format', type: 'Full-time', location: 'Remote / Lagos', salary: '\$65k–\$90k', posted: '2d ago', match: 94, applicants: 47, skills: ['Brand Identity', 'Figma', 'Motion']),
  OpportunityModel(id: 2, title: 'Creative Director', company: 'Paystack', logoUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=48&h=48&fit=crop&auto=format', type: 'Contract', location: 'Hybrid – Lagos', salary: '\$80k–\$120k', posted: '3d ago', match: 88, applicants: 89, skills: ['Art Direction', 'Team Lead', 'Campaign']),
  OpportunityModel(id: 3, title: 'Visual Artist – Album Art', company: 'Afrobeats Collective', logoUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=48&h=48&fit=crop&auto=format', type: 'Collab', location: 'Remote', salary: 'Rev. Share', posted: '1d ago', match: 76, applicants: 23, skills: ['Illustration', 'Typography', 'Music'], isUrgent: true),
  OpportunityModel(id: 4, title: 'UX Designer – Fintech', company: 'Carbon', logoUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=48&h=48&fit=crop&auto=format', type: 'Freelance', location: 'Remote', salary: '\$40–\$60/hr', posted: 'Today', match: 71, applicants: 12, skills: ['UX Research', 'Figma', 'Prototyping']),
  OpportunityModel(id: 5, title: 'Motion Designer – Social', company: 'MTN Group', logoUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=48&h=48&fit=crop&auto=format', type: 'Full-time', location: 'JHB / Remote', salary: '\$50k–\$70k', posted: '4d ago', match: 91, applicants: 134, skills: ['Motion Design', 'After Effects', 'Social']),
];

const List<MessageThread> sampleThreads = [
  MessageThread(id: 1, participant: _kofi, lastMessage: 'Your motion style is incredible', timeAgo: '2m', unread: 2, isOnline: true),
  MessageThread(id: 2, participant: _zara, lastMessage: 'Can we collaborate on the Kente project?', timeAgo: '1h', unread: 0, isOnline: true),
  MessageThread(id: 3, participant: _emeka, lastMessage: 'Hot take: constraints force clarity', timeAgo: '2h', unread: 1, isOnline: false),
  MessageThread(id: 4, participant: _simi, lastMessage: 'Shooting in Accra next week — want to join?', timeAgo: '1d', unread: 0, isOnline: false),
];

String fmtNum(int n) => n >= 1000 ? '${(n / 1000).toStringAsFixed(1)}k' : '$n';
