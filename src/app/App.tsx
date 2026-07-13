import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home, Compass, Briefcase, Users, Bell, MessageSquare,
  Search, Plus, Star, TrendingUp, Award, MapPin, Heart,
  MessageCircle, Share2, Bookmark, Play, ChevronRight,
  Zap, Settings, Filter, MoreHorizontal, Clock, Globe,
  CheckCircle, X, Send, Image, Film, FolderOpen,
  Calendar, ArrowLeft, Smile, Paperclip, Video,
  AtSign, Hash, Flame, Eye, EyeOff, Mail, Lock, User,
  ArrowRight, Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast, Toaster } from "sonner";
import logoSrc from "@/imports/logo.jpg";

// ─── Types ─────────────────────────────────────────────────────────────────

type Screen = "login" | "signup" | "app";
type View = "feed" | "explore" | "opportunities" | "profile" | "messages" | "events";
type FeedTab = "for-you" | "following" | "trending";

interface PostUser { name: string; username: string; avatar: string; score: number; verified: boolean; }
interface BasePost { id: number; type: "reel" | "project" | "text"; user: PostUser; caption: string; tags: string[]; likes: number; comments: number; shares: number; saved: number; timeAgo: string; }
interface ReelPost extends BasePost { type: "reel"; thumbnail: string; }
interface ProjectPost extends BasePost { type: "project"; images: string[]; }
interface TextPost extends BasePost { type: "text"; }
type Post = ReelPost | ProjectPost | TextPost;

// ─── Mobile detection ───────────────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

// ─── Animation Variants ────────────────────────────────────────────────────

const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.16, ease: "easeIn" } },
};

const staggerContainer = { animate: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } } };
const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const slideFromRight = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 420, damping: 36 } },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.22, ease: "easeIn" } },
};

const slideFromBottom = {
  initial: { y: "100%", opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 380, damping: 32 } },
  exit: { y: "100%", opacity: 0, transition: { duration: 0.22, ease: "easeIn" } },
};

const slideFromTop = {
  initial: { y: "-100%", opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 400, damping: 32 } },
  exit: { y: "-100%", opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

const scaleModal = {
  initial: { scale: 0.92, opacity: 0, y: 24 },
  animate: { scale: 1, opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 340, damping: 28 } },
  exit: { scale: 0.95, opacity: 0, y: 12, transition: { duration: 0.15, ease: "easeIn" } },
};

const backdropVars = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

const authVariants = {
  initial: { opacity: 0, y: 32, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -20, scale: 0.97, transition: { duration: 0.22, ease: "easeIn" } },
};

// ─── Mock Data ──────────────────────────────────────────────────────────────

const ME = {
  name: "Amara Osei", username: "@amara.creates",
  avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format",
  role: "Visual Designer & Art Director", location: "Lagos, Nigeria",
  score: 784, followers: 12400, following: 890, projects: 47,
  bio: "Building visual languages for the next wave of African brands. Available for brand identity, editorial, and motion.",
  skills: ["Brand Identity", "Motion Design", "Art Direction", "Editorial", "Figma"],
};

