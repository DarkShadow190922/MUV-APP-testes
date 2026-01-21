
import { Music, Video } from '../types';
import { mockMusic, mockVideos, currentUser } from './mockData';

/**
 * SIMULATED DB/REDIS STORE FOR MUSIC
 */
const musicStore = new Map<string, Music>(mockMusic.map(m => [m.id, m]));

export const MusicService = {
  /**
   * Mirrors MusicService::uploadMusic
   * Simulates audio file processing and metadata storage.
   */
  uploadMusic: async (metadata: Partial<Music>): Promise<Music> => {
    console.log(`[FFMPEG] Processing audio upload for: ${metadata.title}`);
    
    // Simulate FFMpeg processing (bitrate check, normalization)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newMusic: Music = {
      id: `m_${Math.random().toString(36).substr(2, 9)}`,
      title: metadata.title || 'Untitled',
      artist: metadata.artist || currentUser.display_name,
      album: metadata.album || '',
      genre: metadata.genre || 'General',
      duration: metadata.duration || 15, // Extracted via ffprobe in reality
      audio_url: '#',
      cover_url: metadata.cover_url || 'https://picsum.photos/seed/default/400/400',
      plays_count: 0,
      likes_count: 0,
      used_in_videos: 0,
      is_original: true,
      user_id: currentUser.id,
      status: 'active'
    };

    musicStore.set(newMusic.id, newMusic);
    // Add to mockMusic for global visibility in this demo
    mockMusic.push(newMusic);
    
    return newMusic;
  },

  /**
   * Mirrors MusicService::createSoundFromVideo
   * Extracts a segment of audio from an existing video.
   */
  createSoundFromVideo: async (videoId: string, startTime: number = 0, duration: number = 15): Promise<Music> => {
    const video = mockVideos.find(v => v.id === videoId);
    if (!video) throw new Error('Video not found');

    console.log(`[FFMPEG] Extracting ${duration}s audio from video ${videoId} at ${startTime}s`);
    
    // Simulate FFMpeg clipping and transcoding
    await new Promise(resolve => setTimeout(resolve, 3000));

    const extractedMusic: Music = {
      id: `m_ext_${videoId}_${Date.now()}`,
      title: `Sound from ${video.title.substring(0, 30)}...`,
      artist: video.user.display_name,
      duration: duration,
      audio_url: '#',
      cover_url: video.thumbnail_url,
      user_id: video.user_id,
      plays_count: 0,
      likes_count: 0,
      used_in_videos: 0,
      is_original: false,
      status: 'active',
      original_video_id: videoId,
      genre: 'Original'
    };

    musicStore.set(extractedMusic.id, extractedMusic);
    mockMusic.push(extractedMusic);

    return extractedMusic;
  },

  /**
   * Mirrors MusicService::getTrendingSounds
   */
  getTrendingSounds: (limit: number = 20): Music[] => {
    return Array.from(musicStore.values())
      .filter(m => m.status === 'active')
      .sort((a, b) => b.plays_count - a.plays_count)
      .slice(0, limit);
  },

  /**
   * Mirrors MusicService::searchMusic
   */
  searchMusic: (query: string, limit: number = 20): Music[] => {
    const q = query.toLowerCase();
    return Array.from(musicStore.values())
      .filter(m => 
        m.status === 'active' && 
        (m.title.toLowerCase().includes(q) || 
         m.artist.toLowerCase().includes(q) || 
         (m.album && m.album.toLowerCase().includes(q)))
      )
      .sort((a, b) => b.plays_count - a.plays_count)
      .slice(0, limit);
  },

  /**
   * Mirrors MusicService::incrementPlays
   */
  incrementPlays: (musicId: string): number => {
    const music = musicStore.get(musicId);
    if (music) {
      music.plays_count += 1;
      return music.plays_count;
    }
    return 0;
  },

  /**
   * Mirrors MusicService::incrementUsage
   */
  incrementUsage: (musicId: string): number => {
    const music = musicStore.get(musicId);
    if (music) {
      music.used_in_videos += 1;
      return music.used_in_videos;
    }
    return 0;
  }
};
