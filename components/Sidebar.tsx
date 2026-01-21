
import React from 'react';
import { Home, Users, Compass, Tv, User, Wallet, Hash, Info, TrendingUp, Music } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getTrendingTopics } from '../services/recommendationService';

const SidebarItem: React.FC<{ icon: any; label: string; to: string; active?: boolean }> = ({ icon: Icon, label, to, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${active ? 'text-[#fe2c55]' : 'hover:bg-gray-800 text-white'}`}
  >
    <Icon className="w-7 h-7" />
    <span className="text-lg font-bold hidden lg:block">{label}</span>
  </Link>
);

const Sidebar: React.FC = () => {
  const location = useLocation();
  const trending = getTrendingTopics();

  return (
    <aside className="w-20 lg:w-72 fixed left-0 top-16 bottom-0 border-r border-gray-800 bg-[#010101] py-4 px-2 overflow-y-auto hidden md:block z-40">
      <div className="space-y-1 mb-4">
        <SidebarItem icon={Home} label="For You" to="/" active={location.pathname === '/'} />
        <SidebarItem icon={Users} label="Following" to="/following" active={location.pathname === '/following'} />
        <SidebarItem icon={Compass} label="Explore" to="/explore" active={location.pathname === '/explore'} />
        <SidebarItem icon={Music} label="Music" to="/music" active={location.pathname === '/music'} />
        <SidebarItem icon={Tv} label="LIVE" to="/live" active={location.pathname === '/live'} />
        <SidebarItem icon={Wallet} label="Wallet" to="/wallet" active={location.pathname === '/wallet'} />
        <SidebarItem icon={User} label="Profile" to="/profile" active={location.pathname === '/profile'} />
      </div>

      <div className="border-t border-gray-800 pt-4 px-2 hidden lg:block">
        <p className="text-xs font-semibold text-gray-400 mb-4 px-2 uppercase tracking-wider">Suggested accounts</p>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 group cursor-pointer">
              <img src={`https://picsum.photos/seed/user${i}/100`} className="w-8 h-8 rounded-full" alt="User" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">user_suggested_{i}</p>
                <p className="text-xs text-gray-500 truncate">Influencer</p>
              </div>
            </div>
          ))}
        </div>
        <button className="text-[#fe2c55] text-sm font-semibold mt-4 px-2 hover:underline">See all</button>
      </div>

      <div className="border-t border-gray-800 mt-6 pt-4 px-2 hidden lg:block">
        <div className="flex items-center justify-between px-2 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Discover</p>
          <TrendingUp className="w-3 h-3 text-[#25f4ee]" />
        </div>
        <div className="flex flex-col gap-1">
          {trending.map((topic) => (
            <div key={topic.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-all group">
              <div className="flex items-center gap-3">
                <div className="bg-[#2f2f2f] p-1.5 rounded-full group-hover:bg-[#fe2c55]/20 group-hover:text-[#fe2c55] transition-colors">
                  <Hash className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">{topic.name}</span>
              </div>
              <span className="text-[10px] font-bold text-gray-500">{topic.views}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-xs text-gray-500 px-4 space-y-3 hidden lg:block">
        <p>© 2025 Lynx TikTok</p>
      </div>
    </aside>
  );
};

export default Sidebar;
