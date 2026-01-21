
import React, { useState, useEffect } from 'react';
import { Search, Plus, Send, MessageSquare, Bell, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { RealTimeNotificationService } from '../services/notificationService';
import { currentUser } from '../services/mockData';
import { Notification } from '../types';

const Navbar: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState<Notification | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial count
    setUnreadCount(RealTimeNotificationService.getUnreadCount(currentUser.id));

    // Subscribe to real-time notifications
    const unsubscribe = RealTimeNotificationService.subscribe(currentUser.id, (data) => {
      if (data.type === 'notification') {
        setUnreadCount(prev => prev + 1);
        setToast(data.notification);
        setTimeout(() => setToast(null), 5000);
      }
    });

    return unsubscribe;
  }, []);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate(`/search/${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#010101] border-b border-gray-800 z-50 flex items-center justify-between px-4 md:px-6">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-tr from-[#fe2c55] to-[#25f4ee] rounded-lg flex items-center justify-center">
          <span className="font-bold text-white text-xl">L</span>
        </div>
        <span className="text-2xl font-bold tracking-tighter hidden md:block">Lynx</span>
      </Link>

      <div className="flex-1 max-w-md mx-4 relative hidden sm:block">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search accounts and videos"
            className="w-full bg-[#2f2f2f] rounded-full py-2.5 px-4 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all text-sm placeholder-gray-400"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
          />
          <button 
            className="absolute right-3 top-1/2 -translate-y-1/2 border-l border-gray-600 pl-3 hover:bg-gray-700/50 p-1 rounded-full"
            onClick={() => searchValue && navigate(`/search/${searchValue}`)}
          >
            <Search className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/upload" className="flex items-center gap-1.5 bg-white text-black px-4 py-1.5 rounded-sm font-semibold hover:bg-gray-100 transition-colors hidden sm:flex">
          <Plus className="w-5 h-5" />
          <span>Upload</span>
        </Link>
        
        <Link to="/inbox" className="p-2 hover:bg-gray-800 rounded-full transition-colors relative">
          <Send className="w-6 h-6" />
        </Link>
        
        <Link to="/messages" className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <MessageSquare className="w-6 h-6" />
        </Link>
        
        <Link to="/notifications" className="p-2 hover:bg-gray-800 rounded-full transition-colors relative">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-[#fe2c55] rounded-full border-2 border-[#010101] flex items-center justify-center text-[10px] font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        <Link to="/profile" className="ml-2">
          <img 
            src={currentUser.avatar} 
            alt="Profile" 
            className="w-8 h-8 rounded-full object-cover border border-gray-700"
          />
        </Link>
      </div>

      {/* Real-time Notification Toast */}
      {toast && (
        <div className="fixed top-20 right-4 w-80 bg-gray-900/95 backdrop-blur-xl border border-gray-800 p-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-8 z-[100] flex gap-3 items-center">
          <img src={toast.from_user?.avatar} className="w-10 h-10 rounded-full border border-white/10" alt="avatar" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#fe2c55] uppercase tracking-widest mb-0.5">{toast.type}</p>
            <p className="text-sm font-medium text-white truncate">
              {toast.from_user?.display_name || 'System'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {toast.data?.message || `sent you a ${toast.type}`}
            </p>
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:bg-white/10 rounded-full">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
