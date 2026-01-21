
export interface User {
  id: string;
  username: string;
  display_name: string;
  email: string;
  bio: string;
  avatar: string;
  verified: boolean;
  private: boolean;
  followers_count: number;
  following_count: number;
  likes_count: number;
  videos_count: number;
  balance: number;
  ad_revenue: number;
  is_creator: boolean;
}

export type VideoFilter = 'none' | 'sepia' | 'grayscale' | 'contrast' | 'hue-rotate' | 'invert';

export interface LiveChatMessage {
  id: string;
  user_id: string;
  username: string;
  avatar: string;
  text: string;
  type: 'chat' | 'system' | 'gift';
  timestamp: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  total_earnings: number;
  ad_revenue: number;
  creator_fund_earnings: number;
  tips_received: number;
  withdrawn_amount: number;
  currency: string;
}

export type TransactionType = 'earning' | 'withdrawal' | 'tip_sent' | 'tip_received' | 'brand_partnership';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  wallet_id: string;
  type: TransactionType;
  amount: number;
  method: string;
  details?: string;
  reference_id?: string;
  status: TransactionStatus;
  created_at: string;
  processed_at?: string;
}

export type DuetLayoutType = 'left-right' | 'top-bottom' | 'picture-in-picture' | 'react' | 'stitch';

export interface Duet {
  id: string;
  original_video_id: string;
  duet_video_id: string;
  user_id: string;
  layout_type: DuetLayoutType;
  status: 'pending' | 'active' | 'archived' | 'failed';
  original_video?: Video;
  duet_video?: Video;
  user?: User;
}

export interface Stitch {
  id: string;
  original_video_id: string;
  user_id: string;
  start_time: number;
  end_time: number;
  status: 'pending' | 'complete';
}

export interface Music {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  audio_url: string;
  cover_url: string;
  genre: string;
  plays_count: number;
  likes_count: number;
  used_in_videos: number;
  is_original: boolean;
  user_id?: string;
  status: 'active' | 'inactive';
  original_video_id?: string;
}

export interface Video {
  id: string;
  user_id: string;
  user: User;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  views: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  hashtags: string[];
  music_id?: string;
  music?: Music;
  music_title: string;
  music_artist: string;
  privacy: 'public' | 'private' | 'friends';
  allow_comments: boolean;
  allow_duet: boolean;
  allow_stitch: boolean;
  status: 'published' | 'draft' | 'under_review';
  is_liked_by_user?: boolean;
  created_at: string;
  is_duet?: boolean;
  is_stitch?: boolean;
  duet_id?: string;
  stitch_id?: string;
  duet_data?: {
    original_video_id: string;
  };
}

export interface Comment {
  id: string;
  user_id: string;
  user: User;
  video_id: string;
  content: string;
  likes_count: number;
  created_at: string;
}

export type MessageType = 'text' | 'image' | 'video' | 'post_share';

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  type: MessageType;
  media_url?: string;
  is_read: boolean;
  read_at?: string;
  conversation_id: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  last_message_id?: string;
  unread_count_user1: number;
  unread_count_user2: number;
  last_message?: Message;
  partner?: User;
}

export type ReportContentType = 'video' | 'comment' | 'user';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reported_content_id: string;
  content_type: ReportContentType;
  reason: string;
  description?: string;
  status: ReportStatus;
  moderated_by?: string;
  moderated_at?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  from_user_id: string;
  from_user?: User;
  type: 'like' | 'comment' | 'follow' | 'mention';
  data: any;
  read: boolean;
  created_at: string;
}

export interface UserAnalytics {
  profile_views: number;
  video_views: number;
  likes_received: number;
  followers_gained: number;
  engagement_rate: number;
  top_videos: Video[];
  audience_demographics: {
    countries: { country: string; percentage: number }[];
    gender: { male: number; female: number; other: number };
  };
}

export interface VideoAnalytics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  completion_rate: number;
  engagement_rate: number;
  top_countries: string[];
  peak_viewing_times: string[];
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface AccountSecurity {
  risk_level: RiskLevel;
  safety_score: number;
  suspicious_patterns: string[];
  last_check: string;
  bot_probability: number;
}
