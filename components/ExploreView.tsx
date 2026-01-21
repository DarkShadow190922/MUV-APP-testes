
import React from 'react';
import { Search, TrendingUp, Music, Users, Camera, Flame, Trophy, Palette, Pizza } from 'lucide-react';
import { mockVideos } from '../services/mockData';

const ExploreCategory: React.FC<{ icon: any; label: string; color: string }> = ({ icon: Icon, label, color }) => (
  <div className="flex flex-col items-center gap-2 group cursor-pointer">
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <span className="text-xs font-bold text-gray-400 group-hover:text-white">{label}</span>
  </div>
);

const ExploreView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 animate-in fade-in duration-500">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="text" placeholder="Search accounts, videos and hashtags" className="w-full bg-gray-900 border border-gray-800 rounded-full py-4 pl-12 pr-6 focus:ring-1 focus:ring-[#fe2c55] outline-none transition-all" />
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
        <ExploreCategory icon={Flame} label="Hot" color="bg-orange-500" />
        <ExploreCategory icon={Music} label="Music" color="bg-[#fe2c55]" />
        <ExploreCategory icon={Pizza} label="Food" color="bg-yellow-500" />
        <ExploreCategory icon={Trophy} label="Sports" color="bg-blue-500" />
        <ExploreCategory icon={Palette} label="Art" color="bg-purple-500" />
        <ExploreCategory icon={Camera} label="Vlogs" color="bg-green-500" />
        <ExploreCategory icon={TrendingUp} label="Crypto" color="bg-cyan-500" />
        <ExploreCategory icon={Users} label="Social" color="bg-pink-500" />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2"><TrendingUp className="w-6 h-6 text-[#fe2c55]" /> Trending Videos</h2>
          <button className="text-[#fe2c55] text-sm font-bold">See all</button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {mockVideos.map((v, i) => (
            <div key={v.id + i} className="aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden relative group cursor-pointer">
              <img src={v.thumbnail_url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="trending" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-bold">
                <TrendingUp className="w-3 h-3" /> {Math.floor(v.views/1000)}k
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#fe2c55]/20 to-[#25f4ee]/20 p-8 rounded-3xl border border-white/10 text-center space-y-4">
        <h3 className="text-2xl font-bold">Join the Lynx Creator Program</h3>
        <p className="text-sm text-gray-400">Share your story with the world and start earning today.</p>
        <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all">Apply Now</button>
      </div>
    </div>
  );
};

export default ExploreView;
