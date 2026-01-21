
import { Video, Stitch } from '../types';
import { mockVideos, currentUser } from './mockData';

const stitchTable = new Map<string, Stitch>();

export const StitchService = {
  canStitch: (video: Video): { allowed: boolean; error?: string } => {
    if (!video.allow_stitch) {
      return { allowed: false, error: 'This video does not allow stitching' };
    }
    return { allowed: true };
  },

  createStitchRecord: (originalVideoId: string, startTime: number, endTime: number): string => {
    const stitchId = `stitch_${Math.random().toString(36).substr(2, 9)}`;
    const newStitch: Stitch = {
      id: stitchId,
      original_video_id: originalVideoId,
      user_id: currentUser.id,
      start_time: startTime,
      end_time: endTime,
      status: 'pending'
    };
    stitchTable.set(stitchId, newStitch);
    return stitchId;
  },

  finalizeStitch: (stitchId: string, caption: string): Video | null => {
    const stitch = stitchTable.get(stitchId);
    if (!stitch) return null;
    
    const original = mockVideos.find(v => v.id === stitch.original_video_id);
    if (!original) return null;

    const newVideoId = `v_stitch_${stitchId}`;
    const newVideo: Video = {
      ...original,
      id: newVideoId,
      user_id: currentUser.id,
      user: currentUser,
      title: caption,
      description: caption,
      views: 0,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      status: 'published',
      created_at: new Date().toISOString(),
      is_stitch: true,
      stitch_id: stitchId,
      allow_comments: true,
      allow_duet: true,
      allow_stitch: true,
      privacy: 'public'
    };

    mockVideos.unshift(newVideo);
    stitch.status = 'complete';
    stitchTable.set(stitchId, stitch);
    
    return newVideo;
  }
};
