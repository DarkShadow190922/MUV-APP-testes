
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Hash, ChevronLeft, Play, TrendingUp, Users } from 'lucide-react';
import { mockVideos } from '../services/mockData';

const HashtagView: React.FC = () => {
  const { tag } = useParams();
  const navigate = useNavigate();

  const hashtagVideos = useMemo(() => {
    return mockVideos.filter(v => v.hashtags.includes(tag || ''));
  }, [tag]);

  const totalViews = useMemo(() => {
    return hashtagVideos.reduce((sum, v) => sum + v.views, 0);
  }, [hashtagVideos]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">Back</span>
      </button>

      <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-900 rounded-3xl flex items-center justify-center border border-white/5 shadow-2xl relative group overflow-hidden">
           <Hash className="w-16 h-16 text-[#fe2c55] group-hover:scale-110 transition-transform" />
           <div className="absolute inset-0 bg-gradient-to-tr from-[#fe2c55]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <h1 className="text-4xl font-black tracking-tight">#{tag}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{(totalViews / 1000000).toFixed(1)}M</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Views</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{hashtagVideos.length}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Videos</span>
            </div>
          </div>
          <button className="bg-[#fe2c55] text-white px-8 py-2.5 rounded-sm font-bold flex items-center gap-2 hover:bg-[#e0264d] transition-all shadow-lg shadow-[#fe2c55]/20">
             <TrendingUp className="w-4 h-4" /> Add to Favorites
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 md:gap-4">
        {hashtagVideos.length > 0 ? hashtagVideos.map(video => (
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
        )) : (
          <div className="col-span-full py-20 text-center text-gray-500">
             <Hash className="w-12 h-12 mx-auto mb-4 opacity-10" />
             <p className="font-bold">No videos found for this hashtag</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HashtagView;