const POSTS: Post[] = [
  { id: 1, type: "reel", user: { name: "Kofi Mensah", username: "@kofi.motion", score: 921, verified: true, avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=48&h=48&fit=crop&auto=format" }, thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=420&h=640&fit=crop&auto=format", caption: "Motion study — fluid transitions between brand states. Six weeks of iteration distilled into 90 seconds. Full breakdown in portfolio ✦", tags: ["#MotionDesign", "#Branding", "#AfterEffects"], likes: 2847, comments: 143, shares: 89, saved: 412, timeAgo: "2h" },
  { id: 2, type: "project", user: { name: "Zara Adeyemi", username: "@zara.studio", score: 856, verified: false, avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=48&h=48&fit=crop&auto=format" }, images: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=520&h=340&fit=crop&auto=format"], caption: "Brand identity system for Kente & Co. — a luxury textile startup from Accra. The challenge: balance deep heritage with contemporary minimalism.", tags: ["#BrandIdentity", "#LogoDesign", "#Luxury"], likes: 4120, comments: 267, shares: 198, saved: 891, timeAgo: "5h" },
  { id: 3, type: "text", user: { name: "Emeka Nwosu", username: "@emeka.dev", score: 712, verified: false, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&auto=format" }, caption: "Hot take: the best creative direction comes from constraint, not freedom. Every project I've shipped with tight boundaries has outlasted the open-ended ones. Constraints force clarity.", tags: ["#CreativeProcess", "#Design"], likes: 1893, comments: 412, shares: 234, saved: 167, timeAgo: "8h" },
  { id: 4, type: "project", user: { name: "Simi Adebayo", username: "@simi.lens", score: 934, verified: true, avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=48&h=48&fit=crop&auto=format" }, images: ["https://images.unsplash.com/photo-1574169208507-84376144848b?w=520&h=340&fit=crop&auto=format"], caption: "Shot for the Heritage Collection campaign — natural light, raw textures, real people. Sometimes the simplest brief yields the most honest work.", tags: ["#Photography", "#Campaign", "#Heritage"], likes: 5630, comments: 318, shares: 421, saved: 1240, timeAgo: "12h" },
];

const FOLLOWING_POSTS: Post[] = [
  { id: 5, type: "project", user: { name: "Zara Adeyemi", username: "@zara.studio", score: 856, verified: false, avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=48&h=48&fit=crop&auto=format" }, images: ["https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=520&h=340&fit=crop&auto=format"], caption: "Type exploration for the new season — variable fonts meet West African pattern geometry. Still very early but loving the direction.", tags: ["#Typography", "#AfroDesign"], likes: 2103, comments: 89, shares: 67, saved: 344, timeAgo: "3h" },
  { id: 6, type: "text", user: { name: "Kofi Mensah", username: "@kofi.motion", score: 921, verified: true, avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=48&h=48&fit=crop&auto=format" }, caption: "Just wrapped a 3-month motion rebrand. Client said 'it feels like the brand finally has a heartbeat.' That is the whole job right there.", tags: ["#MotionDesign", "#ClientWork"], likes: 3412, comments: 201, shares: 178, saved: 512, timeAgo: "6h" },
];

const TRENDING_POSTS: Post[] = [
  { id: 7, type: "reel", user: { name: "Simi Adebayo", username: "@simi.lens", score: 934, verified: true, avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=48&h=48&fit=crop&auto=format" }, thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=420&h=640&fit=crop&auto=format", caption: "BTS of the Afrique Magazine cover shoot. Lagos rooftops, golden hour, and a whole lot of patience.", tags: ["#Photography", "#BTS", "#Editorial"], likes: 11200, comments: 892, shares: 1340, saved: 4230, timeAgo: "1d" },
  { id: 8, type: "project", user: { name: "Ama Boateng", username: "@ama.illus", score: 798, verified: false, avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=48&h=48&fit=crop&auto=format" }, images: ["https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=520&h=340&fit=crop&auto=format"], caption: "The Harmattan Series — 12 illustrations exploring dust, wind, and the season that changes everything. Series 1 of 3.", tags: ["#Illustration", "#AfroArt", "#Series"], likes: 8900, comments: 567, shares: 890, saved: 3120, timeAgo: "2d" },
];

const OPPS = [
  { id: 1, title: "Senior Brand Designer", company: "Flutterwave", type: "Full-time", location: "Remote / Lagos", salary: "$65k–$90k", skills: ["Brand Identity", "Figma", "Motion"], logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=48&h=48&fit=crop&auto=format", posted: "2d ago", applicants: 47, match: 94 },
  { id: 2, title: "Creative Director", company: "Paystack", type: "Contract", location: "Hybrid – Lagos", salary: "$80k–$120k", skills: ["Art Direction", "Team Lead", "Campaign"], logo: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=48&h=48&fit=crop&auto=format", posted: "3d ago", applicants: 89, match: 88 },
  { id: 3, title: "Visual Artist — Album Art", company: "Afrobeats Collective", type: "Collab", location: "Remote", salary: "Rev. Share", skills: ["Illustration", "Typography", "Music"], logo: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=48&h=48&fit=crop&auto=format", posted: "1d ago", applicants: 23, match: 76 },
  { id: 4, title: "UX Designer — Fintech", company: "Carbon", type: "Freelance", location: "Remote", salary: "$40–$60/hr", skills: ["UX Research", "Figma", "Prototyping"], logo: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=48&h=48&fit=crop&auto=format", posted: "Today", applicants: 12, match: 71 },
  { id: 5, title: "Motion Designer — Social", company: "MTN Group", type: "Full-time", location: "JHB / Remote", salary: "$50k–$70k", skills: ["Motion Design", "After Effects", "Social"], logo: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=48&h=48&fit=crop&auto=format", posted: "4d ago", applicants: 134, match: 91 },
];

const TALENTS = [
  { name: "Simi Adebayo", username: "@simi.lens", role: "Photographer", score: 934, cover: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=280&h=360&fit=crop&auto=format", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&auto=format" },
  { name: "David Kweku", username: "@dkweku.mov", role: "Motion Designer", score: 889, cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=280&h=360&fit=crop&auto=format", avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=40&h=40&fit=crop&auto=format" },
  { name: "Fatima Al-Hassan", username: "@fatima.type", role: "Type Designer", score: 845, cover: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=280&h=360&fit=crop&auto=format", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&auto=format" },
  { name: "Chidi Eze", username: "@chidi.build", role: "Creative Developer", score: 812, cover: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=280&h=360&fit=crop&auto=format", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&auto=format" },
  { name: "Ama Boateng", username: "@ama.illus", role: "Illustrator", score: 798, cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=280&h=360&fit=crop&auto=format", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&auto=format" },
  { name: "Yemi Hassan", username: "@yemi.brand", role: "Brand Strategist", score: 776, cover: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=280&h=360&fit=crop&auto=format", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=40&h=40&fit=crop&auto=format" },
];

const PORTFOLIO = [
  { id: 1, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop&auto=format", title: "Kente & Co.", likes: 2341 },
  { id: 2, image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=300&fit=crop&auto=format", title: "Woven App", likes: 1876 },
  { id: 3, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop&auto=format", title: "Motion Reel", likes: 3102 },
  { id: 4, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&auto=format", title: "Afrique Cover", likes: 4567 },
  { id: 5, image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=300&h=300&fit=crop&auto=format", title: "Harmattan Series", likes: 2198 },
  { id: 6, image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&h=300&fit=crop&auto=format", title: "Startup Sprint", likes: 1654 },
  { id: 7, image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&h=300&fit=crop&auto=format", title: "Neon Lagos", likes: 2890 },
  { id: 8, image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f994?w=300&h=300&fit=crop&auto=format", title: "Heritage Campaign", likes: 3341 },
  { id: 9, image: "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=300&h=300&fit=crop&auto=format", title: "Studio Rebrand", likes: 1987 },
];

const SUGGESTED = [
  { name: "Tolu Bello", username: "@tolu.vis", score: 943, role: "Photographer", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&auto=format" },
  { name: "Jide Okafor", username: "@jide.type", score: 877, role: "Typographer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format" },
  { name: "Ngozi Eze", username: "@ngozi.art", score: 821, role: "Illustrator", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&auto=format" },
];

const STORIES = [
  { id: "me", name: "Your Story", avatar: ME.avatar, seen: true, isMe: true },
  { id: "1", name: "Kofi", avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=56&h=56&fit=crop&auto=format", seen: false },
  { id: "2", name: "Zara", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=56&h=56&fit=crop&auto=format", seen: false },
  { id: "3", name: "Simi", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=56&h=56&fit=crop&auto=format", seen: true },
  { id: "4", name: "David", avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=56&h=56&fit=crop&auto=format", seen: false },
  { id: "5", name: "Fatima", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=56&h=56&fit=crop&auto=format", seen: false },
];

const NOTIFICATIONS = [
  { id: 1, type: "like", user: "Kofi Mensah", avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=40&h=40&fit=crop&auto=format", text: "liked your Brand Identity project", time: "2m", unread: true },
  { id: 2, type: "follow", user: "Zara Adeyemi", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=40&h=40&fit=crop&auto=format", text: "started following you", time: "15m", unread: true },
  { id: 3, type: "opportunity", user: "Flutterwave", avatar: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=40&h=40&fit=crop&auto=format", text: "shortlisted you for Senior Brand Designer", time: "1h", unread: true },
  { id: 4, type: "comment", user: "Emeka Nwosu", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&auto=format", text: "commented: 'This is next level'", time: "2h", unread: false },
  { id: 5, type: "collab", user: "Ama Boateng", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&auto=format", text: "invited you to join Visual Africa project", time: "3h", unread: false },
];

const CONVERSATIONS = [
  { id: 1, user: "Kofi Mensah", avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=44&h=44&fit=crop&auto=format", lastMsg: "Your motion style is incredible", time: "2m", unread: 2, online: true },
  { id: 2, user: "Zara Adeyemi", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=44&h=44&fit=crop&auto=format", lastMsg: "Can we collaborate on the Kente project?", time: "1h", unread: 0, online: true },
  { id: 3, user: "Flutterwave HR", avatar: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=44&h=44&fit=crop&auto=format", lastMsg: "Thank you for your application...", time: "2h", unread: 1, online: false },
  { id: 4, user: "Simi Adebayo", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=44&h=44&fit=crop&auto=format", lastMsg: "Shooting in Accra next week — want to join?", time: "1d", unread: 0, online: false },
];

const CHAT_MESSAGES = [
  { id: 1, from: "other" as const, text: "Hey! I saw your motion reel — absolutely incredible work", time: "10:31 AM" },
  { id: 2, from: "me" as const, text: "Thank you so much! I've been experimenting with fluid transitions for months.", time: "10:33 AM" },
  { id: 3, from: "other" as const, text: "The timing on those brand state transitions is perfect. How did you handle the easing?", time: "10:34 AM" },
  { id: 4, from: "me" as const, text: "Custom cubic bezier curves mostly. I use a spreadsheet to preview easing before After Effects.", time: "10:36 AM" },
  { id: 5, from: "other" as const, text: "Genius. Would love to collaborate — working on a rebrand for a music label right now.", time: "10:38 AM" },
  { id: 6, from: "me" as const, text: "Send me the brief. Let's see what we can build.", time: "10:39 AM" },
];

const COMMENTS = [
  { id: 1, user: "Tolu Bello", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=36&h=36&fit=crop&auto=format", text: "This is absolutely stunning. The typography system alone is worth studying for hours.", time: "1h", likes: 24 },
  { id: 2, user: "David Kweku", avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=36&h=36&fit=crop&auto=format", text: "How long did the brand discovery phase take? The direction feels so confident.", time: "2h", likes: 18 },
  { id: 3, user: "Ngozi Eze", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=36&h=36&fit=crop&auto=format", text: "Kente & Co. is lucky to have you. This is what the next generation of African luxury branding looks like.", time: "3h", likes: 41 },
];

const EVENTS = [
  { id: 1, title: "African Design Summit 2025", type: "Conference", date: "Aug 14–16", location: "Lagos, Nigeria", cover: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop&auto=format", attendees: 1247, virtual: false, rsvped: false, price: "Free" },
  { id: 2, title: "Motion Design Masterclass", type: "Workshop", date: "Jul 28", location: "Online", cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=300&fit=crop&auto=format", attendees: 340, virtual: true, rsvped: true, price: "Free" },
  { id: 3, title: "Creatives Networking Night", type: "Networking", date: "Jul 19", location: "Accra, Ghana", cover: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=300&fit=crop&auto=format", attendees: 89, virtual: false, rsvped: false, price: "GHS 50" },
  { id: 4, title: "Brand Strategy Intensive", type: "Workshop", date: "Aug 3", location: "Online", cover: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=300&fit=crop&auto=format", attendees: 220, virtual: true, rsvped: false, price: "15,000" },
];

// ─── Utilities ──────────────────────────────────────────────────────────────

const fmtNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
const scoreColor = (s: number) => s >= 800 ? "#00C27A" : s >= 600 ? "#F59E0B" : "#6B7280";
const TYPE_BADGE: Record<string, string> = {
  "Full-time": "bg-[#011A12] text-[#3DDEAA] border-[#00C27A]/20",
  "Freelance": "bg-amber-950 text-amber-300 border-amber-500/20",
  "Contract": "bg-blue-950 text-blue-300 border-blue-500/20",
  "Collab": "bg-emerald-950 text-emerald-300 border-emerald-500/20",
};
const NOTIF_ICON: Record<string, { icon: LucideIcon; color: string }> = {
  like: { icon: Heart, color: "text-rose-400" },
  follow: { icon: Users, color: "text-[#00C27A]" },
  opportunity: { icon: Briefcase, color: "text-amber-400" },
  comment: { icon: MessageCircle, color: "text-blue-400" },
  collab: { icon: Users, color: "text-emerald-400" },
};

// ─── Animated Counter ───────────────────────────────────────────────────────

function AnimatedCounter({ value, delay = 0 }: { value: number; delay?: number }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let frame: number;
      const startTime = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / 1300, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrent(Math.round(eased * value));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return <>{current}</>;
}

// ─── Score Ring ─────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const sw = 5, r = (size - sw * 2) / 2, circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={scoreColor(score)} strokeWidth={sw}
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ * (1 - score / 1000) }}
        transition={{ duration: 1.4, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }} />
    </svg>
  );
}

// ─── Auth Input ──────────────────────────────────────────────────────────────

function AuthInput({ icon: Icon, type = "text", placeholder, value, onChange, rightEl }: {
  icon: LucideIcon; type?: string; placeholder: string; value: string;
  onChange: (v: string) => void; rightEl?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/[0.08] rounded-2xl px-4 py-4 focus-within:border-[#00C27A]/50 focus-within:bg-white/[0.07] transition-all group">
      <Icon size={17} className="text-[#5A8888] group-focus-within:text-[#00C27A] transition-colors flex-shrink-0" />
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        className="flex-1 bg-transparent text-sm text-white placeholder-[#5A5A7A] outline-none" />
      {rightEl}
    </div>
  );
}

// ─── Login Screen ────────────────────────────────────────────────────────────

function LoginScreen({ onLogin, onGoSignup }: { onLogin: () => void; onGoSignup: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Welcome back, Amara!");
    onLogin();
  };

  return (
    <motion.div variants={authVariants} initial="initial" animate="animate" exit="exit"
      className="flex flex-col min-h-screen bg-[#07191E] px-6 py-10 justify-between"
      style={{ paddingTop: "calc(2.5rem + env(safe-area-inset-top, 0px))", paddingBottom: "calc(2rem + env(safe-area-inset-bottom, 0px))" }}>

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#00C27A]/10 blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-60 h-60 rounded-full bg-[#00C27A]/5 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-amber-700/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-2.5 mb-12">
          <LogoMark height={30} />
          <span className="text-2xl font-bold text-[#00C27A] tracking-widest" style={{ fontFamily: "'Clash Grotesk', 'DM Sans', sans-serif" }}>UPRYZIN</span>
        </motion.div>

        {/* Headline */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="mb-10">
          <h1 className="text-3xl font-bold text-white leading-tight mb-2" style={{ fontFamily: "'Clash Grotesk', 'DM Sans', sans-serif" }}>
            Welcome back<span className="text-[#00C27A]">.</span>
          </h1>
          <p className="text-[#5A8888] text-sm">Sign in to your creative universe</p>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
          className="space-y-3">
          <AuthInput icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} />
          <AuthInput icon={Lock} type={showPw ? "text" : "password"} placeholder="Password" value={password} onChange={setPassword}
            rightEl={
              <motion.button whileTap={{ scale: 0.85 }} onClick={() => setShowPw(p => !p)}
                className="text-[#5A8888] hover:text-[#00C27A] transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </motion.button>
            } />
          <div className="flex justify-end pt-1">
            <button className="text-xs text-[#00C27A] hover:text-[#3DDEAA] transition-colors">Forgot password?</button>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-6 space-y-3">
          <motion.button onClick={handleLogin} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }} disabled={loading}
            className="w-full py-4 bg-[#00C27A] hover:bg-[#00AD6A] disabled:bg-[#009A60] text-[#07191E] text-sm font-bold rounded-2xl transition-all shadow-lg shadow-[#011A0F]/50 flex items-center justify-center gap-2 min-h-[56px]">
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </motion.button>

          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-[#5A5A7A] text-xs">or continue with</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: "Google", icon: "G" },
              { label: "Apple", icon: "" },
            ].map(({ label, icon }) => (
              <motion.button key={label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                onClick={() => { toast(`${label} login coming soon`); }}
                className="flex items-center justify-center gap-2 py-3.5 bg-white/5 hover:bg-white/10 border border-white/[0.08] rounded-2xl text-sm font-medium text-white transition-all min-h-[52px]">
                <span className="font-bold text-base">{icon}</span>
                <span>{label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="relative z-10 text-center pt-6">
        <p className="text-sm text-[#5A8888]">
          New to upryzin?{" "}
          <button onClick={onGoSignup} className="text-[#00C27A] font-semibold hover:text-[#3DDEAA] transition-colors">Create account</button>
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Signup Screen ───────────────────────────────────────────────────────────

const CREATIVE_ROLES = ["Visual Designer", "Photographer", "Motion Designer", "Illustrator", "UI/UX Designer", "Creative Developer", "Brand Strategist", "Art Director", "Typographer", "Filmmaker"];

function SignupScreen({ onSignup, onGoLogin }: { onSignup: () => void; onGoLogin: () => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step === 1 && (!name || !email || !password)) { toast.error("Please fill in all fields"); return; }
    setStep(2);
  };

  const handleSignup = async () => {
    if (!username || !role) { toast.error("Pick a username and role"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    toast.success("Account created! Welcome to upryzin");
    onSignup();
  };

  return (
    <motion.div variants={authVariants} initial="initial" animate="animate" exit="exit"
      className="flex flex-col min-h-screen bg-[#07191E] px-6 justify-between"
      style={{ paddingTop: "calc(2.5rem + env(safe-area-inset-top, 0px))", paddingBottom: "calc(2rem + env(safe-area-inset-bottom, 0px))" }}>

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 right-0 w-72 h-72 rounded-full bg-[#00C27A]/10 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-56 h-56 rounded-full bg-amber-700/15 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          {step === 2 && (
            <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              whileTap={{ scale: 0.85 }} onClick={() => setStep(1)}
              className="w-10 h-10 flex items-center justify-center text-[#5A8888] hover:text-white rounded-xl hover:bg-white/5 transition-all">
              <ArrowLeft size={20} />
            </motion.button>
          )}
          <div className="flex items-center gap-2">
            <LogoMark height={26} />
            <span className="text-xl font-bold text-[#00C27A] tracking-widest" style={{ fontFamily: "'Clash Grotesk', 'DM Sans', sans-serif" }}>UPRYZIN</span>
          </div>
          {/* Step indicator */}
          <div className="ml-auto flex items-center gap-1.5">
            {[1, 2].map(s => (
              <motion.div key={s} animate={{ width: step === s ? 20 : 6, backgroundColor: step === s ? "#00C27A" : "rgba(255,255,255,0.15)" }}
                className="h-1.5 rounded-full transition-all" />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Clash Grotesk', 'DM Sans', sans-serif" }}>
                  Join the movement<span className="text-[#00C27A]">.</span>
                </h1>
                <p className="text-[#5A8888] text-sm">Your creative career starts here</p>
              </div>
              <div className="space-y-3">
                <AuthInput icon={User} placeholder="Full name" value={name} onChange={setName} />
                <AuthInput icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} />
                <AuthInput icon={Lock} type={showPw ? "text" : "password"} placeholder="Create a password" value={password} onChange={setPassword}
                  rightEl={
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => setShowPw(p => !p)}
                      className="text-[#5A8888] hover:text-[#00C27A] transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center">
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </motion.button>
                  } />
                {password.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${
                        password.length > i * 3 ? (password.length < 6 ? "bg-rose-500" : password.length < 10 ? "bg-amber-500" : "bg-emerald-500") : "bg-white/10"}`} />
                    ))}
                  </motion.div>
                )}
              </div>
              <motion.button onClick={handleNext} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
                className="mt-6 w-full py-4 bg-[#00C27A] hover:bg-[#00AD6A] text-[#07191E] text-sm font-bold rounded-2xl shadow-lg shadow-[#011A0F]/50 flex items-center justify-center gap-2 min-h-[56px]">
                Continue <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={18} className="text-amber-400" />
                  <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Clash Grotesk', 'DM Sans', sans-serif" }}>
                    Your identity<span className="text-[#00C27A]">.</span>
                  </h1>
                </div>
                <p className="text-[#5A8888] text-sm">Tell the world who you are</p>
              </div>
              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3 bg-white/5 border border-white/[0.08] rounded-2xl px-4 py-4 focus-within:border-[#00C27A]/50 transition-all group">
                  <span className="text-[#5A8888] group-focus-within:text-[#00C27A] text-sm transition-colors font-medium">@</span>
                  <input placeholder="username" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                    className="flex-1 bg-transparent text-sm text-white placeholder-[#5A5A7A] outline-none" />
                </div>
              </div>
              <p className="text-[10px] font-bold text-[#5A8888] tracking-widest mb-3">YOUR CREATIVE DISCIPLINE</p>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto scrollbar-hide pb-1">
                {CREATIVE_ROLES.map(r => (
                  <motion.button key={r} whileTap={{ scale: 0.95 }} onClick={() => setRole(r)}
                    className={`px-3 py-3 text-xs font-semibold rounded-xl border transition-all text-left min-h-[48px]
                      ${role === r ? "bg-[#00C27A]/20 border-[#00C27A]/50 text-[#3DDEAA]" : "bg-white/5 border-white/[0.06] text-[#5A8888] hover:text-white hover:border-white/20"}`}>
                    {r}
                  </motion.button>
                ))}
              </div>
              <motion.button onClick={handleSignup} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }} disabled={loading}
                className="mt-5 w-full py-4 bg-[#00C27A] hover:bg-[#00AD6A] disabled:bg-[#009A60] text-[#07191E] text-sm font-bold rounded-2xl shadow-lg shadow-[#011A0F]/50 flex items-center justify-center gap-2 min-h-[56px]">
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <><Sparkles size={15} /> Create My Profile</>
                )}
              </motion.button>
              <p className="text-[11px] text-[#5A5A7A] text-center mt-3">By joining you agree to our Terms & Privacy Policy</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
        className="relative z-10 text-center pt-4">
        <p className="text-sm text-[#5A8888]">
          Already have an account?{" "}
          <button onClick={onGoLogin} className="text-[#00C27A] font-semibold hover:text-[#3DDEAA] transition-colors">Sign in</button>
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Story Bar ──────────────────────────────────────────────────────────────

function StoryBar() {
  const [seen, setSeen] = useState<Set<string>>(new Set(STORIES.filter(s => s.seen).map(s => s.id)));
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate"
      className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
      {STORIES.map(s => (
        <motion.button key={s.id} variants={staggerItem} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }}
          onClick={() => { setSeen(p => new Set([...p, s.id])); if (!s.isMe) toast(`${s.name}'s story`, { icon: "📖" }); }}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 min-w-[56px] relative">
          <div className={`w-14 h-14 rounded-full p-[2.5px] ${seen.has(s.id) ? "bg-[#1A3540]" : "bg-gradient-to-tr from-[#00C27A] via-pink-500 to-amber-400"}`}>
            <div className="w-full h-full rounded-full overflow-hidden bg-[#0C2028] p-0.5">
              <img src={s.avatar} alt={s.name} className="w-full h-full rounded-full object-cover" />
            </div>
          </div>
          {s.isMe && (
            <div className="absolute top-8 left-8 w-4 h-4 rounded-full bg-[#00C27A] border-2 border-[#07191E] flex items-center justify-center">
              <Plus size={9} className="text-white" />
            </div>
          )}
          <span className="text-[10px] text-[#5A8888] truncate max-w-[52px]">{s.name}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}

// ─── Feed Tab Bar ────────────────────────────────────────────────────────────

function FeedTabBar({ tab, setTab }: { tab: FeedTab; setTab: (t: FeedTab) => void }) {
  const tabs: { key: FeedTab; label: string; icon: LucideIcon }[] = [
    { key: "for-you", label: "For You", icon: Star },
    { key: "following", label: "Following", icon: Users },
    { key: "trending", label: "Trending", icon: Flame },
  ];
  return (
    <div className="flex gap-1 bg-[#0C2028] border border-white/[0.06] p-1 rounded-2xl">
      {tabs.map(({ key, label, icon: Icon }) => (
        <motion.button key={key} onClick={() => setTab(key)} whileTap={{ scale: 0.95 }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-xl transition-all
            ${tab === key ? "bg-[#00C27A] text-white shadow-lg shadow-[#011A0F]/40" : "text-[#5A8888] hover:text-white"}`}>
          <Icon size={13} />
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden">{label.split(" ")[0]}</span>
        </motion.button>
      ))}
    </div>
  );
}

// ─── Post Card ──────────────────────────────────────────────────────────────

function PostCard({ post, liked, saved, onLike, onSave, onComment }: {
  post: Post; liked: boolean; saved: boolean;
  onLike: (e: React.MouseEvent) => void; onSave: () => void; onComment: () => void;
}) {
  return (
    <motion.article variants={staggerItem}
      className="bg-[#0C2028] border border-white/[0.06] hover:border-white/[0.1] rounded-2xl overflow-hidden mb-4 transition-colors duration-200">
      <div className="flex items-center gap-3 p-4 pb-3">
        <motion.img whileHover={{ scale: 1.06 }} src={post.user.avatar} alt={post.user.name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0 bg-[#0F2830]" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-white">{post.user.name}</span>
            {post.user.verified && <CheckCircle size={13} className="text-[#00C27A] flex-shrink-0" />}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5A8888]">{post.user.username}</span>
            <span className="text-[#1A4050]">·</span>
            <span className="text-xs text-[#5A8888]">{post.timeAgo}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-[#011A12]/60 px-2 py-1 rounded-lg border border-[#00C27A]/20">
          <Zap size={11} className="text-[#00C27A]" />
          <span className="text-xs font-bold text-[#3DDEAA]">{post.user.score}</span>
        </div>
        <motion.button whileTap={{ scale: 0.85 }} className="text-[#2A5555] hover:text-white transition-colors p-1">
          <MoreHorizontal size={18} />
        </motion.button>
      </div>
      <div className="px-4 pb-3">
        <p className="text-sm text-[#C8E8E8] leading-relaxed">{post.caption}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {post.tags.map(tag => (
            <motion.span key={tag} whileHover={{ scale: 1.04 }}
              className="text-xs text-[#00C27A] hover:text-[#3DDEAA] cursor-pointer transition-colors">{tag}</motion.span>
          ))}
        </div>
      </div>
      {post.type === "reel" && (
        <div className="relative mx-4 mb-3 rounded-xl overflow-hidden bg-black" style={{ aspectRatio: "4/5", maxHeight: 360 }}>
          <img src={post.thumbnail} alt="Reel" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <motion.button className="absolute inset-0 flex items-center justify-center" whileHover="hover">
            <motion.div variants={{ hover: { scale: 1.1 } }}
              className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Play size={22} className="text-white ml-1" fill="white" />
            </motion.div>
          </motion.button>
          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
            <span className="text-white text-xs font-medium">REEL · 1:32</span>
          </div>
        </div>
      )}
      {post.type === "project" && post.images.map((img, i) => (
        <motion.div key={i} whileHover={{ scale: 1.005 }} className="mx-4 mb-3 rounded-xl overflow-hidden bg-[#051418]">
          <img src={img} alt="Project" className="w-full object-cover" style={{ maxHeight: 280 }} />
        </motion.div>
      ))}
      <div className="flex items-center gap-1 px-3 py-3 border-t border-white/[0.04]">
        <motion.button onClick={onLike} whileTap={{ scale: 0.82 }}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm min-h-[44px] transition-all
            ${liked ? "text-rose-400 bg-rose-950/40" : "text-[#5A8888] hover:text-rose-400 hover:bg-rose-950/20"}`}>
          <motion.span animate={liked ? { scale: [1, 1.45, 1] } : { scale: 1 }} transition={{ duration: 0.32 }}>
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
          </motion.span>
          <span>{fmtNum(post.likes + (liked ? 1 : 0))}</span>
        </motion.button>
        <motion.button onClick={onComment} whileTap={{ scale: 0.82 }}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-[#5A8888] hover:text-white hover:bg-white/5 transition-all min-h-[44px]">
          <MessageCircle size={16} /><span>{fmtNum(post.comments)}</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.82 }} onClick={() => toast("Link copied!", { icon: "🔗" })}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-[#5A8888] hover:text-white hover:bg-white/5 transition-all min-h-[44px]">
          <Share2 size={16} /><span>{fmtNum(post.shares)}</span>
        </motion.button>
        <motion.button onClick={onSave} whileTap={{ scale: 0.82 }}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm ml-auto min-h-[44px] transition-all
            ${saved ? "text-amber-400 bg-amber-950/40" : "text-[#5A8888] hover:text-amber-400 hover:bg-amber-950/20"}`}>
          <motion.span animate={saved ? { scale: [1, 1.35, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
            <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
          </motion.span>
          <span>{fmtNum(post.saved + (saved ? 1 : 0))}</span>
        </motion.button>
      </div>
    </motion.article>
  );
}

// ─── Floating Hearts ────────────────────────────────────────────────────────

interface FloatingHeart { id: number; x: number; y: number; }
function FloatingHearts({ hearts }: { hearts: FloatingHeart[] }) {
  return <>
    {hearts.map(h => (
      <motion.div key={h.id} className="fixed pointer-events-none text-rose-400 z-[200]"
        style={{ left: h.x, top: h.y }}
        initial={{ opacity: 1, scale: 0.5, y: 0 }}
        animate={{ opacity: 0, scale: 1.7, y: -70 }}
        transition={{ duration: 0.85, ease: "easeOut" }}>
        <Heart size={20} fill="currentColor" />
      </motion.div>
    ))}
  </>;
}

// ─── Post Feed ───────────────────────────────────────────────────────────────

function PostFeed({ posts, onOpenComments }: { posts: Post[]; onOpenComments: (id: number) => void }) {
  const [likes, setLikes] = useState<Set<number>>(new Set());
  const [saves, setSaves] = useState<Set<number>>(new Set());
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const toggle = (set: Set<number>, id: number) => { const n = new Set(set); n.has(id) ? n.delete(id) : n.add(id); return n; };
  const handleLike = (postId: number, e: React.MouseEvent) => {
    if (!likes.has(postId)) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const id = Date.now();
      setFloatingHearts(p => [...p, { id, x: rect.x + rect.width / 2 - 10, y: rect.y }]);
      setTimeout(() => setFloatingHearts(p => p.filter(h => h.id !== id)), 900);
    }
    setLikes(p => toggle(p, postId));
  };
  return (
    <>
      <FloatingHearts hearts={floatingHearts} />
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        {posts.map(post => (
          <PostCard key={post.id} post={post} liked={likes.has(post.id)} saved={saves.has(post.id)}
            onLike={e => handleLike(post.id, e)}
            onSave={() => setSaves(p => toggle(p, post.id))}
            onComment={() => onOpenComments(post.id)} />
        ))}
      </motion.div>
    </>
  );
}

// ─── Notifications Panel ────────────────────────────────────────────────────

function NotificationsPanel({ onClose, isMobile }: { onClose: () => void; isMobile: boolean }) {
  const [notes, setNotes] = useState(NOTIFICATIONS);
  const variants = isMobile ? slideFromBottom : slideFromRight;
  const cls = isMobile
    ? "fixed bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl z-50 flex flex-col"
    : "fixed right-0 top-0 h-full w-96 z-50 flex flex-col";
  return (
    <motion.div variants={variants} initial="initial" animate="animate" exit="exit"
      className={`bg-[#0A1E24] border border-white/[0.07] shadow-2xl ${cls}`}>
      {isMobile && <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mt-3 mb-1 flex-shrink-0" />}
      <div className="flex items-center justify-between p-5 border-b border-white/[0.06] flex-shrink-0">
        <div>
          <h2 className="font-bold text-white" style={{ fontFamily: "'Clash Grotesk', 'DM Sans', sans-serif" }}>Notifications</h2>
          <p className="text-xs text-[#5A8888] mt-0.5">{notes.filter(n => n.unread).length} unread</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setNotes(p => p.map(n => ({ ...n, unread: false })))}
            className="text-xs text-[#00C27A] hover:text-[#3DDEAA] px-2 py-1 rounded-lg hover:bg-[#011A12]/40 transition-all">
            Mark all read
          </motion.button>
          <motion.button whileTap={{ scale: 0.85 }} onClick={onClose}
            className="text-[#5A8888] hover:text-white p-2 rounded-lg hover:bg-white/5 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors">
            <X size={18} />
          </motion.button>
        </div>
      </div>
      <motion.div variants={staggerContainer} initial="initial" animate="animate"
        className="flex-1 overflow-y-auto scrollbar-hide divide-y divide-white/[0.04]">
        {notes.map(n => {
          const { icon: NIcon, color } = NOTIF_ICON[n.type] ?? NOTIF_ICON.like;
          return (
            <motion.div key={n.id} variants={staggerItem}
              onClick={() => setNotes(p => p.map(x => x.id === n.id ? { ...x, unread: false } : x))}
              className={`flex items-start gap-3 p-4 cursor-pointer relative min-h-[60px] transition-colors hover:bg-white/[0.03] ${n.unread ? "bg-[#011A12]/10" : ""}`}>
              {n.unread && <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#00AD6A] rounded-full" />}
              <div className="relative flex-shrink-0">
                <img src={n.avatar} alt={n.user} className="w-10 h-10 rounded-full object-cover bg-[#0F2830]" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0A1E24] border border-white/10 flex items-center justify-center">
                  <NIcon size={11} className={color} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#C8E8E8] leading-relaxed">
                  <span className="font-semibold text-white">{n.user}</span> {n.text}
                </p>
                <p className="text-xs text-[#5A8888] mt-1">{n.time} ago</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

// ─── Comments Panel ─────────────────────────────────────────────────────────

function CommentsPanel({ onClose, isMobile }: { onClose: () => void; isMobile: boolean }) {
  const [comment, setComment] = useState("");
  const [local, setLocal] = useState(COMMENTS);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 400); }, []);
  const variants = isMobile ? slideFromBottom : slideFromRight;
  const cls = isMobile
    ? "fixed bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl z-50 flex flex-col"
    : "fixed right-0 top-0 h-full w-96 z-50 flex flex-col";
  const submit = () => {
    if (!comment.trim()) return;
    setLocal(p => [{ id: Date.now(), user: ME.name, avatar: ME.avatar, text: comment, time: "just now", likes: 0 }, ...p]);
    setComment("");
    toast("Comment posted!", { icon: "💬" });
  };
  return (
    <motion.div variants={variants} initial="initial" animate="animate" exit="exit"
      className={`bg-[#0A1E24] border border-white/[0.07] shadow-2xl ${cls}`}>
      {isMobile && <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mt-3 mb-1 flex-shrink-0" />}
      <div className="flex items-center gap-3 p-4 border-b border-white/[0.06] flex-shrink-0">
        <motion.button whileTap={{ scale: 0.85 }} onClick={onClose}
          className="text-[#5A8888] hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors">
          <ArrowLeft size={18} />
        </motion.button>
        <h2 className="font-bold text-white" style={{ fontFamily: "'Clash Grotesk', 'DM Sans', sans-serif" }}>Comments</h2>
        <span className="text-xs text-[#5A8888] ml-auto">{local.length}</span>
      </div>
      <motion.div variants={staggerContainer} initial="initial" animate="animate"
        className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
        {local.map(c => (
          <motion.div key={c.id} variants={staggerItem} className="flex gap-3">
            <img src={c.avatar} alt={c.user} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1">
              <div className="bg-white/[0.04] rounded-xl px-3 py-2.5">
                <p className="text-xs font-semibold text-white mb-1">{c.user}</p>
                <p className="text-sm text-[#C8E8E8] leading-relaxed">{c.text}</p>
              </div>
              <div className="flex items-center gap-4 mt-1.5 px-1">
                <span className="text-[11px] text-[#5A8888]">{c.time}</span>
                <motion.button whileTap={{ scale: 0.85 }} className="text-[11px] text-[#5A8888] hover:text-rose-400 flex items-center gap-1 min-h-[32px] transition-colors">
                  <Heart size={10} /><span>{c.likes}</span>
                </motion.button>
                <button className="text-[11px] text-[#5A8888] hover:text-white min-h-[32px] transition-colors">Reply</button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <div className="p-4 border-t border-white/[0.06] flex-shrink-0" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}>
        <div className="flex items-center gap-2 bg-white/5 border border-white/[0.08] rounded-2xl px-3 py-2.5 focus-within:border-[#00C27A]/40 transition-colors">
          <img src={ME.avatar} alt="You" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
          <input ref={inputRef} value={comment} onChange={e => setComment(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="Add a comment..." className="flex-1 bg-transparent text-sm text-white placeholder-[#7B7A9A] outline-none" />
          <motion.button whileTap={{ scale: 0.85 }} onClick={submit}
            className={`min-w-[36px] min-h-[36px] flex items-center justify-center transition-colors ${comment.trim() ? "text-[#00C27A]" : "text-[#2A5555]"}`}>
            <Send size={15} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Create Modal ────────────────────────────────────────────────────────────

function CreateModal({ onClose, isMobile }: { onClose: () => void; isMobile: boolean }) {
  const [contentType, setContentType] = useState<"post" | "reel" | "project">("post");
  const [caption, setCaption] = useState("");
  const types = [{ key: "post" as const, icon: Image, label: "Post" }, { key: "reel" as const, icon: Film, label: "Reel" }, { key: "project" as const, icon: FolderOpen, label: "Project" }];
  const publish = () => { onClose(); setTimeout(() => toast.success("Published!", { description: "Your content is live ✦" }), 200); };
  return (
    <motion.div variants={backdropVars} initial="initial" animate="animate" exit="exit"
      onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-end lg:items-center justify-center">
      <motion.div variants={isMobile ? slideFromBottom : scaleModal} initial="initial" animate="animate" exit="exit"
        onClick={e => e.stopPropagation()}
        className="w-full lg:max-w-md bg-[#0C2028] border border-white/[0.08] rounded-t-3xl lg:rounded-2xl shadow-2xl overflow-hidden">
        {isMobile && <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mt-3 mb-2" />}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="font-bold text-white" style={{ fontFamily: "'Clash Grotesk', 'DM Sans', sans-serif" }}>Create</h2>
          <motion.button whileTap={{ scale: 0.85 }} onClick={onClose}
            className="text-[#5A8888] hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors">
            <X size={18} />
          </motion.button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex gap-2 bg-[#051418] p-1 rounded-xl">
            {types.map(({ key, icon: Icon, label }) => (
              <motion.button key={key} onClick={() => setContentType(key)} whileTap={{ scale: 0.95 }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium min-h-[44px] transition-all
                  ${contentType === key ? "bg-[#00C27A] text-white shadow-lg shadow-[#011A0F]/40" : "text-[#5A8888] hover:text-white"}`}>
                <Icon size={14} />{label}
              </motion.button>
            ))}
          </div>
          <div className="border-2 border-dashed border-white/10 hover:border-[#00C27A]/40 rounded-xl p-8 text-center cursor-pointer transition-colors">
            <div className="flex flex-col items-center gap-2">
              {contentType === "reel" ? <Film size={28} className="text-[#00C27A]" /> : contentType === "project" ? <FolderOpen size={28} className="text-[#00C27A]" /> : <Image size={28} className="text-[#00C27A]" />}
              <p className="text-sm font-medium text-white">Drop files or tap to upload</p>
              <p className="text-xs text-[#5A8888]">{contentType === "reel" ? "MP4, MOV up to 500MB" : "JPG, PNG up to 50MB"}</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/[0.06] rounded-xl p-3 focus-within:border-[#00C27A]/40 transition-colors">
            <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder={`Tell the story...`}
              className="w-full bg-transparent text-sm text-white placeholder-[#7B7A9A] outline-none resize-none" rows={3} />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06]">
              <div className="flex gap-1">
                {[AtSign, Hash, Smile].map((Icon, i) => (
                  <motion.button key={i} whileTap={{ scale: 0.85 }}
                    className="text-[#5A8888] hover:text-[#00C27A] p-2 min-w-[36px] min-h-[36px] flex items-center justify-center transition-colors">
                    <Icon size={16} />
                  </motion.button>
                ))}
              </div>
              <span className="text-[11px] text-[#2A5555]">{caption.length}/500</span>
            </div>
          </div>
          <motion.button onClick={publish} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 bg-[#00C27A] hover:bg-[#00AD6A] text-[#07191E] text-sm font-bold rounded-xl shadow-lg shadow-[#011A0F]/40 min-h-[52px] transition-colors"
            style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}>
            Publish
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Search Overlay ──────────────────────────────────────────────────────────

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"people" | "work" | "opportunities">("people");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);
  const filtered = query.trim() ? TALENTS.filter(t => t.name.toLowerCase().includes(query.toLowerCase()) || t.role.toLowerCase().includes(query.toLowerCase())) : TALENTS;
  return (
    <motion.div variants={backdropVars} initial="initial" animate="animate" exit="exit"
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]">
      <motion.div variants={slideFromTop} initial="initial" animate="animate" exit="exit"
        className="bg-[#0A1E24] border-b border-white/[0.06] shadow-2xl"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Search size={18} className="text-[#00C27A] flex-shrink-0" />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search creators, projects, opportunities..."
            className="flex-1 bg-transparent text-base text-white placeholder-[#7B7A9A] outline-none" />
          <motion.button whileTap={{ scale: 0.85 }} onClick={onClose}
            className="text-[#5A8888] hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors">
            <X size={18} />
          </motion.button>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-1">
          {(["people", "work", "opportunities"] as const).map(t => (
            <motion.button key={t} onClick={() => setTab(t)} whileTap={{ scale: 0.95 }}
              className={`px-4 py-1.5 text-xs font-semibold capitalize rounded-full min-h-[36px] transition-all
                ${tab === t ? "bg-[#00C27A] text-white" : "text-[#5A8888] hover:text-white"}`}>
              {t}
            </motion.button>
          ))}
        </div>
      </motion.div>
      <div className="max-w-2xl mx-auto px-4 py-5 overflow-y-auto" style={{ maxHeight: "calc(100vh - 140px)" }}>
        {!query.trim() && (
          <div className="mb-6">
            <p className="text-xs font-bold text-[#5A8888] tracking-widest mb-3">TRENDING</p>
            <div className="flex flex-wrap gap-2">
              {["Brand Identity", "Motion Design", "UX/UI", "Photography", "AfroDesign", "Type Design"].map(s => (
                <motion.button key={s} whileTap={{ scale: 0.96 }} onClick={() => setQuery(s)}
                  className="px-3 py-2 text-sm bg-white/5 hover:bg-[#011A12]/60 text-[#C8E8E8] hover:text-[#3DDEAA] border border-white/[0.06] hover:border-[#00C27A]/30 rounded-full min-h-[40px] transition-all">
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        )}
        {tab === "people" && (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 gap-3">
            {filtered.map(t => (
              <motion.div key={t.username} variants={staggerItem} whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 bg-[#0C2028] border border-white/[0.06] rounded-xl p-3 cursor-pointer hover:border-[#00C27A]/30 min-h-[60px] transition-all">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{t.name}</p>
                  <p className="text-xs text-[#5A8888]">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        {tab === "opportunities" && (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
            {OPPS.map(o => (
              <motion.div key={o.id} variants={staggerItem}
                className="flex items-center gap-3 bg-[#0C2028] border border-white/[0.06] rounded-xl p-4 cursor-pointer hover:border-[#00C27A]/30 min-h-[64px] transition-all">
                <img src={o.logo} alt={o.company} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{o.title}</p>
                  <p className="text-xs text-[#5A8888]">{o.company} · {o.salary}</p>
                </div>
                <ChevronRight size={14} className="text-[#2A5555] flex-shrink-0" />
              </motion.div>
            ))}
          </motion.div>
        )}
        {tab === "work" && (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-3 gap-2">
            {PORTFOLIO.map(p => (
              <motion.div key={p.id} variants={staggerItem} whileHover={{ scale: 1.03 }} className="rounded-xl overflow-hidden cursor-pointer aspect-square">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Mobile Top Bar ──────────────────────────────────────────────────────────

function MobileTopBar({ onSearch, onNotifications, onMessages, notifCount, msgCount }: {
  onSearch: () => void; onNotifications: () => void; onMessages: () => void; notifCount: number; msgCount: number;
}) {
  return (
    <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}
      className="flex items-center justify-between px-4 bg-[#07191E]/95 backdrop-blur-sm border-b border-white/[0.05] sticky top-0 z-30"
      style={{ paddingTop: "calc(0.75rem + env(safe-area-inset-top, 0px))", paddingBottom: "0.75rem" }}>
      <div className="flex items-center gap-2">
        <LogoMark height={22} />
        <span className="text-sm font-bold text-[#00C27A] tracking-widest" style={{ fontFamily: "'Clash Grotesk', 'DM Sans', sans-serif" }}>UPRYZIN</span>
      </div>
      <div className="flex items-center gap-1">
        <motion.button whileTap={{ scale: 0.85 }} onClick={onSearch} className="w-11 h-11 flex items-center justify-center text-[#5A8888] hover:text-white rounded-xl hover:bg-white/5 transition-all">
          <Search size={20} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.85 }} onClick={onMessages} className="w-11 h-11 flex items-center justify-center text-[#5A8888] hover:text-white rounded-xl hover:bg-white/5 transition-all relative">
          <MessageSquare size={20} />
          {msgCount > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#00C27A] rounded-full text-[9px] font-bold text-white flex items-center justify-center">{msgCount}</span>}
        </motion.button>
        <motion.button whileTap={{ scale: 0.85 }} onClick={onNotifications} className="w-11 h-11 flex items-center justify-center text-[#5A8888] hover:text-white rounded-xl hover:bg-white/5 transition-all relative">
          <Bell size={20} />
          {notifCount > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">{notifCount}</span>}
        </motion.button>
      </div>
    </motion.header>
  );
}

// ─── Bottom Nav Bar ──────────────────────────────────────────────────────────

function BottomNavBar({ view, setView, onCreate }: { view: View; setView: (v: View) => void; onCreate: () => void }) {
  const items = [
    { key: "feed" as View, icon: Home, label: "Home" },
    { key: "explore" as View, icon: Compass, label: "Explore" },
    { key: null, icon: Plus, label: "Create" },
    { key: "opportunities" as View, icon: Briefcase, label: "Jobs" },
    { key: "profile" as View, icon: Award, label: "Profile" },
  ];
  return (
    <motion.nav initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.35 }}
      className="flex items-center justify-around px-2 pt-2 bg-[#051418]/95 backdrop-blur-xl border-t border-white/[0.06]"
      style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}>
      {items.map((item) => {
        const isCreate = item.key === null;
        const isActive = item.key !== null && view === item.key;
        if (isCreate) {
          return (
            <motion.button key="create" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }} onClick={onCreate}
              className="w-14 h-14 rounded-2xl bg-[#00C27A] flex items-center justify-center shadow-lg shadow-[#011A0F]/50 -mt-4">
              <Plus size={22} className="text-white" />
            </motion.button>
          );
        }
        return (
          <motion.button key={item.key} whileTap={{ scale: 0.88 }} onClick={() => item.key && setView(item.key)}
            className="flex flex-col items-center gap-0.5 py-1 px-3 min-w-[52px] min-h-[52px] justify-center rounded-xl transition-colors">
            <div className="relative">
              <item.icon size={22} className={isActive ? "text-[#00C27A]" : "text-[#5A5A7A]"} />
              {isActive && (
                <motion.span layoutId="bottom-indicator"
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#00C27A] rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }} />
              )}
            </div>
            <span className={`text-[10px] font-medium ${isActive ? "text-[#00C27A]" : "text-[#5A5A7A]"}`}>{item.label}</span>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}

// ─── Nav Item ────────────────────────────────────────────────────────────────

function NavItem({ icon: Icon, label, active, onClick, badge }: {
  icon: LucideIcon; label: string; active?: boolean; onClick?: () => void; badge?: number;
}) {
  return (
    <motion.button onClick={onClick} whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium group relative min-h-[44px] transition-colors duration-150
        ${active ? "bg-[#00C27A]/20 text-[#3DDEAA]" : "text-[#5A8888] hover:bg-white/5 hover:text-white"}`}>
      {active && <motion.span layoutId="nav-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#00C27A] rounded-full" transition={{ type: "spring", stiffness: 500, damping: 35 }} />}
      <Icon size={18} className={`transition-colors ${active ? "text-[#00C27A]" : "text-[#5A8888] group-hover:text-white"}`} />
      <span>{label}</span>
      {badge != null && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto bg-[#00C27A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</motion.span>}
    </motion.button>
  );
}

// ─── Feed View ──────────────────────────────────────────────────────────────

function FeedView({ onOpenComments }: { onOpenComments: (id: number) => void }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="max-w-xl mx-auto py-4 px-4 lg:py-6">
      <div className="mb-5"><StoryBar /></div>
      <PostFeed posts={POSTS} onOpenComments={onOpenComments} />
    </motion.div>
  );
}

// ─── Explore View (with For You / Following / Trending) ──────────────────────

function ExploreView({ onOpenComments }: { onOpenComments: (id: number) => void }) {
  const [feedTab, setFeedTab] = useState<FeedTab>("for-you");
  const [cat, setCat] = useState("All");
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const cats = ["All", "Design", "Photography", "Motion", "Music", "Dev", "Fashion"];

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* Sticky tab bar */}
      <div className="sticky top-0 lg:top-0 z-20 bg-[#07191E]/95 backdrop-blur-sm px-4 lg:px-6 pt-4 pb-3 border-b border-white/[0.05]">
        <FeedTabBar tab={feedTab} setTab={(t) => { setFeedTab(t); setCat("All"); }} />
      </div>

      <AnimatePresence mode="wait">
        {feedTab === "for-you" && (
          <motion.div key="for-you" variants={pageVariants} initial="initial" animate="animate" exit="exit"
            className="py-4 px-4 lg:px-6">
            <div className="flex gap-2 flex-wrap mb-5">
              {cats.map(c => (
                <motion.button key={c} onClick={() => setCat(c)} whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 text-sm font-medium rounded-full min-h-[40px] transition-all
                    ${cat === c ? "bg-[#00C27A] text-white shadow-lg shadow-[#011A0F]/40" : "bg-white/5 text-[#5A8888] hover:bg-white/10 hover:text-white border border-white/[0.06]"}`}>
                  {c}
                </motion.button>
              ))}
            </div>
            <motion.div variants={staggerContainer} initial="initial" animate="animate"
              className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
              {TALENTS.map(t => (
                <motion.div key={t.username} variants={staggerItem} className="group cursor-pointer">
                  <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="relative rounded-2xl overflow-hidden bg-[#0C2028] border border-white/[0.06] hover:border-[#00C27A]/30 transition-colors">
                    <div className="overflow-hidden" style={{ aspectRatio: "3/4" }}>
                      <motion.img src={t.cover} alt={t.name} className="w-full h-full object-cover" whileHover={{ scale: 1.06 }} transition={{ duration: 0.5 }} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-end justify-between gap-1">
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm leading-tight truncate">{t.name}</p>
                          <p className="text-white/60 text-xs mt-0.5">{t.role}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                            <Zap size={10} className="text-[#00C27A]" />
                            <span className="text-xs font-bold text-white">{t.score}</span>
                          </div>
                          <motion.button whileTap={{ scale: 0.9 }}
                            onClick={() => { setFollowed(p => { const n = new Set(p); n.has(t.username) ? n.delete(t.username) : n.add(t.username); return n; }); if (!followed.has(t.username)) toast(`Following ${t.name}`, { icon: "✨" }); }}
                            className={`text-xs font-bold px-2.5 py-1.5 rounded-lg min-h-[32px] transition-all ${followed.has(t.username) ? "bg-white/20 text-white" : "bg-[#00C27A] hover:bg-[#00AD6A] text-white"}`}>
                            {followed.has(t.username) ? "✓" : "Follow"}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {feedTab === "following" && (
          <motion.div key="following" variants={pageVariants} initial="initial" animate="animate" exit="exit"
            className="max-w-xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 mb-4 p-3 bg-[#011A12]/30 border border-[#00C27A]/20 rounded-xl">
              <Users size={14} className="text-[#00C27A] flex-shrink-0" />
              <p className="text-xs text-[#3DDEAA]">Latest from creators you follow</p>
            </div>
            <PostFeed posts={FOLLOWING_POSTS} onOpenComments={onOpenComments} />
          </motion.div>
        )}

        {feedTab === "trending" && (
          <motion.div key="trending" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="px-4 lg:px-6 pt-4 pb-3 border-b border-white/[0.05]">
              <div className="flex items-center gap-2 mb-3">
                <Flame size={14} className="text-amber-400" />
                <p className="text-xs font-bold text-amber-400 tracking-wider">RISING FAST</p>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                {TALENTS.slice(0, 5).map(t => (
                  <motion.div key={t.username} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400/60">
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] text-white truncate max-w-[56px] text-center">{t.name.split(" ")[0]}</p>
                    <div className="flex items-center gap-0.5">
                      <Zap size={8} className="text-amber-400" />
                      <span className="text-[9px] text-amber-400 font-bold">{t.score}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="max-w-xl mx-auto px-4 py-4">
              <div className="flex items-center gap-2 mb-4 p-3 bg-amber-950/30 border border-amber-500/20 rounded-xl">
                <TrendingUp size={14} className="text-amber-400 flex-shrink-0" />
                <p className="text-xs text-amber-300">Most engaging posts right now</p>
              </div>
              <PostFeed posts={TRENDING_POSTS} onOpenComments={onOpenComments} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Opportunities View ─────────────────────────────────────────────────────

function OpportunitiesView() {
  const [filter, setFilter] = useState("All");
  const [applied, setApplied] = useState<Set<number>>(new Set());
  const types = ["All", "Full-time", "Freelance", "Contract", "Collab"];
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="py-5 px-4 lg:px-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Clash Grotesk', 'DM Sans', sans-serif" }}>Opportunities</h2>
          <p className="text-sm text-[#5A8888]">Matched to your skills & score</p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#5A8888] hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/[0.06] min-h-[44px] transition-all">
          <Filter size={14} />Filters
        </motion.button>
      </div>
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
        {types.map(t => (
          <motion.button key={t} onClick={() => setFilter(t)} whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 text-sm font-medium rounded-full flex-shrink-0 min-h-[40px] transition-all
              ${filter === t ? "bg-[#00C27A] text-white shadow-lg shadow-[#011A0F]/40" : "bg-white/5 text-[#5A8888] hover:bg-white/10 hover:text-white border border-white/[0.06]"}`}>
            {t}
          </motion.button>
        ))}
      </div>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
        {OPPS.filter(o => filter === "All" || o.type === filter).map(opp => (
          <motion.div key={opp.id} variants={staggerItem}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="bg-[#0C2028] border border-white/[0.06] hover:border-[#00C27A]/30 rounded-2xl p-4 lg:p-5 transition-colors">
            <div className="flex items-start gap-3 lg:gap-4">
              <img src={opp.logo} alt={opp.company} className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl object-cover flex-shrink-0 bg-[#0F2830]" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-white text-sm leading-snug">{opp.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 border ${TYPE_BADGE[opp.type] ?? TYPE_BADGE["Collab"]}`}>{opp.type}</span>
                </div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-sm text-[#5A8888]">{opp.company}</span>
                  <span className="text-[#1A4050]">·</span>
                  <MapPin size={11} className="text-[#5A8888]" />
                  <span className="text-xs text-[#5A8888]">{opp.location}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {opp.skills.map(s => <span key={s} className="text-[11px] text-[#A8A8C8] bg-white/5 px-2 py-0.5 rounded-md">{s}</span>)}
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-semibold text-white">{opp.salary}</span>
                    <div className="flex items-center gap-1 text-xs text-[#5A8888]"><Clock size={11} /><span>{opp.posted}</span></div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-14 bg-white/10 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-[#00AD6A] rounded-full" initial={{ width: 0 }} animate={{ width: `${opp.match}%` }} transition={{ duration: 0.9, delay: 0.3 }} />
                    </div>
                    <span className="text-xs font-bold text-[#00C27A]">{opp.match}%</span>
                  </div>
                </div>
              </div>
            </div>
            <motion.button onClick={() => { setApplied(p => new Set([...p, opp.id])); toast.success(`Applied!`, { description: `Sent to ${opp.company}` }); }}
              whileTap={{ scale: 0.97 }} disabled={applied.has(opp.id)}
              className={`mt-4 w-full py-3 text-sm font-semibold rounded-xl border min-h-[48px] transition-all
                ${applied.has(opp.id) ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20 cursor-default" : "bg-[#00C27A]/10 hover:bg-[#00C27A]/20 text-[#00C27A] border-[#00C27A]/20"}`}>
              {applied.has(opp.id) ? "✓ Applied" : "Apply Now"}
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Profile View ────────────────────────────────────────────────────────────

function ProfileView({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"projects" | "posts" | "saved">("projects");
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="pb-10">
      <div className="relative h-40 lg:h-48 overflow-hidden"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=1200&h=300&fit=crop&auto=format')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#07191E] via-[#07191E]/40 to-transparent" />
      </div>
      <div className="px-4 lg:px-6 -mt-12 relative">
        <div className="flex items-end justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-end gap-3">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }} className="relative">
              <img src={ME.avatar} alt={ME.name} className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover border-4 border-[#07191E]" />
              <div className="absolute -bottom-1.5 -right-1.5 bg-[#07191E] rounded-full p-0.5">
                <div className="bg-emerald-500 w-3 h-3 rounded-full border-2 border-[#07191E]" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="mb-1">
              <h1 className="text-xl lg:text-2xl font-bold text-white" style={{ fontFamily: "'Clash Grotesk', 'DM Sans', sans-serif" }}>{ME.name}</h1>
              <p className="text-[#5A8888] text-sm">{ME.username}</p>
            </motion.div>
          </div>
          <div className="flex gap-2 mb-1">
            <motion.button whileTap={{ scale: 0.95 }}
              className="px-4 py-2.5 text-sm font-bold bg-[#00C27A] hover:bg-[#00AD6A] text-[#07191E] rounded-xl min-h-[44px] shadow-lg shadow-[#011A0F]/40 transition-colors">
              Edit Profile
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={onLogout}
              className="px-3 py-2.5 text-[#5A8888] hover:text-rose-400 bg-white/5 hover:bg-rose-950/30 rounded-xl border border-white/[0.06] hover:border-rose-500/20 min-h-[44px] min-w-[44px] flex items-center justify-center transition-all"
              title="Sign out">
              <ArrowRight size={16} className="rotate-180" />
            </motion.button>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="flex items-start justify-between gap-4 mb-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[#C8E8E8] leading-relaxed mb-3">{ME.bio}</p>
            <div className="flex items-center gap-2 text-xs text-[#5A8888] mb-3 flex-wrap">
              <MapPin size={12} /><span>{ME.location}</span><span>·</span>
              <Globe size={12} /><span className="text-[#00C27A]">amara.creates.co</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ME.skills.map((s, i) => (
                <motion.span key={s} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
                  className="text-xs text-[#3DDEAA] bg-[#011A12]/60 border border-[#00C27A]/20 px-3 py-1 rounded-full">{s}</motion.span>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="relative">
              <ScoreRing score={ME.score} size={80} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white leading-none"><AnimatedCounter value={ME.score} delay={0.3} /></span>
                <span className="text-[9px] text-[#5A8888]">/ 1000</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={10} className="text-[#00C27A]" />
              <span className="text-[9px] font-bold text-[#00C27A] tracking-wider">SCORE</span>
            </div>
          </div>
        </motion.div>
        <div className="flex gap-6 pb-4 border-b border-white/[0.06]">
          {([["Projects", ME.projects], ["Followers", ME.followers], ["Following", ME.following]] as const).map(([label, val]) => (
            <motion.div key={label} whileHover={{ scale: 1.04 }} className="cursor-pointer">
              <span className="text-lg lg:text-xl font-bold text-white">{label === "Projects" ? <AnimatedCounter value={val} delay={0.4} /> : fmtNum(val)}</span>
              <span className="text-sm text-[#5A8888] ml-1.5">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex gap-0 px-4 lg:px-6 mt-4 border-b border-white/[0.06]">
        {(["projects", "posts", "saved"] as const).map(t => (
          <motion.button key={t} onClick={() => setTab(t)} whileTap={{ scale: 0.95 }}
            className={`px-4 lg:px-5 py-3 text-sm font-semibold capitalize min-h-[48px] border-b-2 -mb-px transition-all
              ${tab === t ? "text-white border-[#00C27A]" : "text-[#5A8888] border-transparent hover:text-white"}`}>
            {t}
          </motion.button>
        ))}
      </div>
      <motion.div variants={staggerContainer} initial="initial" animate="animate"
        className="px-4 lg:px-6 mt-5 grid grid-cols-3 gap-2 lg:gap-3">
        {PORTFOLIO.map(item => (
          <motion.div key={item.id} variants={staggerItem} whileHover={{ scale: 1.02 }} className="group relative rounded-xl overflow-hidden cursor-pointer bg-[#0C2028]">
            <div className="aspect-square">
              <motion.img src={item.image} alt={item.title} className="w-full h-full object-cover" whileHover={{ scale: 1.06 }} transition={{ duration: 0.4 }} />
            </div>
            <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <motion.div initial={{ opacity: 0, y: 6 }} whileHover={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="absolute bottom-0 left-0 right-0 p-2 lg:p-3">
              <p className="text-white text-[10px] lg:text-xs font-semibold">{item.title}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Heart size={9} className="text-rose-400" fill="currentColor" />
                <span className="text-[9px] text-white/70">{fmtNum(item.likes)}</span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Messages View ───────────────────────────────────────────────────────────

function MessagesView() {
  const [activeCon, setActiveCon] = useState(CONVERSATIONS[0]);
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const [input, setInput] = useState("");
  const [showThread, setShowThread] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  const send = () => {
    if (!input.trim()) return;
    setMessages(p => [...p, { id: Date.now(), from: "me" as const, text: input, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setInput("");
  };

  const ConList = (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="p-4 border-b border-white/[0.05] flex-shrink-0">
        <h2 className="font-bold text-white mb-3" style={{ fontFamily: "'Clash Grotesk', 'DM Sans', sans-serif" }}>Messages</h2>
        <div className="flex items-center gap-2 bg-white/5 border border-white/[0.06] rounded-xl px-3 py-2.5 min-h-[44px]">
          <Search size={13} className="text-[#5A8888]" />
          <input placeholder="Search messages..." className="bg-transparent text-sm text-white placeholder-[#7B7A9A] outline-none flex-1" />
        </div>
      </div>
      <motion.div variants={staggerContainer} initial="initial" animate="animate"
        className="flex-1 overflow-y-auto scrollbar-hide divide-y divide-white/[0.04]">
        {CONVERSATIONS.map(c => (
          <motion.button key={c.id} variants={staggerItem} onClick={() => { setActiveCon(c); setShowThread(true); }}
            className={`w-full flex items-center gap-3 p-4 text-left min-h-[72px] transition-colors hover:bg-white/[0.03] ${activeCon.id === c.id && !isMobile ? "bg-[#011A12]/20 border-l-2 border-[#00C27A]" : ""}`}>
            <div className="relative flex-shrink-0">
              <img src={c.avatar} alt={c.user} className="w-11 h-11 rounded-full object-cover bg-[#0F2830]" />
              {c.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#07191E]" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-sm font-semibold text-white truncate">{c.user}</p>
                <span className="text-[10px] text-[#5A8888] flex-shrink-0 ml-2">{c.time}</span>
              </div>
              <p className="text-xs text-[#5A8888] truncate">{c.lastMsg}</p>
            </div>
            {c.unread > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 rounded-full bg-[#00C27A] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{c.unread}</motion.span>}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );

  const ChatThread = (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex items-center gap-3 p-3 lg:p-4 border-b border-white/[0.05] flex-shrink-0">
        {isMobile && (
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => setShowThread(false)}
            className="text-[#5A8888] hover:text-white w-11 h-11 flex items-center justify-center transition-colors">
            <ArrowLeft size={20} />
          </motion.button>
        )}
        <div className="relative">
          <img src={activeCon.avatar} alt={activeCon.user} className="w-9 h-9 rounded-full object-cover" />
          {activeCon.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#07191E]" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{activeCon.user}</p>
          <p className="text-xs text-[#5A8888]">{activeCon.online ? "Active now" : "Last seen 2h ago"}</p>
        </div>
        <div className="ml-auto flex gap-1">
          {[Video, MoreHorizontal].map((Icon, i) => (
            <motion.button key={i} whileTap={{ scale: 0.85 }} className="w-11 h-11 flex items-center justify-center text-[#5A8888] hover:text-white rounded-xl hover:bg-white/5 transition-all">
              <Icon size={18} />
            </motion.button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map(m => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] lg:max-w-xs rounded-2xl px-4 py-3 ${m.from === "me" ? "bg-[#00C27A] text-white rounded-br-sm" : "bg-[#0F2830] text-[#C8E8E8] rounded-bl-sm"}`}>
                <p className="text-sm leading-relaxed">{m.text}</p>
                <p className={`text-[10px] mt-1 ${m.from === "me" ? "text-[#3DDEAA]" : "text-[#5A8888]"}`}>{m.time}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
      <div className="p-3 lg:p-4 border-t border-white/[0.05] flex-shrink-0"
        style={{ paddingBottom: isMobile ? "calc(0.75rem + env(safe-area-inset-bottom, 0px))" : undefined }}>
        <div className="flex items-center gap-2 bg-white/5 border border-white/[0.08] rounded-2xl px-3 lg:px-4 py-3 focus-within:border-[#00C27A]/40 min-h-[52px] transition-colors">
          <motion.button whileTap={{ scale: 0.85 }} className="text-[#5A8888] hover:text-[#00C27A] w-9 h-9 flex items-center justify-center transition-colors"><Paperclip size={16} /></motion.button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Type a message..." className="flex-1 bg-transparent text-sm text-white placeholder-[#7B7A9A] outline-none mx-1" />
          <motion.button whileTap={{ scale: 0.85 }} className="text-[#5A8888] hover:text-[#00C27A] w-9 h-9 flex items-center justify-center transition-colors"><Smile size={16} /></motion.button>
          <motion.button whileTap={{ scale: 0.85 }} onClick={send}
            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${input.trim() ? "bg-[#00C27A] hover:bg-[#00AD6A] text-white" : "bg-white/10 text-[#2A5555]"}`}>
            <Send size={15} />
          </motion.button>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex h-full overflow-hidden">
      {isMobile ? (
        <>
          {!showThread && <div className="w-full">{ConList}</div>}
          <AnimatePresence>
            {showThread && (
              <motion.div variants={slideFromRight} initial="initial" animate="animate" exit="exit"
                className="fixed inset-0 bg-background z-30 flex flex-col" style={{ top: 0 }}>
                {ChatThread}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <>
          <div className="w-72 flex-none border-r border-white/[0.05]">{ConList}</div>
          <div className="flex-1">{ChatThread}</div>
        </>
      )}
    </motion.div>
  );
}

// ─── Events View ─────────────────────────────────────────────────────────────

function EventsView() {
  const [rsvped, setRsvped] = useState<Set<number>>(new Set(EVENTS.filter(e => e.rsvped).map(e => e.id)));
  const [cat, setCat] = useState("All");
  const cats = ["All", "Conference", "Workshop", "Networking"];
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="py-5 px-4 lg:px-6 max-w-4xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl lg:text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Clash Grotesk', 'DM Sans', sans-serif" }}>Events</h2>
        <p className="text-sm text-[#5A8888] mb-4">Workshops, summits, and networking</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {cats.map(c => (
            <motion.button key={c} onClick={() => setCat(c)} whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 text-sm font-medium rounded-full flex-shrink-0 min-h-[40px] transition-all
                ${cat === c ? "bg-[#00C27A] text-white shadow-lg shadow-[#011A0F]/40" : "bg-white/5 text-[#5A8888] hover:bg-white/10 hover:text-white border border-white/[0.06]"}`}>
              {c}
            </motion.button>
          ))}
        </div>
      </div>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {EVENTS.filter(e => cat === "All" || e.type === cat).map(ev => (
          <motion.div key={ev.id} variants={staggerItem}
            whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="bg-[#0C2028] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-[#00C27A]/20 transition-colors">
            <div className="relative h-36 lg:h-40 overflow-hidden">
              <motion.img src={ev.cover} alt={ev.title} className="w-full h-full object-cover" whileHover={{ scale: 1.04 }} transition={{ duration: 0.4 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-[#00C27A]/50 backdrop-blur-sm text-white rounded-full">{ev.type}</span>
                {ev.virtual && <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-600/80 backdrop-blur-sm text-white rounded-full">Virtual</span>}
              </div>
              {rsvped.has(ev.id) && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle size={14} className="text-white" />
                </motion.div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white text-sm mb-1">{ev.title}</h3>
              <div className="flex items-center gap-3 text-xs text-[#5A8888] mb-3 flex-wrap">
                <div className="flex items-center gap-1"><Calendar size={11} /><span>{ev.date}</span></div>
                <span>·</span>
                <div className="flex items-center gap-1"><MapPin size={11} /><span>{ev.location}</span></div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {TALENTS.slice(0, 3).map(t => <img key={t.username} src={t.avatar} alt="" className="w-6 h-6 rounded-full border-2 border-[#0C2028] object-cover" />)}
                  </div>
                  <span className="text-xs text-[#5A8888]">{ev.attendees.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400">{ev.price}</span>
                  <motion.button whileTap={{ scale: 0.92 }}
                    onClick={() => { setRsvped(p => { const n = new Set(p); n.has(ev.id) ? n.delete(ev.id) : n.add(ev.id); return n; }); if (!rsvped.has(ev.id)) toast.success("RSVP confirmed!", { description: `Going to ${ev.title}` }); }}
                    className={`px-3 py-2 text-xs font-bold rounded-xl min-h-[40px] transition-all
                      ${rsvped.has(ev.id) ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/20" : "bg-[#00C27A] hover:bg-[#00AD6A] text-white"}`}>
                    {rsvped.has(ev.id) ? "Going ✓" : "RSVP"}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Right Panel ─────────────────────────────────────────────────────────────

function RightPanel({ onViewProfile }: { onViewProfile: () => void }) {
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  return (
    <aside className="w-72 flex-none border-l border-white/[0.05] overflow-y-auto p-5 space-y-5 scrollbar-hide">
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#011A12]/60 to-[#0C2028] border border-[#00C27A]/20 rounded-2xl p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <Zap size={12} className="text-[#00C27A]" />
          <span className="text-[10px] font-bold text-[#00C27A] tracking-widest">UPRYZIN SCORE</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <ScoreRing score={ME.score} size={72} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white"><AnimatedCounter value={ME.score} delay={0.4} /></span>
            </div>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{ME.name}</p>
            <p className="text-[#5A8888] text-xs mb-2">{ME.role.split(" & ")[0]}</p>
            <div className="flex items-center gap-1"><TrendingUp size={11} className="text-emerald-400" /><span className="text-xs text-emerald-400 font-medium">+23 this week</span></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/[0.06]">
          {([["Followers", fmtNum(ME.followers)], ["Following", fmtNum(ME.following)], ["Projects", ME.projects]] as const).map(([label, val]) => (
            <div key={label} className="text-center">
              <div className="text-white font-bold text-sm">{val}</div>
              <div className="text-[#5A8888] text-[10px]">{label}</div>
            </div>
          ))}
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onViewProfile}
          className="mt-3 w-full py-2 text-xs font-bold text-[#3DDEAA] bg-[#00C27A]/15 hover:bg-[#00C27A]/25 rounded-xl border border-[#00C27A]/20 min-h-[40px] transition-all">
          View My Profile
        </motion.button>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] font-bold text-white tracking-widest">SUGGESTED CREATORS</h3>
          <button className="text-[10px] text-[#00C27A] hover:text-[#3DDEAA] transition-colors">See all</button>
        </div>
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
          {SUGGESTED.map(c => (
            <motion.div key={c.username} variants={staggerItem} className="flex items-center gap-3">
              <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0 bg-[#0F2830]" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{c.name}</p>
                <p className="text-[11px] text-[#5A8888] truncate">{c.role}</p>
              </div>
              <div className="flex items-center gap-1 mr-1"><Zap size={9} className="text-[#00C27A]" /><span className="text-[11px] text-[#00C27A] font-bold">{c.score}</span></div>
              <motion.button whileTap={{ scale: 0.9 }}
                onClick={() => { setFollowed(p => { const n = new Set(p); n.has(c.username) ? n.delete(c.username) : n.add(c.username); return n; }); if (!followed.has(c.username)) toast(`Following ${c.name}`, { icon: "✨" }); }}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border min-h-[36px] transition-all
                  ${followed.has(c.username) ? "bg-[#00C27A]/30 text-[#3DDEAA] border-[#00C27A]/40" : "text-[#00C27A] bg-[#011A12]/60 border-[#00C27A]/20"}`}>
                {followed.has(c.username) ? "✓" : "Follow"}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] font-bold text-white tracking-widest">HOT OPPORTUNITIES</h3>
          <button className="text-[10px] text-[#00C27A] hover:text-[#3DDEAA] transition-colors">See all</button>
        </div>
        <div className="space-y-2.5">
          {OPPS.slice(0, 3).map(o => (
            <motion.div key={o.id} whileHover={{ x: 3 }} className="flex items-center gap-3 cursor-pointer group">
              <img src={o.logo} alt={o.company} className="w-8 h-8 rounded-lg object-cover flex-shrink-0 bg-[#0F2830]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate group-hover:text-[#3DDEAA] transition-colors">{o.title}</p>
                <p className="text-[10px] text-[#5A8888]">{o.company} · {o.type}</p>
              </div>
              <ChevronRight size={13} className="text-[#2A5555] group-hover:text-[#00C27A] flex-shrink-0 transition-colors" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </aside>
  );
}

// ─── Desktop Sidebar ─────────────────────────────────────────────────────────

function Sidebar({ view, setView, onSearch, onNotifications, onCreate }: {
  view: View; setView: (v: View) => void; onSearch: () => void; onNotifications: () => void; onCreate: () => void;
}) {
  return (
    <motion.aside initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }}
      className="w-56 flex-none border-r border-white/[0.05] flex flex-col overflow-y-auto scrollbar-hide bg-[#051418]">
      <div className="px-5 py-5 flex items-center gap-2.5">
        <LogoMark height={24} />
        <span className="text-base font-bold text-[#00C27A] tracking-widest" style={{ fontFamily: "'Clash Grotesk', 'DM Sans', sans-serif" }}>UPRYZIN</span>
      </div>
      <div className="px-4 mb-4">
        <motion.button onClick={onSearch}
          className="w-full flex items-center gap-2 bg-white/5 border border-white/[0.06] rounded-xl px-3 py-2.5 hover:border-[#00C27A]/30 min-h-[44px] transition-colors">
          <Search size={14} className="text-[#5A8888] flex-shrink-0" />
          <span className="text-sm text-[#5A8888]">Search...</span>
          <span className="ml-auto text-[10px] text-[#1A4050] font-mono">⌘K</span>
        </motion.button>
      </div>
      <nav className="px-3 flex-1 space-y-1">
        <NavItem icon={Home} label="Home" active={view === "feed"} onClick={() => setView("feed")} />
        <NavItem icon={Compass} label="Explore" active={view === "explore"} onClick={() => setView("explore")} />
        <NavItem icon={Briefcase} label="Opportunities" active={view === "opportunities"} onClick={() => setView("opportunities")} />
        <NavItem icon={Users} label="Collaborate" />
        <NavItem icon={Calendar} label="Events" active={view === "events"} onClick={() => setView("events")} />
        <NavItem icon={MessageSquare} label="Messages" active={view === "messages"} onClick={() => setView("messages")} badge={3} />
        <div className="my-3 h-px bg-white/[0.05]" />
        <NavItem icon={Award} label="My Profile" active={view === "profile"} onClick={() => setView("profile")} />
        <NavItem icon={Bell} label="Notifications" onClick={onNotifications} badge={7} />
        <NavItem icon={Settings} label="Settings" />
      </nav>
      <div className="p-4">
        <motion.button onClick={onCreate} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#00C27A] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#011A0F]/40 min-h-[44px] transition-colors">
          <Plus size={16} />Create
        </motion.button>
      </div>
      <div className="p-4 border-t border-white/[0.05]">
        <motion.div className="flex items-center gap-3 cursor-pointer rounded-xl p-1.5 -m-1.5 transition-colors hover:bg-white/[0.03]">
          <img src={ME.avatar} alt={ME.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{ME.name}</p>
            <div className="flex items-center gap-1"><Zap size={9} className="text-[#00C27A]" /><span className="text-[10px] text-[#00C27A] font-bold">{ME.score}</span></div>
          </div>
          <MoreHorizontal size={15} className="text-[#2A5555] hover:text-white cursor-pointer flex-shrink-0 transition-colors" />
        </motion.div>
      </div>
    </motion.aside>
  );
}

// ─── Main App Shell ───────────────────────────────────────────────────────────

function AppShell({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<View>("feed");
  const [showNotifs, setShowNotifs] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [commentPostId, setCommentPostId] = useState<number | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => { mainRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }, [view]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setShowSearch(true); }
      if (e.key === "Escape") { setShowNotifs(false); setShowCreate(false); setShowSearch(false); setCommentPostId(null); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const notifCount = NOTIFICATIONS.filter(n => n.unread).length;
  const msgCount = CONVERSATIONS.reduce((a, c) => a + c.unread, 0);
  const showRightPanel = view === "feed" && !isMobile;
  const panelOpen = showNotifs || commentPostId !== null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-none">
        <Sidebar view={view} setView={setView}
          onSearch={() => setShowSearch(true)}
          onNotifications={() => setShowNotifs(p => !p)}
          onCreate={() => setShowCreate(true)} />
      </div>

      {/* Center column */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="lg:hidden">
          <MobileTopBar
            onSearch={() => setShowSearch(true)}
            onNotifications={() => setShowNotifs(p => !p)}
            onMessages={() => setView("messages")}
            notifCount={notifCount} msgCount={msgCount} />
        </div>
        <main ref={mainRef} className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
          <div className="pb-24 lg:pb-0">
            <AnimatePresence mode="wait">
              {view === "feed" && <FeedView key="feed" onOpenComments={setCommentPostId} />}
              {view === "explore" && <ExploreView key="explore" onOpenComments={setCommentPostId} />}
              {view === "opportunities" && <OpportunitiesView key="opportunities" />}
              {view === "profile" && <ProfileView key="profile" onLogout={onLogout} />}
              {view === "messages" && <MessagesView key="messages" />}
              {view === "events" && <EventsView key="events" />}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Desktop right panel */}
      {showRightPanel && !panelOpen && (
        <div className="hidden lg:flex flex-none">
          <RightPanel onViewProfile={() => setView("profile")} />
        </div>
      )}

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40">
        <BottomNavBar view={view} setView={setView} onCreate={() => setShowCreate(true)} />
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {showNotifs && (
          <>
            <motion.div variants={backdropVars} initial="initial" animate="animate" exit="exit"
              className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowNotifs(false)} />
            <NotificationsPanel onClose={() => setShowNotifs(false)} isMobile={isMobile} />
          </>
        )}
        {commentPostId !== null && (
          <>
            <motion.div variants={backdropVars} initial="initial" animate="animate" exit="exit"
              className="fixed inset-0 bg-black/50 z-40" onClick={() => setCommentPostId(null)} />
            <CommentsPanel onClose={() => setCommentPostId(null)} isMobile={isMobile} />
          </>
        )}
        {showCreate && <CreateModal onClose={() => setShowCreate(false)} isMobile={isMobile} />}
        {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
      </AnimatePresence>
    </div>
  );
}

// ─── Logo components using the actual Upryzin brand image ────────────────────

// The source image (app_icon.png.jpeg) is a square lockup.
// The R mark occupies approx x:22%-78%, y:15%-52% of the image.
// The "UPRYZIN" wordmark is at approx y:52%-68%.
// The image background matches our app background (#07191E) so it blends seamlessly.

// logo.jpg is 769×1080 (portrait). R mark occupies ~x:30–70%, y:25–48%.
const IMG_W_PX = 769;
const IMG_H_PX = 1080;
const LOGO_MARK_FRACS = { x1: 0.30, y1: 0.25, x2: 0.70, y2: 0.48 };

// Small R-mark-only crop for use in headers and nav
function LogoMark({ height = 26 }: { height?: number }) {
  const frac = LOGO_MARK_FRACS;
  const markH = frac.y2 - frac.y1;
  const markW = frac.x2 - frac.x1;
  const imgH = height / markH;
  const imgW = imgH * (IMG_W_PX / IMG_H_PX); // correct for portrait aspect ratio
  const w = Math.round(markW * imgW);

  return (
    <div style={{ width: w, height, overflow: "hidden", position: "relative", flexShrink: 0 }}>
      <img
        src={logoSrc}
        style={{
          position: "absolute",
          width: imgW,
          height: imgH,
          top: -frac.y1 * imgH,
          left: -frac.x1 * imgW,
          display: "block",
        }}
        alt="Upryzin"
      />
    </div>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");

  return (
    <div className="min-h-screen bg-[#07191E]">
      <Toaster theme="dark" position="bottom-right"
        toastOptions={{ style: { background: "#0A1E24", border: "1px solid rgba(2,245,161,0.12)", color: "#F7F7F7" } }} />
      <AnimatePresence mode="wait">
        {screen === "login" && (
          <LoginScreen key="login"
            onLogin={() => setScreen("app")}
            onGoSignup={() => setScreen("signup")} />
        )}
        {screen === "signup" && (
          <SignupScreen key="signup"
            onSignup={() => setScreen("app")}
            onGoLogin={() => setScreen("login")} />
        )}
        {screen === "app" && (
          <motion.div key="app" className="h-screen"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <AppShell onLogout={() => setScreen("login")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
