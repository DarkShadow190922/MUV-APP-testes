
import React, { useState, useMemo, useEffect } from 'react';
import { Music, Play, TrendingUp, Sparkles, Headphones, Search, ChevronRight, Plus, Heart } from 'lucide-react';
import { mockMusic } from '../services/mockData';
import { useNavigate } from 'react-router-dom';
import { Music as MusicType } from '../types';
import { MusicService } from '../services/musicService';

const SoundCard: React.FC<{ music: MusicType }> = ({ music }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(`/music/${music.id}`)}
      className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/40 border border-gray-800 hover:border-gray-600 transition-all cursor-pointer group"
    >
      <div className="relative w-16 h-16 shrink-0">
        <img src={music.cover_url} className="w-full h-full object-cover rounded-lg" alt={music.title} />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-lg">
          <Play className="w-6 h-6 fill-white text-white" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-bold truncate text-white">{music.title}</p>
          <span className="text-[9px] font-bold text-[#25f4ee] bg-[#25f4ee]/10 px-1.5 py-0.5 rounded border border-[#25f4ee]/20">{music.genre}</span>
        </div>
        <p className="text-xs text-gray-500 truncate">{music.artist}</p>
        <div className="flex flex-wrap items-center gap-3 mt-1.5">
          <div className="flex items-center gap-1">
            <Play className="w-3 h-3 text-gray-500" />
            <span className="text-[10px] text-gray-500 font-bold">{(music.used_in_videos / 1000).toFixed(1)}K</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-gray-500" />
            <span className="text-[10px] text-gray-500 font-bold">{(music.likes_count / 1000).toFixed(1)}K</span>
          </div>
          <div className="flex items-center gap-1">
            <Headphones className="w-3 h-3 text-gray-500" />
            <span className="text-[10px] text-gray-500 font-bold">{(music.plays_count / 1000).toFixed(1)}K</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-6 w-16 bg-gray-800/50 rounded-full overflow-hidden flex items-center justify-around px-1">
           {[1, 2, 3, 4, 5].map(i => (
             <div key={i} className="w-0.5 bg-white/20 rounded-full animate-pulse" style={{ height: `${Math.random() * 80 + 10}%`, animationDelay: `${i * 0.1}s` }} />
           ))}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </div>
    </div>
  );
};

const MusicDiscoveryView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeGenre, setActiveGenre] = useState('All');
  const [sounds, setSounds] = useState<MusicType[]>([]);
  const navigate = useNavigate();
  
  const genres = ['All', 'Pop', 'Hip Hop', 'EDM', 'Rock', 'Lofi', 'Latin', 'Electronic'];

  useEffect(() => {
    // Initial load of trending sounds from service
    setSounds(MusicService.getTrendingSounds());
  }, []);

  const filteredMusic = useMemo(() => {
    let list = search ? MusicService.searchMusic(search) : sounds;
    if (activeGenre !== 'All') {
      list = list.filter(m => m.genre === activeGenre);
    }
    return list;
  }, [activeGenre, search, sounds]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Music className="w-8 h-8 text-[#fe2c55]" />
            Sounds
          </h1>
          <button 
            onClick={() => navigate('/music/upload')}
            className="flex items-center gap-2 bg-[#fe2c55] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#e0264d] transition-all shadow-lg shadow-[#fe2c55]/20"
          >
            <Plus className="w-5 h-5" />
            Upload track
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search sounds, artists, or genres"
            className="w-full bg-gray-900 border border-gray-800 rounded-full py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:ring-1 focus:ring-[#fe2c55] transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Genres Scroll */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {genres.map(genre => (
          <button 
            key={genre} 
            onClick={() => setActiveGenre(genre)}
            className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${activeGenre === genre ? 'bg-white text-black border-white' : 'bg-gray-800 text-gray-400 border-transparent hover:border-gray-600'}`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              {activeGenre === 'All' ? 'Trending Now' : `${activeGenre} Tracks`}
            </h2>
            <button className="text-xs text-[#fe2c55] font-bold">See all</button>
          </div>
          <div className="space-y-3">
            {filteredMusic.length > 0 ? (
              filteredMusic.map(m => (
                <SoundCard key={m.id} music={m} />
              ))
            ) : (
              <div className="py-20 text-center text-gray-500 space-y-2 border border-dashed border-gray-800 rounded-xl">
                 <Music className="w-8 h-8 mx-auto opacity-20" />
                 <p className="font-bold">No tracks found in {activeGenre}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              For You
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Chill Beats', img: 'chill' },
              { title: 'Workout', img: 'gym' },
              { title: 'Late Night', img: 'night' },
              { title: 'Study Time', img: 'book' }
            ].map((p, idx) => (
              <div key={p.title} className="aspect-square relative rounded-2xl overflow-hidden group cursor-pointer shadow-xl">
                <img src={`https://picsum.photos/seed/playlist${idx}/400/400`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <p className="font-bold text-white">{p.title}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Playlist</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 space-y-4">
             <h3 className="font-bold">Creator Benefits</h3>
             <p className="text-xs text-gray-400 leading-relaxed">Verified creators can upload original high-fidelity tracks directly. Reach millions of listeners and get paid when your sounds go viral.</p>
             <button 
               onClick={() => navigate('/music/upload')}
               className="text-xs font-bold text-[#25f4ee] hover:underline"
             >
               Start your Lynx Audio Portfolio →
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicDiscoveryView;
