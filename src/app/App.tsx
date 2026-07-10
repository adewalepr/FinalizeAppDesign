import { useState } from "react";
import {
  Home, Compass, Briefcase, Users, Bell, MessageSquare,
  Search, Plus, Star, TrendingUp, Award, MapPin, Heart,
  MessageCircle, Share2, Bookmark, Play, ChevronRight,
  Zap, Settings, Filter, MoreHorizontal, Clock, Globe,
  CheckCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────

type View = "feed" | "explore" | "opportunities" | "profile";

interface PostUser {
  name: string;
  username: string;
  avatar: string;
  score: number;
  verified: boolean;
}

interface BasePost {
  id: number;
  type: "reel" | "project" | "text";
  user: PostUser;
  caption: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  saved: number;
  timeAgo: string;
}

interface ReelPost extends BasePost { type: "reel"; thumbnail: string; }
interface ProjectPost extends BasePost { type: "project"; images: string[]; }
interface TextPost extends BasePost { type: "text"; }
type Post = ReelPost | ProjectPost | TextPost;

// ─── Mock Data ──────────────────────────────────────────────────────────────

const ME = {
  name: "Amara Osei",
  username: "@amara.creates",
  avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format",
  role: "Visual Designer & Art Director",
  location: "Lagos, Nigeria",
  score: 784,
  followers: 12400,
  following: 890,
  projects: 47,
  bio: "Building visual languages for the next wave of African brands. Available for brand identity, editorial, and motion.",
  skills: ["Brand Identity", "Motion Design", "Art Direction", "Editorial", "Figma"],
};

const POSTS: Post[] = [
  {
    id: 1, type: "reel",
    user: { name: "Kofi Mensah", username: "@kofi.motion", score: 921, verified: true,
      avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=48&h=48&fit=crop&auto=format" },
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=420&h=640&fit=crop&auto=format",
    caption: "Motion study — fluid transitions between brand states. Six weeks of iteration distilled into 90 seconds. Full breakdown in portfolio ✦",
    tags: ["#MotionDesign", "#Branding", "#AfterEffects"],
    likes: 2847, comments: 143, shares: 89, saved: 412, timeAgo: "2h",
  },
  {
    id: 2, type: "project",
    user: { name: "Zara Adeyemi", username: "@zara.studio", score: 856, verified: false,
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=48&h=48&fit=crop&auto=format" },
    images: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=520&h=340&fit=crop&auto=format"],
    caption: "Brand identity system for Kente & Co. — a luxury textile startup from Accra. The challenge: balance deep heritage with contemporary minimalism.",
    tags: ["#BrandIdentity", "#LogoDesign", "#Luxury"],
    likes: 4120, comments: 267, shares: 198, saved: 891, timeAgo: "5h",
  },
  {
    id: 3, type: "text",
    user: { name: "Emeka Nwosu", username: "@emeka.dev", score: 712, verified: false,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&auto=format" },
    caption: "Hot take: the best creative direction comes from constraint, not freedom. Every project I've shipped with tight boundaries has outlasted the open-ended ones. Constraints force clarity. What's your experience?",
    tags: ["#CreativeProcess", "#Design"],
    likes: 1893, comments: 412, shares: 234, saved: 167, timeAgo: "8h",
  },
];

const OPPS = [
  { id: 1, title: "Senior Brand Designer", company: "Flutterwave", type: "Full-time", location: "Remote / Lagos", salary: "$65k–$90k",
    skills: ["Brand Identity", "Figma", "Motion"], logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=48&h=48&fit=crop&auto=format", posted: "2d ago", applicants: 47, match: 94 },
  { id: 2, title: "Creative Director", company: "Paystack", type: "Contract", location: "Hybrid – Lagos", salary: "$80k–$120k",
    skills: ["Art Direction", "Team Lead", "Campaign"], logo: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=48&h=48&fit=crop&auto=format", posted: "3d ago", applicants: 89, match: 88 },
  { id: 3, title: "Visual Artist — Album Art", company: "Afrobeats Collective", type: "Collab", location: "Remote", salary: "Rev. Share",
    skills: ["Illustration", "Typography", "Music"], logo: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=48&h=48&fit=crop&auto=format", posted: "1d ago", applicants: 23, match: 76 },
  { id: 4, title: "UX Designer — Fintech", company: "Carbon", type: "Freelance", location: "Remote", salary: "$40–$60/hr",
    skills: ["UX Research", "Figma", "Prototyping"], logo: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=48&h=48&fit=crop&auto=format", posted: "Today", applicants: 12, match: 71 },
  { id: 5, title: "Motion Designer — Social", company: "MTN Group", type: "Full-time", location: "JHB / Remote", salary: "$50k–$70k",
    skills: ["Motion Design", "After Effects", "Social"], logo: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=48&h=48&fit=crop&auto=format", posted: "4d ago", applicants: 134, match: 91 },
];

const TALENTS = [
  { name: "Simi Adebayo", username: "@simi.lens", role: "Photographer", score: 934,
    cover: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=280&h=360&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&auto=format" },
  { name: "David Kweku", username: "@dkweku.mov", role: "Motion Designer", score: 889,
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=280&h=360&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=40&h=40&fit=crop&auto=format" },
  { name: "Fatima Al-Hassan", username: "@fatima.type", role: "Type Designer", score: 845,
    cover: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=280&h=360&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&auto=format" },
  { name: "Chidi Eze", username: "@chidi.build", role: "Creative Developer", score: 812,
    cover: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=280&h=360&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&auto=format" },
  { name: "Ama Boateng", username: "@ama.illus", role: "Illustrator", score: 798,
    cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=280&h=360&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&auto=format" },
  { name: "Yemi Hassan", username: "@yemi.brand", role: "Brand Strategist", score: 776,
    cover: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=280&h=360&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=40&h=40&fit=crop&auto=format" },
];

const PORTFOLIO = [
  { id: 1, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop&auto=format", title: "Kente & Co.", category: "Brand Identity", likes: 2341 },
  { id: 2, image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=300&fit=crop&auto=format", title: "Woven App", category: "UI/UX", likes: 1876 },
  { id: 3, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop&auto=format", title: "Motion Reel 2024", category: "Motion", likes: 3102 },
  { id: 4, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&auto=format", title: "Afrique Cover", category: "Editorial", likes: 4567 },
  { id: 5, image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=300&h=300&fit=crop&auto=format", title: "Harmattan Series", category: "Poster", likes: 2198 },
  { id: 6, image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&h=300&fit=crop&auto=format", title: "Startup Sprint", category: "Brand Identity", likes: 1654 },
  { id: 7, image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&h=300&fit=crop&auto=format", title: "Neon Lagos Type", category: "Typography", likes: 2890 },
  { id: 8, image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f994?w=300&h=300&fit=crop&auto=format", title: "Heritage Campaign", category: "Campaign", likes: 3341 },
  { id: 9, image: "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=300&h=300&fit=crop&auto=format", title: "Studio Rebrand", category: "Brand Identity", likes: 1987 },
];

const SUGGESTED = [
  { name: "Tolu Bello", username: "@tolu.vis", score: 943, role: "Photographer",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&auto=format" },
  { name: "Jide Okafor", username: "@jide.type", score: 877, role: "Typographer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format" },
  { name: "Ngozi Eze", username: "@ngozi.art", score: 821, role: "Illustrator",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&auto=format" },
];

// ─── Utilities ──────────────────────────────────────────────────────────────

const fmtNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

const scoreColor = (s: number) =>
  s >= 900 ? "#10B981" : s >= 800 ? "#7C3AED" : s >= 700 ? "#F59E0B" : "#6B7280";

const TYPE_BADGE: Record<string, string> = {
  "Full-time": "bg-violet-950 text-violet-300 border-violet-500/20",
  "Freelance": "bg-amber-950 text-amber-300 border-amber-500/20",
  "Contract": "bg-blue-950 text-blue-300 border-blue-500/20",
  "Collab": "bg-emerald-950 text-emerald-300 border-emerald-500/20",
};

// ─── Score Ring ─────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const sw = 5;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct = score / 1000;
  const col = scoreColor(score);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={sw}
        strokeDasharray={`${pct * circ} ${circ}`} strokeLinecap="round" />
    </svg>
  );
}

// ─── Nav Item ───────────────────────────────────────────────────────────────

function NavItem({ icon: Icon, label, active, onClick, badge }: {
  icon: LucideIcon; label: string; active?: boolean; onClick?: () => void; badge?: number;
}) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative
        ${active ? "bg-violet-600/20 text-violet-300" : "text-[#7B7A9A] hover:bg-white/5 hover:text-white"}`}>
      {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-violet-400 rounded-full" />}
      <Icon size={18} className={active ? "text-violet-400" : "text-[#7B7A9A] group-hover:text-white transition-colors"} />
      <span>{label}</span>
      {badge != null && (
        <span className="ml-auto bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{badge}</span>
      )}
    </button>
  );
}

// ─── Post Card ──────────────────────────────────────────────────────────────

function PostCard({ post, liked, saved, onLike, onSave }: {
  post: Post; liked: boolean; saved: boolean; onLike: () => void; onSave: () => void;
}) {
  return (
    <article className="bg-[#0F0F1C] border border-white/[0.06] rounded-2xl overflow-hidden mb-4">
      <div className="flex items-center gap-3 p-4 pb-3">
        <img src={post.user.avatar} alt={post.user.name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0 bg-[#1A1A2E]" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-white">{post.user.name}</span>
            {post.user.verified && <CheckCircle size={13} className="text-violet-400 flex-shrink-0" />}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7B7A9A]">{post.user.username}</span>
            <span className="text-[#3A3A5A]">·</span>
            <span className="text-xs text-[#7B7A9A]">{post.timeAgo}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-violet-950/60 px-2 py-1 rounded-lg border border-violet-500/20">
          <Zap size={11} className="text-violet-400" />
          <span className="text-xs font-bold text-violet-300">{post.user.score}</span>
        </div>
        <button className="text-[#4A4A6A] hover:text-white transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="px-4 pb-3">
        <p className="text-sm text-[#CCCCE0] leading-relaxed">{post.caption}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {post.tags.map(tag => (
            <span key={tag} className="text-xs text-violet-400 hover:text-violet-300 cursor-pointer transition-colors">{tag}</span>
          ))}
        </div>
      </div>

      {post.type === "reel" && (
        <div className="relative mx-4 mb-3 rounded-xl overflow-hidden bg-black" style={{ aspectRatio: "4/5", maxHeight: 400 }}>
          <img src={post.thumbnail} alt="Reel" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <button className="absolute inset-0 flex items-center justify-center group/play">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover/play:bg-white/20 transition-colors">
              <Play size={22} className="text-white ml-1" fill="white" />
            </div>
          </button>
          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
            <span className="text-white text-xs font-medium tracking-wide">REEL · 1:32</span>
          </div>
        </div>
      )}

      {post.type === "project" && post.images.map((img, i) => (
        <div key={i} className="mx-4 mb-3 rounded-xl overflow-hidden bg-[#0A0A18]">
          <img src={img} alt="Project" className="w-full object-cover" style={{ maxHeight: 320 }} />
        </div>
      ))}

      <div className="flex items-center gap-1 px-4 py-3 border-t border-white/[0.04]">
        <button onClick={onLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-sm
            ${liked ? "text-rose-400 bg-rose-950/40" : "text-[#7B7A9A] hover:text-rose-400 hover:bg-rose-950/20"}`}>
          <Heart size={15} fill={liked ? "currentColor" : "none"} />
          <span>{fmtNum(post.likes + (liked ? 1 : 0))}</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#7B7A9A] hover:text-white hover:bg-white/5 transition-all">
          <MessageCircle size={15} />
          <span>{fmtNum(post.comments)}</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#7B7A9A] hover:text-white hover:bg-white/5 transition-all">
          <Share2 size={15} />
          <span>{fmtNum(post.shares)}</span>
        </button>
        <button onClick={onSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ml-auto transition-all
            ${saved ? "text-amber-400 bg-amber-950/40" : "text-[#7B7A9A] hover:text-amber-400 hover:bg-amber-950/20"}`}>
          <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
          <span>{fmtNum(post.saved + (saved ? 1 : 0))}</span>
        </button>
      </div>
    </article>
  );
}

// ─── Right Panel ─────────────────────────────────────────────────────────────

function RightPanel({ onViewProfile }: { onViewProfile: () => void }) {
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const toggleFollow = (u: string) =>
    setFollowed(p => { const n = new Set(p); n.has(u) ? n.delete(u) : n.add(u); return n; });

  return (
    <aside className="w-72 flex-none border-l border-white/[0.05] overflow-y-auto p-5 space-y-5 scrollbar-hide">
      {/* Score Card */}
      <div className="bg-gradient-to-br from-violet-950/60 to-[#0F0F1C] border border-violet-500/20 rounded-2xl p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <Zap size={12} className="text-violet-400" />
          <span className="text-[10px] font-bold text-violet-400 tracking-widest">UPRYZIN SCORE</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <ScoreRing score={ME.score} size={72} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white">{ME.score}</span>
            </div>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{ME.name}</p>
            <p className="text-[#7B7A9A] text-xs mb-2">{ME.role.split(" & ")[0]}</p>
            <div className="flex items-center gap-1">
              <TrendingUp size={11} className="text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">+23 this week</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/[0.06]">
          {([["Followers", fmtNum(ME.followers)], ["Following", fmtNum(ME.following)], ["Projects", ME.projects]] as const).map(([label, val]) => (
            <div key={label} className="text-center">
              <div className="text-white font-bold text-sm">{val}</div>
              <div className="text-[#7B7A9A] text-[10px]">{label}</div>
            </div>
          ))}
        </div>
        <button onClick={onViewProfile}
          className="mt-3 w-full py-2 text-xs font-bold text-violet-300 bg-violet-600/15 hover:bg-violet-600/25 rounded-xl border border-violet-500/20 transition-all">
          View My Profile
        </button>
      </div>

      {/* Suggested */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] font-bold text-white tracking-widest">SUGGESTED CREATORS</h3>
          <button className="text-[10px] text-violet-400 hover:text-violet-300 transition-colors">See all</button>
        </div>
        <div className="space-y-3">
          {SUGGESTED.map(c => (
            <div key={c.username} className="flex items-center gap-3">
              <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0 bg-[#1A1A2E]" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{c.name}</p>
                <p className="text-[11px] text-[#7B7A9A] truncate">{c.role}</p>
              </div>
              <div className="flex items-center gap-1 mr-1">
                <Zap size={9} className="text-violet-400" />
                <span className="text-[11px] text-violet-400 font-bold">{c.score}</span>
              </div>
              <button onClick={() => toggleFollow(c.username)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all flex-shrink-0
                  ${followed.has(c.username)
                    ? "bg-violet-600/30 text-violet-300 border-violet-500/40"
                    : "text-violet-400 hover:text-violet-300 bg-violet-950/60 hover:bg-violet-950/80 border-violet-500/20"}`}>
                {followed.has(c.username) ? "✓" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hot Opportunities */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] font-bold text-white tracking-widest">HOT OPPORTUNITIES</h3>
          <button className="text-[10px] text-violet-400 hover:text-violet-300 transition-colors">See all</button>
        </div>
        <div className="space-y-2.5">
          {OPPS.slice(0, 3).map(o => (
            <div key={o.id} className="flex items-center gap-3 cursor-pointer group">
              <img src={o.logo} alt={o.company} className="w-8 h-8 rounded-lg object-cover flex-shrink-0 bg-[#1A1A2E]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate group-hover:text-violet-300 transition-colors">{o.title}</p>
                <p className="text-[10px] text-[#7B7A9A]">{o.company} · {o.type}</p>
              </div>
              <ChevronRight size={13} className="text-[#4A4A6A] group-hover:text-violet-400 transition-colors flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Event */}
      <div className="bg-[#0F0F1C] border border-white/[0.06] rounded-2xl p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Star size={11} className="text-amber-400" fill="currentColor" />
          <span className="text-[10px] font-bold text-amber-400 tracking-widest">UPCOMING EVENT</span>
        </div>
        <h4 className="text-sm font-semibold text-white mb-1">African Design Summit 2025</h4>
        <p className="text-xs text-[#7B7A9A] leading-relaxed mb-3">
          The continent's largest creative gathering. 48 speakers, 12 workshops.
        </p>
        <div className="flex items-center gap-2 text-xs text-[#7B7A9A] mb-3">
          <Clock size={11} />
          <span>Aug 14–16, 2025 · Lagos, NG</span>
        </div>
        <button className="w-full py-2 text-xs font-bold text-amber-400 bg-amber-950/40 hover:bg-amber-950/60 rounded-xl border border-amber-500/20 transition-all">
          RSVP Now
        </button>
      </div>
    </aside>
  );
}

// ─── Feed View ──────────────────────────────────────────────────────────────

function FeedView() {
  const [likes, setLikes] = useState<Set<number>>(new Set());
  const [saves, setSaves] = useState<Set<number>>(new Set());
  const [tab, setTab] = useState<"for-you" | "following" | "trending">("for-you");

  const toggle = (set: Set<number>, id: number) => {
    const n = new Set(set);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  };

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      <div className="flex gap-1 mb-6 bg-[#0F0F1C] border border-white/[0.06] p-1 rounded-xl">
        {(["for-you", "following", "trending"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all
              ${tab === t ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40" : "text-[#7B7A9A] hover:text-white"}`}>
            {t === "for-you" ? "For You" : t === "following" ? "Following" : "Trending"}
          </button>
        ))}
      </div>
      {POSTS.map(post => (
        <PostCard key={post.id} post={post}
          liked={likes.has(post.id)} saved={saves.has(post.id)}
          onLike={() => setLikes(p => toggle(p, post.id))}
          onSave={() => setSaves(p => toggle(p, post.id))}
        />
      ))}
    </div>
  );
}

// ─── Explore View ───────────────────────────────────────────────────────────

function ExploreView() {
  const cats = ["All", "Design", "Photography", "Motion", "Music", "Development", "Fashion", "Content"];
  const [cat, setCat] = useState("All");
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  return (
    <div className="py-6 px-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          Discover Talent
        </h2>
        <p className="text-sm text-[#7B7A9A] mb-4">Find creators matched to your interests</p>
        <div className="flex gap-2 flex-wrap">
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all
                ${cat === c
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                  : "bg-white/5 text-[#7B7A9A] hover:bg-white/10 hover:text-white border border-white/[0.06]"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {TALENTS.map(t => (
          <div key={t.username} className="group cursor-pointer">
            <div className="relative rounded-2xl overflow-hidden bg-[#0F0F1C] border border-white/[0.06] hover:border-violet-500/30 transition-all duration-300">
              <div className="overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <img src={t.cover} alt={t.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm leading-tight">{t.name}</p>
                    <p className="text-white/60 text-xs mt-0.5">{t.role}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      <Zap size={10} className="text-violet-400" />
                      <span className="text-xs font-bold text-white">{t.score}</span>
                    </div>
                    <button
                      onClick={() => setFollowed(p => { const n = new Set(p); n.has(t.username) ? n.delete(t.username) : n.add(t.username); return n; })}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors
                        ${followed.has(t.username) ? "bg-violet-500 text-white" : "bg-violet-600 hover:bg-violet-500 text-white"}`}>
                      {followed.has(t.username) ? "Following" : "Follow"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Opportunities View ─────────────────────────────────────────────────────

function OpportunitiesView() {
  const [filter, setFilter] = useState("All");
  const types = ["All", "Full-time", "Freelance", "Contract", "Collab"];

  return (
    <div className="py-6 px-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Opportunities
          </h2>
          <p className="text-sm text-[#7B7A9A]">Matched to your skills and Upryzin Score</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#7B7A9A] hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/[0.06] transition-all">
          <Filter size={14} />
          Filters
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full flex-shrink-0 transition-all
              ${filter === t
                ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                : "bg-white/5 text-[#7B7A9A] hover:bg-white/10 hover:text-white border border-white/[0.06]"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {OPPS.filter(o => filter === "All" || o.type === filter).map(opp => (
          <div key={opp.id} className="bg-[#0F0F1C] border border-white/[0.06] rounded-2xl p-5 hover:border-violet-500/30 transition-all cursor-pointer group">
            <div className="flex items-start gap-4">
              <img src={opp.logo} alt={opp.company}
                className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-[#1A1A2E]" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-violet-300 transition-colors">
                    {opp.title}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 border ${TYPE_BADGE[opp.type] ?? TYPE_BADGE["Collab"]}`}>
                    {opp.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-[#7B7A9A]">{opp.company}</span>
                  <span className="text-[#3A3A5A]">·</span>
                  <MapPin size={11} className="text-[#7B7A9A]" />
                  <span className="text-xs text-[#7B7A9A]">{opp.location}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {opp.skills.map(s => (
                    <span key={s} className="text-[11px] text-[#A8A8C8] bg-white/5 px-2 py-0.5 rounded-md">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-white">{opp.salary}</span>
                    <div className="flex items-center gap-1 text-xs text-[#7B7A9A]">
                      <Clock size={11} />
                      <span>{opp.posted}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#7B7A9A]">
                      <Users size={11} />
                      <span>{opp.applicants} applied</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${opp.match}%` }} />
                    </div>
                    <span className="text-xs font-bold text-violet-400">{opp.match}% match</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="mt-4 w-full py-2.5 text-sm font-semibold bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 hover:text-violet-300 rounded-xl border border-violet-500/20 hover:border-violet-500/40 transition-all">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Profile View ────────────────────────────────────────────────────────────

function ProfileView() {
  const [tab, setTab] = useState<"projects" | "posts" | "saved">("projects");

  return (
    <div className="pb-10">
      <div className="relative h-48 overflow-hidden"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=1200&h=300&fit=crop&auto=format')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/40 to-transparent" />
      </div>

      <div className="px-6 -mt-12 relative">
        <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-end gap-4">
            <div className="relative">
              <img src={ME.avatar} alt={ME.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-[#080810] bg-[#1A1A2E]" />
              <div className="absolute -bottom-1.5 -right-1.5 bg-[#080810] rounded-full p-0.5">
                <div className="bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 border-[#080810]" />
              </div>
            </div>
            <div className="mb-1">
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                {ME.name}
              </h1>
              <p className="text-[#7B7A9A] text-sm">{ME.username}</p>
            </div>
          </div>
          <div className="flex gap-2 mb-1">
            <button className="px-5 py-2 text-sm font-bold bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors shadow-lg shadow-violet-900/40">
              Edit Profile
            </button>
            <button className="px-3 py-2 text-[#7B7A9A] hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/[0.06] transition-all">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-start justify-between gap-6 mb-5 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[#CCCCE0] leading-relaxed mb-3">{ME.bio}</p>
            <div className="flex items-center gap-2 text-xs text-[#7B7A9A] mb-3 flex-wrap">
              <MapPin size={12} />
              <span>{ME.location}</span>
              <span className="mx-0.5">·</span>
              <Globe size={12} />
              <span className="text-violet-400 hover:text-violet-300 cursor-pointer transition-colors">amara.creates.co</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ME.skills.map(s => (
                <span key={s} className="text-xs text-violet-300 bg-violet-950/60 border border-violet-500/20 px-3 py-1 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="relative">
              <ScoreRing score={ME.score} size={88} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white leading-none">{ME.score}</span>
                <span className="text-[10px] text-[#7B7A9A]">/ 1000</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={11} className="text-violet-400" />
              <span className="text-[10px] font-bold text-violet-400 tracking-wider">UPRYZIN SCORE</span>
            </div>
          </div>
        </div>

        <div className="flex gap-8 pb-5 border-b border-white/[0.06]">
          {([["Projects", ME.projects], ["Followers", fmtNum(ME.followers)], ["Following", fmtNum(ME.following)]] as const).map(([label, val]) => (
            <div key={label} className="cursor-pointer group">
              <span className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">{val}</span>
              <span className="text-sm text-[#7B7A9A] ml-1.5">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-0 px-6 mt-5 border-b border-white/[0.06]">
        {(["projects", "posts", "saved"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-semibold capitalize transition-all border-b-2 -mb-px
              ${tab === t ? "text-white border-violet-500" : "text-[#7B7A9A] border-transparent hover:text-white"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="px-6 mt-6 grid grid-cols-3 gap-3">
        {PORTFOLIO.map(item => (
          <div key={item.id} className="group relative rounded-xl overflow-hidden cursor-pointer bg-[#0F0F1C]">
            <div className="aspect-square">
              <img src={item.image} alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <p className="text-white text-xs font-semibold leading-tight">{item.title}</p>
              <div className="flex items-center gap-1 mt-1">
                <Heart size={10} className="text-rose-400" fill="currentColor" />
                <span className="text-[10px] text-white/70">{fmtNum(item.likes)}</span>
              </div>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[9px] font-bold bg-black/70 backdrop-blur-sm text-white/80 px-1.5 py-0.5 rounded">
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ view, setView }: { view: View; setView: (v: View) => void }) {
  return (
    <aside className="w-56 flex-none border-r border-white/[0.05] flex flex-col overflow-y-auto scrollbar-hide bg-[#0A0A18]">
      <div className="px-5 py-5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/50">
          <Zap size={14} className="text-white" fill="white" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          upryzin
        </span>
      </div>

      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/[0.06] rounded-xl px-3 py-2 focus-within:border-violet-500/40 transition-colors">
          <Search size={14} className="text-[#7B7A9A] flex-shrink-0" />
          <input
            placeholder="Search..."
            className="bg-transparent text-sm text-white placeholder-[#7B7A9A] outline-none flex-1 min-w-0"
          />
        </div>
      </div>

      <nav className="px-3 flex-1 space-y-1">
        <NavItem icon={Home} label="Home" active={view === "feed"} onClick={() => setView("feed")} />
        <NavItem icon={Compass} label="Explore" active={view === "explore"} onClick={() => setView("explore")} />
        <NavItem icon={Briefcase} label="Opportunities" active={view === "opportunities"} onClick={() => setView("opportunities")} />
        <NavItem icon={Users} label="Collaborate" />
        <NavItem icon={Star} label="Events" />
        <NavItem icon={MessageSquare} label="Messages" badge={3} />
        <div className="my-3 h-px bg-white/[0.05]" />
        <NavItem icon={Award} label="My Profile" active={view === "profile"} onClick={() => setView("profile")} />
        <NavItem icon={Bell} label="Notifications" badge={7} />
        <NavItem icon={Settings} label="Settings" />
      </nav>

      <div className="p-4">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-violet-900/40">
          <Plus size={16} />
          Create
        </button>
      </div>

      <div className="p-4 border-t border-white/[0.05]">
        <div className="flex items-center gap-3">
          <img src={ME.avatar} alt={ME.name}
            className="w-8 h-8 rounded-lg object-cover flex-shrink-0 bg-[#1A1A2E]" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{ME.name}</p>
            <div className="flex items-center gap-1">
              <Zap size={9} className="text-violet-400" />
              <span className="text-[10px] text-violet-400 font-bold">{ME.score}</span>
            </div>
          </div>
          <MoreHorizontal size={15} className="text-[#4A4A6A] hover:text-white cursor-pointer flex-shrink-0 transition-colors" />
        </div>
      </div>
    </aside>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>("feed");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar view={view} setView={setView} />
      <main className="flex-1 overflow-y-auto min-w-0 scrollbar-hide">
        {view === "feed" && <FeedView />}
        {view === "explore" && <ExploreView />}
        {view === "opportunities" && <OpportunitiesView />}
        {view === "profile" && <ProfileView />}
      </main>
      {view === "feed" && <RightPanel onViewProfile={() => setView("profile")} />}
    </div>
  );
}
