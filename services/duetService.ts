
import { Video, Duet, DuetLayoutType, Notification } from '../types';
import { mockVideos, currentUser } from './mockData';

/**
 * SIMULATED DB TABLE: duets
 */
const duetTable = new Map<string, Duet>();

export const DuetService = {
  /**
   * Mirrors PHP logic: Verifies if a video allows duets.
   */
  canDuet: (video: Video): { allowed: boolean; error?: string } => {
    if (!video.allow_duet) {
      return { allowed: false, error: 'This video does not allow duets' };
    }
    return { allowed: true };
  },

  /**
   * Mirrors createDuet initialization in PHP.
   * Creates the pivot record with 'pending' status.
   */
  createDuetRecord: (originalVideo: Video, layout: DuetLayoutType): string => {
    const duetId = `duet_${Math.random().toString(36).substr(2, 9)}`;
    const newDuet: Duet = {
      id: duetId,
      original_video_id: originalVideo.id,
      duet_video_id: '', // Will be updated on finalization
      user_id: currentUser.id,
      layout_type: layout,
      status: 'pending',
      original_video: originalVideo,
      user: currentUser
    };
    duetTable.set(duetId, newDuet);
    return duetId;
  },

  /**
   * Simulates the $this->videoProcessingService->processVideo call in PHP.
   */
  processVideoComposition: async (duetId: string): Promise<boolean> => {
    const duet = duetTable.get(duetId);
    if (!duet) return false;

    console.log(`[FFMPEG] Duet Processing Service for ${duetId}...`);
    
    // Simulate FFMpeg processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    duet.status = 'active';
    duetTable.set(duetId, duet);
    return true;
  },

  /**
   * Finalizes the duet by creating the Video record and updating the Duet pivot.
   * Mirroring the final step of a multi-model transaction.
   */
  finalizeDuet: (duetId: string, caption: string): Video | null => {
    const duet = duetTable.get(duetId);
    if (!duet || !duet.original_video) return null;

    const newVideoId = `v_duet_${duetId}`;
    
    // 1. Create the new Video model instance
    const newVideo: Video = {
      id: newVideoId,
      user_id: currentUser.id,
      user: currentUser,
      title: caption,
      description: caption,
      video_url: duet.original_video.video_url, // Mocked composite
      thumbnail_url: duet.original_video.thumbnail_url,
      duration: duet.original_video.duration,
      views: 0,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      hashtags: ['duet', 'lynx'],
      music_title: duet.original_video.music_title,
      music_artist: duet.original_video.music_artist,
      privacy: 'public',
      // Fix: Missing required allow_comments property
      allow_comments: true,
      allow_duet: true,
      allow_stitch: true,
      status: 'published',
      created_at: new Date().toISOString(),
      is_duet: true,
      duet_id: duet.id,
      // Include duet_data to store original video reference for duets
      duet_data: {
        original_video_id: duet.original_video_id
      }
    };

    // 2. Update the Duet pivot model (duet_video_id)
    duet.duet_video_id = newVideoId;
    duet.status = 'active';
    duetTable.set(duetId, duet);

    // 3. Persist to video feed
    mockVideos.unshift(newVideo);
    
    return newVideo;
  },

  /**
   * Relationship lookup helper
   */
  getOriginalVideo: (videoId: string): Video | undefined => {
    const video = mockVideos.find(v => v.id === videoId);
    if (video?.is_duet && video.duet_id) {
      const duet = duetTable.get(video.duet_id);
      if (duet) return duet.original_video;
      // Fallback for mock data without explicit duetTable entries
      return mockVideos.find(v => v.id === 'v1');
    }
    return undefined;
  }
};
