
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Users, Play, Hash, Music, ChevronLeft, Filter, SlidersHorizontal } from 'lucide-react';
import { mockVideos, users } from '../services/mockData';

const SearchResultsView: React.FC = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'top' | 'users' | 'videos' | 'sounds'>('top');

  const filteredUsers = useMemo(() => {
    const q = query?.toLowerCase() || '';
    return users.filter(u => u.username.includes(q) || u.display_name.toLowerCase().includes(q));
  }, [query]);

  const filteredVideos = useMemo(() => {
    const q = query?.toLowerCase() || '';
    return mockVideos.filter(v => 
      v.description.toLowerCase().includes(q) || 
      v.hashtags.some(h => h.includes(q))
    );
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-800 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
           <input 
             type="text" 
             defaultValue={query}
             className="w-full bg-gray-900 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none border border-gray-800 focus:border-gray-700"
             placeholder="Search"
           />
        </div>
        <button className="p-2.5 bg-gray-900 rounded-full border border-gray-800"><SlidersHorizontal className="w-5 h-5" /></button>
      </div>

      <div className="flex gap-8 border-b border-gray-800 mb-6 overflow-x-auto no-scrollbar">
        {['top', 'users', 'videos', 'sounds'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-3 text-sm font-bold capitalize transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-white' : 'text-gray-500'}`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {(activeTab === 'top' || activeTab === 'users') && filteredUsers.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Users</h3>
            <div className="space-y-4">
              {filteredUsers.map(user => (
                <div key={user.id} onClick={() => navigate('/profile')} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} className="w-14 h-14 rounded-full border border-gray-800" alt="avatar" />
                    <div>
                      <p className="font-bold flex items-center gap-1">
                        {user.username} {user.verified && <span className="w-3 h-3 bg-sky-400 rounded-full" />}
                      </p>
                      <p className="text-xs text-gray-500">{user.display_name} • {user.followers_count.toLocaleString()} followers</p>
                    </div>
                  </div>
                  <button className="bg-[#fe2c55] text-white px-6 py-1.5 rounded-sm font-bold text-xs">Follow</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'top' || activeTab === 'videos') && (
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Videos</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-1 md:gap-4">
              {filteredVideos.map(video => (
                <div key={video.id} onClick={() => navigate('/')} className="relative aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden group cursor-pointer">
                  <img src={video.thumbnail_url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Video" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-bold text-white shadow-lg">
                    <Play className="w-3 h-3 fill-white" />
                    <span>{(video.views / 1000).toFixed(1)}k</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SearchResultsView;
