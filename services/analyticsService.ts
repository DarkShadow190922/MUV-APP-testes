
import { Video, UserAnalytics, VideoAnalytics } from '../types';
import { mockVideos, currentUser } from './mockData';

/**
 * SIMULATED REDIS STORE FOR ANALYTICS
 */
const simulatedRedis = new Map<string, any>();

export const AnalyticsService = {
  /**
   * Mirrors PHP AnalyticsService::trackVideoView
   */
  trackVideoView: (videoId: string, userId: string | null = null, sessionId: string | null = null) => {
    const video = mockVideos.find(v => v.id === videoId);
    if (!video) return;

    // Increment views (Mock update)
    video.views += 1;

    AnalyticsService.trackEvent('video_view', {
      video_id: videoId,
      user_id: userId,
      session_id: sessionId,
      timestamp: new Date().toISOString()
    });

    if (userId) {
      AnalyticsService.trackUserEngagement(userId, 'view', videoId);
    }
    console.log(`[Analytics] View tracked for video: ${videoId}`);
  },

  /**
   * Mirrors PHP AnalyticsService::trackVideoLike
   */
  trackVideoLike: (videoId: string, userId: string) => {
    AnalyticsService.trackEvent('video_like', {
      video_id: videoId,
      user_id: userId,
      timestamp: new Date().toISOString()
    });

    AnalyticsService.trackUserEngagement(userId, 'like', videoId);
    console.log(`[Analytics] Like tracked for video: ${videoId}`);
  },

  /**
   * Mirrors PHP AnalyticsService::trackVideoShare
   */
  trackVideoShare: (videoId: string, userId: string, platform: string) => {
    AnalyticsService.trackEvent('video_share', {
      video_id: videoId,
      user_id: userId,
      platform: platform,
      timestamp: new Date().toISOString()
    });

    AnalyticsService.trackUserEngagement(userId, 'share', videoId);
    console.log(`[Analytics] Share tracked to platform ${platform} for video: ${videoId}`);
  },

  /**
   * Mirrors PHP AnalyticsService::trackVideoCompletion
   */
  trackVideoCompletion: (videoId: string, userId: string | null, completionRate: number) => {
    AnalyticsService.trackEvent('video_completion', {
      video_id: videoId,
      user_id: userId,
      completion_rate: completionRate,
      timestamp: new Date().toISOString()
    });
    console.log(`[Analytics] Completion rate ${completionRate}% tracked for video: ${videoId}`);
  },

  /**
   * Mirrors PHP AnalyticsService::getUserAnalytics
   */
  getUserAnalytics: (userId: string, period: '7d' | '30d' | '90d' = '30d'): UserAnalytics => {
    // Simulated aggregation logic
    const userVideos = mockVideos.filter(v => v.user_id === userId);
    const totalViews = userVideos.reduce((sum, v) => sum + v.views, 0);
    const totalLikes = userVideos.reduce((sum, v) => sum + v.likes_count, 0);

    return {
      profile_views: Math.floor(totalViews * 0.15),
      video_views: totalViews,
      likes_received: totalLikes,
      followers_gained: Math.floor(totalViews * 0.05),
      engagement_rate: totalViews > 0 ? (totalLikes / totalViews) * 100 : 0,
      top_videos: [...userVideos].sort((a, b) => b.views - a.views).slice(0, 5),
      audience_demographics: {
        countries: [
          { country: 'United States', percentage: 45 },
          { country: 'Brazil', percentage: 20 },
          { country: 'United Kingdom', percentage: 15 },
          { country: 'Germany', percentage: 10 },
          { country: 'Japan', percentage: 10 }
        ],
        gender: { male: 42, female: 55, other: 3 }
      }
    };
  },

  /**
   * Mirrors PHP AnalyticsService::getVideoAnalytics
   */
  getVideoAnalytics: (videoId: string): VideoAnalytics | null => {
    const video = mockVideos.find(v => v.id === videoId);
    if (!video) return null;

    return {
      views: video.views,
      likes: video.likes_count,
      comments: video.comments_count,
      shares: video.shares_count,
      completion_rate: 68.5,
      engagement_rate: (video.likes_count / video.views) * 100,
      top_countries: ['US', 'BR', 'UK'],
      peak_viewing_times: ['18:00', '21:00', '08:00']
    };
  },

  /**
   * Private Mirror: trackEvent
   */
  trackEvent: (eventType: string, data: any) => {
    const today = new Date().toISOString().split('T')[0];
    const counterKey = `analytics:${eventType}:${today}`;
    const listKey = `events:${eventType}`;

    // Increment simulated Redis counter
    const currentCount = simulatedRedis.get(counterKey) || 0;
    simulatedRedis.set(counterKey, currentCount + 1);

    // Push to simulated Redis list
    const events = simulatedRedis.get(listKey) || [];
    events.unshift(data);
    simulatedRedis.set(listKey, events.slice(0, 1000)); // Keep last 1000
  },

  /**
   * Private Mirror: trackUserEngagement
   */
  trackUserEngagement: (userId: string, action: string, targetId: string) => {
    const key = `user_engagement:${userId}`;
    const data = {
      action,
      target_id: targetId,
      timestamp: new Date().toISOString()
    };

    const engagements = simulatedRedis.get(key) || [];
    engagements.unshift(data);
    simulatedRedis.set(key, engagements.slice(0, 1000));
  }
};
