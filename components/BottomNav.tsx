
import React from 'react';
import { Home, Users, Plus, MessageSquare, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-gray-800 flex items-center justify-around md:hidden z-[60] safe-area-bottom">
      <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-white' : 'text-gray-500'}`}>
        <Home className="w-6 h-6" />
        <span className="text-[10px] font-bold">Home</span>
      </Link>
      
      <Link to="/following" className={`flex flex-col items-center gap-1 ${isActive('/following') ? 'text-white' : 'text-gray-500'}`}>
        <Users className="w-6 h-6" />
        <span className="text-[10px] font-bold">Friends</span>
      </Link>
      
      <Link to="/upload" className="relative -top-2">
        <div className="w-12 h-9 relative">
          <div className="absolute inset-0 bg-[#25f4ee] rounded-lg translate-x-1" />
          <div className="absolute inset-0 bg-[#fe2c55] rounded-lg -translate-x-1" />
          <div className="absolute inset-0 bg-white rounded-lg flex items-center justify-center">
            <Plus className="w-6 h-6 text-black" />
          </div>
        </div>
      </Link>
      
      <Link to="/inbox" className={`flex flex-col items-center gap-1 ${isActive('/inbox') ? 'text-white' : 'text-gray-500'}`}>
        <MessageSquare className="w-6 h-6" />
        <span className="text-[10px] font-bold">Inbox</span>
      </Link>
      
      <Link to="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-white' : 'text-gray-500'}`}>
        <User className="w-6 h-6" />
        <span className="text-[10px] font-bold">Profile</span>
      </Link>
    </div>
  );
};

export default BottomNav;
