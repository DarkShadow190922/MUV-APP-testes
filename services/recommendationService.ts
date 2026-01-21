
import { Video, User } from '../types';
import { mockVideos } from './mockData';

/**
 * SIMULATED REDIS STORE
 */
const simulatedRedis = new Map<string, string>();

interface UserProfile {
  user_id: string;
  interests: Record<string, number>;
  activity_score: number;
  following_count: number;
  follower_count: number;
}

/**
 * Categorizes a video based on keywords found in title/description
 * Mirroring the categorizeVideo logic from PHP service.
 */
const categorizeVideo = (video: Video): string => {
  const keywords = ['dance', 'music', 'funny', 'tutorial', 'food', 'travel', 'beauty'];
  const content = `${video.title} ${video.description}`.toLowerCase();
  
  for (const keyword of keywords) {
    if (content.includes(keyword)) return keyword;
  }
  return 'general';
};

/**
 * Tracks and stores user interests in the simulated Redis cache.
 * Mirroring calculateInterestScore and updateUserInterests from PHP.
 */
export const trackInteraction = (userId: string, video: Video, type: 'view' | 'like' | 'comment' | 'share' | 'follow') => {
  const profile = getUserProfile(userId);
  
  const scores = {
    view: 1,
    like: 3,
    comment: 5,
    share: 4,
    follow: 10
  };
  
  const weight = scores[type] || 1;
  const category = categorizeVideo(video);
  
  // Update interest scores for hashtags
  video.hashtags.forEach(tag => {
    profile.interests[tag] = (profile.interests[tag] || 0) + weight;
  });
  
  // Update interest score for category
  profile.interests[category] = (profile.interests[category] || 0) + (weight * 1.5);
  
  // Update creator affinity
  const creatorKey = `creator_${video.user_id}`;
  profile.interests[creatorKey] = (profile.interests[creatorKey] || 0) + weight;

  // Track seen status
  if (type === 'view') {
    const seenKey = `seen_videos:${userId}`;
    const seen = JSON.parse(simulatedRedis.get(seenKey) || '[]');
    if (!seen.includes(video.id)) {
      seen.push(video.id);
      simulatedRedis.set(seenKey, JSON.stringify(seen.slice(-200))); // Keep last 200
    }
  }

  // Persist updated profile
  simulatedRedis.set(`user_profile:${userId}`, JSON.stringify(profile));
  console.log(`[AI Engine] Interaction ${type} recorded. Profile updated.`, profile.interests);
};

/**
 * Retrieves the user profile from simulated Redis or creates a fresh one.
 */
const getUserProfile = (userId: string): UserProfile => {
  const cacheKey = `user_profile:${userId}`;
  const cached = simulatedRedis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const freshProfile: UserProfile = {
    user_id: userId,
    interests: {},
    activity_score: 0,
    following_count: 0,
    follower_count: 0
  };
  simulatedRedis.set(cacheKey, JSON.stringify(freshProfile));
  return freshProfile;
};

/**
 * Calculates a complex ranking score for a video relative to a user.
 * Weights derived from the PHP rankVideos/calculateVideoScore methods:
 * - Engagement (30%)
 * - Interests (25%)
 * - Creator Popularity (20%)
 * - Recency (15%)
 * - Exploration/Seen Status (10%)
 */
const calculateVideoScore = (video: Video, profile: UserProfile): number => {
  // 1. Engagement Score (normalized)
  const engagementVal = (video.likes_count * 1) + (video.comments_count * 2) + (video.shares_count * 3);
  const engagementScore = Math.min(engagementVal / 100000, 1) * 100;

  // 2. Interest Score
  let interestVal = 0;
  const category = categorizeVideo(video);
  interestVal += (profile.interests[category] || 0);
  video.hashtags.forEach(tag => {
    interestVal += (profile.interests[tag] || 0);
  });
  interestVal += (profile.interests[`creator_${video.user_id}`] || 0);
  const interestScore = Math.min(interestVal / 50, 1) * 100;

  // 3. Creator Score
  const creator = video.user;
  const creatorVal = (creator.followers_count / 1000) + (creator.likes_count / 10000);
  const creatorScore = Math.min(creatorVal / 100, 1) * 100;

  // 4. Recency Score (Freshness)
  const createdDate = new Date(video.created_at);
  const hoursDiff = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60);
  const recencyScore = Math.max(0, 24 - hoursDiff) * (100 / 24); // 0 to 100 scale

  // 5. Exploration Score (Seen status)
  const seenKey = `seen_videos:${profile.user_id}`;
  const seenVideos = JSON.parse(simulatedRedis.get(seenKey) || '[]');
  const explorationScore = seenVideos.includes(video.id) ? 0 : 100;

  // Weighted Combine
  return (engagementScore * 0.3) + 
         (interestScore * 0.25) + 
         (creatorScore * 0.2) + 
         (recencyScore * 0.15) + 
         (explorationScore * 0.1);
};

/**
 * Public API to fetch the "For You" feed.
 * Implements the combining of trending/interests and ranking from the PHP service.
 */
export const getForYouFeed = (userId: string, limit = 20): (Video & { recommendation_reason: string })[] => {
  const profile = getUserProfile(userId);
  
  return mockVideos.map(video => {
    const score = calculateVideoScore(video, profile);
    
    // Logic for generating a friendly reason based on the top contributing factors
    let reason = 'For You';
    const category = categorizeVideo(video);
    
    if (profile.interests[category] > 10) reason = `✨ Because you like ${category}`;
    else if (profile.interests[`creator_${video.user_id}`] > 15) reason = `👤 More from @${video.user.username}`;
    else if (score > 60) reason = '🔥 Trending on Lynx';
    else if (score > 30) reason = '🆕 Suggested for you';

    return {
      ...video,
      recommendation_score: score,
      recommendation_reason: reason
    };
  }).sort((a, b) => (b as any).recommendation_score - (a as any).recommendation_score)
    .slice(0, limit);
};

/**
 * Public API for trending topics display
 */
export const getTrendingTopics = () => [
  { name: 'dance', views: '1.2B' },
  { name: 'cooking', views: '850M' },
  { name: 'fitness', views: '420M' },
  { name: 'gaming', views: '2.1B' },
  { name: 'tech', views: '120M' },
  { name: 'travel', views: '95M' },
];

/**
 * Helper to get current interests for UI display (ProfileView)
 */
export const getUserInterests = (userId: string) => {
  const profile = getUserProfile(userId);
  const entries = Object.entries(profile.interests)
    .filter(([key]) => !key.startsWith('creator_'))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (entries.length === 0) {
    return [
      { name: 'Discovering', weight: 100, color: 'bg-[#fe2c55]' }
    ];
  }

  const maxVal = Math.max(...entries.map(e => e[1]));
  return entries.map(([name, weight], idx) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];
    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      weight: Math.round((weight / maxVal) * 100),
      color: colors[idx % colors.length]
    };
  });
};
