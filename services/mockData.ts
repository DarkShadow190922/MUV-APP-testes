
import { User, Video, Notification, Music, Comment, Message, Conversation, Wallet, Transaction } from '../types';

export const currentUser: User = {
  id: 'u1',
  username: 'lynx_dev',
  display_name: 'Lynx Official',
  email: 'dev@lynx.com',
  bio: 'Building the future of short-form video 🚀',
  avatar: 'https://picsum.photos/seed/lynx/200',
  verified: true,
  private: false,
  followers_count: 12500,
  following_count: 180,
  likes_count: 85400,
  videos_count: 12,
  balance: 450.75,
  ad_revenue: 120.30,
  is_creator: true
};

export const mockWallet: Wallet = {
  id: 'w1',
  user_id: 'u1',
  balance: 450.75,
  total_earnings: 580.75,
  ad_revenue: 120.30,
  creator_fund_earnings: 130.00,
  tips_received: 330.45,
  withdrawn_amount: 130.00,
  currency: 'USD'
};

export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    wallet_id: 'w1',
    type: 'earning',
    amount: 25.00,
    method: 'tips',
    status: 'completed',
    reference_id: 'REF_TIPS_001',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    processed_at: new Date(Date.now() - 1000 * 60 * 60 * 1.9).toISOString()
  },
  {
    id: 't2',
    wallet_id: 'w1',
    type: 'earning',
    amount: 12.50,
    method: 'ad',
    status: 'completed',
    reference_id: 'REF_ADS_992',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    processed_at: new Date(Date.now() - 1000 * 60 * 60 * 23.8).toISOString()
  },
  {
    id: 't3',
    wallet_id: 'w1',
    type: 'withdrawal',
    amount: 100.00,
    method: 'PayPal',
    details: '{"email":"lynx_payouts@gmail.com"}',
    reference_id: 'PP_WD_5521',
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    processed_at: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString()
  }
];

export const mockMusic: Music[] = [
  {
    id: 'm1',
    title: 'Neon Nights',
    artist: 'Synthwave Joe',
    album: 'Retro Future',
    duration: 15,
    genre: 'EDM',
    plays_count: 1250000,
    likes_count: 45000,
    used_in_videos: 120000,
    cover_url: 'https://picsum.photos/seed/music1/100',
    audio_url: '#',
    is_original: false,
    status: 'active'
  },
  {
    id: 'm2',
    title: 'Morning Chill',
    artist: 'Lofi Girl',
    album: 'Coffee Shop Vibes',
    duration: 30,
    genre: 'Lofi',
    plays_count: 4200000,
    likes_count: 890000,
    used_in_videos: 850000,
    cover_url: 'https://picsum.photos/seed/music2/100',
    audio_url: '#',
    is_original: false,
    status: 'active'
  }
];

export const users: User[] = [
  {
    id: 'u2',
    username: 'travel_junkie',
    display_name: 'Sarah Wanderer',
    email: 'sarah@example.com',
    bio: 'Exploring the world one pixel at a time 🌎',
    avatar: 'https://picsum.photos/seed/travel/200',
    verified: false,
    private: false,
    followers_count: 45000,
    following_count: 450,
    likes_count: 230000,
    videos_count: 85,
    balance: 10.0,
    ad_revenue: 5.0,
    is_creator: true
  },
  {
    id: 'u3',
    username: 'chef_mario',
    display_name: 'Chef Mario',
    email: 'mario@pasta.it',
    bio: 'Authentic Italian recipes for home cooks 🍝',
    avatar: 'https://picsum.photos/seed/chef/200',
    verified: true,
    private: false,
    followers_count: 120000,
    following_count: 120,
    likes_count: 1200000,
    videos_count: 340,
    balance: 1500.0,
    ad_revenue: 400.0,
    is_creator: true
  }
];

const now = new Date();

