
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Music, Share2, Bookmark, CheckCircle2, ChevronLeft, Link as LinkIcon, Headphones, Radio, Clock, Heart } from 'lucide-react';
import { mockMusic, mockVideos } from '../services/mockData';

const MusicView: React.FC = () => {
  const { musicId } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  
  // Find or mock the sound
  let music = mockMusic.find(m => m.id === musicId);
  
  if (!music && musicId === 'm-new-ext') {
    music = {
      id: 'm-new-ext',
      title: 'Original Sound - Sarah Wanderer',
      artist: 'Sarah Wanderer',
      cover_url: 'https://picsum.photos/seed/v1/400/800',
      audio_url: '#',
      used_in_videos: 0,
      plays_count: 0,
      likes_count: 0,
      genre: 'Original',
      duration: 15,
      is_original: true,
      status: 'active',
      original_video_id: 'v1'
    };
  } else if (!music) {
    music = mockMusic[0];
  }

  // Filter videos that use this music (simulated)
  const relatedVideos = mockVideos.filter(v => v.music_title === music?.title);
  const sourceVideo = music.is_original ? mockVideos.find(v => v.id === music?.original_video_id) : null;

  const currentLikes = isLiked ? (music.likes_count + 1) : music.likes_count;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-in fade-in duration-500 pb-24">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">Back</span>
      </button>

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12">
        <div className="relative group">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-lg overflow-hidden border border-gray-800 shadow-2xl relative z-10">
            <img src={music.cover_url} className="w-full h-full object-cover" alt={music.title} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play className="w-12 h-12 fill-white text-white" />
            </div>
          </div>
          {/* Vinyl Animation Effect */}
          <div className="absolute top-0 right-[-30px] w-40 h-40 md:w-48 md:h-48 rounded-full bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center animate-[spin_10s_linear_infinite] -z-10 shadow-xl hidden md:flex">
             <div className="w-full h-full rounded-full border border-white/5 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-white/10" />
             </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
              <h1 className="text-3xl md:text-4xl font-bold">{music.title}</h1>
              {music.is_original && (
                <span className="bg-gray-800 text-[10px] text-gray-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-white/5">Original</span>
              )}
            </div>
            <p className="text-lg text-gray-400 flex items-center justify-center md:justify-start gap-2">
              {music.artist}
              <CheckCircle2 className="w-4 h-4 text-sky-400 fill-sky-400" />
            </p>
            {music.album && (
              <p className="text-sm text-gray-500 font-medium">Album: {music.album}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 py-2">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-bold">{music.used_in_videos.toLocaleString()}</span>
              <span className="text-gray-500 uppercase text-[10px] font-bold tracking-widest flex items-center gap-1">
                 <Music className="w-3 h-3" /> Videos
              </span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-bold">{currentLikes.toLocaleString()}</span>
              <span className="text-gray-500 uppercase text-[10px] font-bold tracking-widest flex items-center gap-1">
                 <Heart className={`w-3 h-3 ${isLiked ? 'text-[#fe2c55] fill-[#fe2c55]' : ''}`} /> Likes
              </span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-bold">{(music.plays_count / 1000000).toFixed(1)}M</span>
              <span className="text-gray-500 uppercase text-[10px] font-bold tracking-widest flex items-center gap-1">
                 <Headphones className="w-3 h-3" /> Plays
              </span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-lg font-bold text-[#25f4ee] bg-[#25f4ee]/10 px-2 rounded">{music.genre}</span>
              <span className="text-gray-500 uppercase text-[10px] font-bold tracking-widest flex items-center gap-1">
                 <Radio className="w-3 h-3" /> Genre
              </span>
            </div>
          </div>

          {sourceVideo && (
            <div 
              onClick={() => navigate('/')}
              className="bg-gray-900/40 p-3 rounded-xl border border-gray-800 inline-flex items-center gap-4 group cursor-pointer hover:bg-gray-800 transition-all"
            >
              <div className="w-10 h-14 rounded overflow-hidden relative">
                <img src={sourceVideo.thumbnail_url} className="w-full h-full object-cover" alt="Source" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-white text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="text-left pr-4">
                <p className="text-[10px] text-gray-500 font-bold uppercase">Source Video</p>
                <p className="text-xs font-bold text-white line-clamp-1">{sourceVideo.description}</p>
                <div className="flex items-center gap-1 text-[10px] text-[#25f4ee] mt-0.5">
                  <LinkIcon className="w-2.5 h-2.5" />
                  <span>Linked Original</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-4">
            <button 
              onClick={() => navigate('/upload', { state: { musicId: music.id } })}
              className="bg-[#fe2c55] text-white px-10 py-3 rounded-sm font-bold flex items-center gap-2 hover:bg-[#e0264d] transition-all transform active:scale-95 shadow-lg shadow-[#fe2c55]/20"
            >
              <Music className="w-5 h-5" />
              Use this sound
            </button>
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-sm transition-colors ${isLiked ? 'bg-[#fe2c55]/10 text-[#fe2c55]' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-3 bg-gray-800 rounded-sm hover:bg-gray-700 text-white transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-3 bg-gray-800 rounded-sm hover:bg-gray-700 text-white transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="border-t border-gray-800 pt-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Play className="w-5 h-5 text-[#fe2c55]" />
          Trending videos using this sound
        </h2>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1 md:gap-4">
          {relatedVideos.map((video) => (
            <div 
              key={video.id} 
              onClick={() => navigate('/')}
              className="relative aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden group cursor-pointer"
            >
              <img src={video.thumbnail_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Video" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 left-2 flex items-center gap-1 font-bold text-xs drop-shadow-md text-white">
                <Play className="w-3 h-3 fill-white" />
                <span>{(video.views / 1000).toFixed(1)}k</span>
              </div>
            </div>
          ))}
          {/* Fillers for UI consistency */}
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="relative aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden">
               <img src={`https://picsum.photos/seed/sound_${i}/400/800`} className="w-full h-full object-cover opacity-60" alt="Filler" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicView;
