class UserModel {
  final String id, name, username, role, location, avatarUrl, bio;
  final int followers, following, posts, creditsScore;
  final List<String> portfolioUrls;
  const UserModel({required this.id, required this.name, required this.username,
      required this.role, required this.location, required this.avatarUrl,
      required this.bio, required this.followers, required this.following,
      required this.posts, required this.creditsScore, required this.portfolioUrls});
}

class PostModel {
  final String id, imageUrl, caption, timeAgo;
  final UserModel author;
  final int likes, comments;
  final List<String> tags;
  bool isLiked, isBookmarked;
  PostModel({required this.id, required this.author, required this.imageUrl,
      required this.caption, required this.likes, required this.comments,
      required this.timeAgo, required this.tags,
      this.isLiked = false, this.isBookmarked = false});
}

class OpportunityModel {
  final String id, title, company, location, budgetRange, type, postedAgo, logoUrl;
  final List<String> tags;
  final bool isUrgent;
  const OpportunityModel({required this.id, required this.title,
      required this.company, required this.location, required this.budgetRange,
      required this.type, required this.tags, required this.postedAgo,
      required this.isUrgent, required this.logoUrl});
}

class MessageThread {
  final String id, lastMessage, timeAgo;
  final UserModel participant;
  final int unread;
  final bool isOnline;
  const MessageThread({required this.id, required this.participant,
      required this.lastMessage, required this.timeAgo,
      required this.unread, required this.isOnline});
}

// ─── Sample Data ─────────────────────────────────────────────────────────────

final sampleUsers = [
  const UserModel(
    id: '1', name: 'Amara Osei', username: 'amara.osei',
    role: 'Fashion Photographer', location: 'Lagos, Nigeria',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200',
    bio: 'Visual storyteller crafting narratives through light & shadow. Available for editorial & commercial shoots.',
    followers: 12400, following: 890, posts: 247, creditsScore: 847,
    portfolioUrls: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400',
    ],
  ),
  const UserModel(
    id: '2', name: 'Kwame Asante', username: 'kwame.film',
    role: 'Filmmaker', location: 'Accra, Ghana',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    bio: 'Directing stories that matter. Afrofuturism × documentary.',
    followers: 8900, following: 340, posts: 89, creditsScore: 912, portfolioUrls: [],
  ),
  const UserModel(
    id: '3', name: 'Zara Mensah', username: 'zara.design',
    role: 'Brand Designer', location: 'Nairobi, Kenya',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    bio: 'Crafting identities for bold African brands.',
    followers: 5600, following: 210, posts: 134, creditsScore: 763, portfolioUrls: [],
  ),
  const UserModel(
    id: '4', name: 'Tolu Adeyemi', username: 'tolu.moves',
    role: 'Creative Director', location: 'Abuja, Nigeria',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    bio: 'Where culture meets commerce.',
    followers: 21000, following: 560, posts: 312, creditsScore: 958, portfolioUrls: [],
  ),
];

List<PostModel> get samplePosts => [
  PostModel(id: '1', author: sampleUsers[0],
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
    caption: 'Editorial series for @voguearabia — the intersection of tradition and modernity told through fabric and light ✨',
    likes: 1247, comments: 89, timeAgo: '2h', tags: ['editorial', 'fashion', 'lagos']),
  PostModel(id: '2', author: sampleUsers[1],
    imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800',
    caption: 'Behind the scenes of our short film "Ekow". Shooting on 16mm was the only way to capture the warmth of Accra.',
    likes: 934, comments: 67, timeAgo: '5h', tags: ['film', 'bts', 'ghana']),
  PostModel(id: '3', author: sampleUsers[2],
    imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800',
    caption: 'Brand identity for a new Nairobi restaurant. Bold, warm, unmistakably Kenyan 🔥',
    likes: 678, comments: 45, timeAgo: '8h', tags: ['branding', 'design', 'kenya']),
  PostModel(id: '4', author: sampleUsers[3],
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    caption: 'Creative direction for the new Afrobeats Collective campaign. Music, culture, identity — all in one frame.',
    likes: 2341, comments: 156, timeAgo: '12h', tags: ['creative', 'music', 'culture']),
];

final sampleOpportunities = [
  const OpportunityModel(id: '1', title: 'Fashion Campaign Photographer',
    company: 'Vlisco Africa', location: 'Remote / Lagos',
    budgetRange: '\$2,000–\$4,000', type: 'Contract',
    tags: ['Photography', 'Fashion', 'Editorial'], postedAgo: '2h ago',
    isUrgent: true, logoUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=80'),
  const OpportunityModel(id: '2', title: 'Brand Identity Designer',
    company: 'Paystack', location: 'Lagos, Nigeria',
    budgetRange: '\$3,500–\$6,000', type: 'Full-time',
    tags: ['Design', 'Branding', 'Figma'], postedAgo: '1d ago',
    isUrgent: false, logoUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=80'),
  const OpportunityModel(id: '3', title: 'Afrobeats Music Video Director',
    company: 'Audiomack Studios', location: 'Remote',
    budgetRange: '\$5,000–\$10,000', type: 'Project',
    tags: ['Film', 'Music Video', 'Direction'], postedAgo: '3d ago',
    isUrgent: false, logoUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80'),
  const OpportunityModel(id: '4', title: 'Social Content Creator',
    company: 'Flutterwave', location: 'Hybrid / Accra',
    budgetRange: '\$1,200–\$2,500', type: 'Part-time',
    tags: ['Content', 'Social Media', 'Video'], postedAgo: '4d ago',
    isUrgent: false, logoUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=80'),
];

List<MessageThread> get sampleThreads => [
  MessageThread(id: '1', participant: sampleUsers[1],
    lastMessage: 'Can we schedule a call to discuss the project?',
    timeAgo: '2m', unread: 3, isOnline: true),
  MessageThread(id: '2', participant: sampleUsers[2],
    lastMessage: 'Loved your latest editorial! The lighting was 🔥',
    timeAgo: '1h', unread: 0, isOnline: false),
  MessageThread(id: '3', participant: sampleUsers[3],
    lastMessage: 'The brief is attached. Let me know your thoughts.',
    timeAgo: '3h', unread: 1, isOnline: true),
];