export const mockVideos: Video[] = [
  {
    id: 'v_duet_sample',
    user_id: 'u1',
    user: currentUser,
    title: 'Reacting to Bali sunrise! #duet',
    description: 'This sunrise is actually insane. Duet with @travel_junkie',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-landscape-of-mountains-and-lakes-2646-large.mp4',
    thumbnail_url: 'https://picsum.photos/seed/duet1/400/800',
    duration: 15,
    views: 5200,
    likes_count: 450,
    comments_count: 22,
    shares_count: 5,
    hashtags: ['duet', 'bali', 'travel'],
    music_title: 'Morning Chill',
    music_artist: 'Lofi Girl',
    privacy: 'public',
    // Fix: Missing required allow_comments property
    allow_comments: true,
    allow_duet: true,
    allow_stitch: true,
    status: 'published',
    is_duet: true,
    duet_data: {
      original_video_id: 'v1'
    },
    created_at: new Date(now.getTime() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 'v1',
    user_id: 'u2',
    user: users[0],
    title: 'Morning in Bali',
    description: 'Look at this amazing sunrise! #bali #travel #sunrise',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-landscape-of-mountains-and-lakes-2646-large.mp4',
    thumbnail_url: 'https://picsum.photos/seed/v1/400/800',
    duration: 15,
    views: 125000,
    likes_count: 8500,
    comments_count: 124,
    shares_count: 45,
    hashtags: ['bali', 'travel', 'sunrise'],
    music_id: 'm2',
    music_title: 'Morning Chill',
    music_artist: 'Lofi Girl',
    privacy: 'public',
    // Fix: Missing required allow_comments property
    allow_comments: true,
    allow_duet: true,
    allow_stitch: true,
    status: 'published',
    created_at: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 'v2',
    user_id: 'u3',
    user: users[1],
    title: 'Secret Pasta Sauce',
    description: 'The one ingredient you are missing... #cooking #chef #pasta',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-cutting-vegetables-for-a-salad-4241-large.mp4',
    thumbnail_url: 'https://picsum.photos/seed/v2/400/800',
    duration: 60,
    views: 890000,
    likes_count: 145000,
    comments_count: 3200,
    shares_count: 12000,
    hashtags: ['cooking', 'chef', 'pasta'],
    music_title: 'Italian Mambo',
    music_artist: 'Classic Sounds',
    privacy: 'public',
    // Fix: Missing required allow_comments property
    allow_comments: true,
    allow_duet: true,
    allow_stitch: true,
    status: 'published',
    created_at: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString()
  }
];

export const mockComments: Comment[] = [
  {
    id: 'c1',
    user_id: 'u1',
    user: currentUser,
    video_id: 'v1',
    content: 'Wow, Bali looks incredible! Added to my bucket list.',
    likes_count: 45,
    created_at: '2 hours ago'
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg1',
    sender_id: 'u2',
    recipient_id: 'u1',
    content: 'Hey! Would love to collab on a travel video.',
    type: 'text',
    is_read: false,
    conversation_id: 'conv_u1_u2',
    created_at: '10:30 AM'
  },
  {
    id: 'msg2',
    sender_id: 'u1',
    recipient_id: 'u2',
    content: 'That sounds like a plan! Where were you thinking?',
    type: 'text',
    is_read: true,
    conversation_id: 'conv_u1_u2',
    created_at: '10:32 AM'
  },
  {
    id: 'msg3',
    sender_id: 'u3',
    recipient_id: 'u1',
    content: 'Check out this pasta recipe!',
    type: 'text',
    is_read: false,
    conversation_id: 'conv_u1_u3',
    created_at: 'Yesterday'
  }
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv_u1_u2',
    user1_id: 'u1',
    user2_id: 'u2',
    last_message_id: 'msg2',
    unread_count_user1: 1, // msg1 is unread by u1
    unread_count_user2: 0,
  },
  {
    id: 'conv_u1_u3',
    user1_id: 'u1',
    user2_id: 'u3',
    last_message_id: 'msg3',
    unread_count_user1: 1, // msg3 is unread by u1
    unread_count_user2: 0,
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'ntf1',
    user_id: 'u1',
    from_user_id: 'u2',
    from_user: users[0],
    type: 'like',
    data: { video_id: 'v_duet_sample' },
    read: false,
    created_at: new Date(now.getTime() - 1000 * 60 * 5).toISOString()
  }
];
