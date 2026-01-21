
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Settings, MessageCircle, Heart, Bell, AtSign, Send, MoreVertical, Check, CheckCheck, ChevronLeft, Image as ImageIcon, Smile, AlertCircle, ShieldAlert, UserPlus, MessageSquare, Play, Users } from 'lucide-react';
import { mockMessages, currentUser, mockVideos } from '../services/mockData';
import { MessageService } from '../services/messageService';
import { RealTimeNotificationService } from '../services/notificationService';
import { Message, Conversation, User, Notification } from '../types';
import ReportModal from './ReportModal';
import { useNavigate } from 'react-router-dom';

const VideoShareBubble: React.FC<{ videoId: string }> = ({ videoId }) => {
  const navigate = useNavigate();
  const video = mockVideos.find(v => v.id === videoId);
  if (!video) return <div className="p-4 bg-gray-800 rounded-xl text-xs text-gray-500 italic">Video no longer available</div>;

  return (
    <div 
      onClick={() => navigate('/')} 
      className="w-48 bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 cursor-pointer hover:border-white/20 transition-all shadow-xl"
    >
      <div className="relative aspect-[3/4]">
        <img src={video.thumbnail_url} className="w-full h-full object-cover" alt="Shared Video" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Play className="w-8 h-8 text-white fill-white" />
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          <img src={video.user.avatar} className="w-5 h-5 rounded-full border border-white/20" alt="creator" />
          <span className="text-[10px] font-bold text-white shadow-sm">@{video.user.username}</span>
        </div>
      </div>
      <div className="p-2">
        <p className="text-[10px] font-medium text-gray-300 line-clamp-1">{video.description}</p>
      </div>
    </div>
  );
};

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'like': return <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />;
      case 'follow': return <UserPlus className="w-3.5 h-3.5 text-blue-400" />;
      case 'comment': return <MessageSquare className="w-3.5 h-3.5 text-green-400" />;
      default: return <Bell className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <div className={`flex items-center gap-3 p-4 hover:bg-white/5 transition-all group ${!notification.read ? 'bg-[#fe2c55]/5 border-l-4 border-[#fe2c55]' : 'border-l-4 border-transparent'}`}>
      <div className="relative">
        <img src={notification.from_user?.avatar} className="w-12 h-12 rounded-full border border-gray-800 object-cover" alt="avatar" />
        <div className="absolute -bottom-1 -right-1 p-1 bg-black border border-gray-800 rounded-full">{getIcon()}</div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-bold text-white mr-1.5">{notification.from_user?.username || 'System'}</span>
          <span className="text-gray-400">{notification.data?.message || 'interacted with you'}</span>
        </p>
        <p className="text-[10px] text-gray-500 mt-1">{new Date(notification.created_at).toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

const InboxView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages');
  const [notifFilter, setNotifFilter] = useState<'all' | 'likes' | 'followers' | 'comments'>('all');
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'notifications') {
      const allNotifs = RealTimeNotificationService.getRecentNotifications(currentUser.id);
      if (notifFilter === 'all') setNotifications(allNotifs);
      else if (notifFilter === 'likes') setNotifications(allNotifs.filter(n => n.type === 'like'));
      else if (notifFilter === 'followers') setNotifications(allNotifs.filter(n => n.type === 'follow'));
      else if (notifFilter === 'comments') setNotifications(allNotifs.filter(n => n.type === 'comment'));
    }
  }, [activeTab, notifFilter]);

  const userConversations = useMemo(() => MessageService.getUserConversations(currentUser.id), [selectedConvId]);
  const activeMessages = useMemo(() => selectedConvId ? MessageService.getConversationMessages(selectedConvId) : [], [selectedConvId]);
  const partner = useMemo(() => selectedConvId ? userConversations.find(c => c.id === selectedConvId)?.partner : null, [selectedConvId, userConversations]);

  const handleSend = () => {
    if (!chatInput.trim() || !partner) return;
    MessageService.sendMessage(currentUser.id, partner.id, chatInput);
    setChatInput('');
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-64px)] flex flex-col md:flex-row bg-[#010101] overflow-hidden">
      {/* Sidebar List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-gray-800 flex flex-col ${selectedConvId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
          <button className="p-2 hover:bg-gray-800 rounded-full transition-colors"><Settings className="w-5 h-5" /></button>
        </div>
        
        <div className="flex justify-around border-b border-gray-800">
          <button onClick={() => setActiveTab('messages')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest relative transition-colors ${activeTab === 'messages' ? 'text-white' : 'text-gray-500'}`}>
            Messages {activeTab === 'messages' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#fe2c55]" />}
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest relative transition-colors ${activeTab === 'notifications' ? 'text-white' : 'text-gray-500'}`}>
            Activities {activeTab === 'notifications' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#fe2c55]" />}
          </button>
        </div>

        {activeTab === 'notifications' && (
          <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar bg-black/20">
            {[
              { id: 'all', label: 'All', icon: Bell },
              { id: 'likes', label: 'Likes', icon: Heart },
              { id: 'followers', label: 'Friends', icon: Users },
              { id: 'comments', label: 'Replies', icon: MessageSquare }
            ].map(f => (
              <button 
                key={f.id} 
                onClick={() => setNotifFilter(f.id as any)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap border transition-all ${notifFilter === f.id ? 'bg-white text-black border-white' : 'bg-gray-900 text-gray-400 border-transparent'}`}
              >
                <f.icon className="w-3 h-3" /> {f.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'messages' ? (
            userConversations.length > 0 ? (
              userConversations.map(conv => (
                <div key={conv.id} onClick={() => setSelectedConvId(conv.id)} className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-white/5 transition-all border-l-4 ${selectedConvId === conv.id ? 'bg-white/5 border-[#fe2c55]' : 'border-transparent'}`}>
                  <img src={conv.partner?.avatar} className="w-14 h-14 rounded-full border border-white/5 object-cover" alt="avatar" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className="text-sm font-bold truncate">{conv.partner?.username}</p>
                      <span className="text-[10px] text-gray-500 font-medium">{conv.last_message?.created_at}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate leading-relaxed">{conv.last_message?.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-gray-500 px-10">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-10" />
                <p className="font-bold text-sm">No conversations yet</p>
                <p className="text-xs mt-1">Start chatting with friends to see them here.</p>
              </div>
            )
          ) : (
            notifications.length > 0 ? (
              notifications.map(n => <NotificationItem key={n.id} notification={n} />)
            ) : (
              <div className="py-20 text-center text-gray-500 px-10">
                 <Bell className="w-12 h-12 mx-auto mb-4 opacity-10" />
                 <p className="font-bold text-sm">No activity found</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-[#010101] ${selectedConvId ? 'flex' : 'hidden md:flex items-center justify-center text-gray-500 p-20'}`}>
        {selectedConvId && partner ? (
          <>
            <div className="p-4 md:p-5 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-[#010101]/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedConvId(null)} className="md:hidden p-1 hover:bg-gray-800 rounded-full"><ChevronLeft className="w-6 h-6" /></button>
                <div className="relative">
                   <img src={partner.avatar} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                </div>
                <div>
                  <p className="font-bold text-sm leading-tight">{partner.username}</p>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Now</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-800 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              <div className="flex flex-col items-center py-10 space-y-3">
                 <img src={partner.avatar} className="w-20 h-20 rounded-full border-4 border-gray-900 shadow-2xl" alt="P" />
                 <div className="text-center">
                    <h3 className="font-bold text-lg">{partner.display_name}</h3>
                    <p className="text-xs text-gray-500">@{partner.username} • {partner.followers_count.toLocaleString()} Followers</p>
                 </div>
                 <button className="bg-gray-800 hover:bg-gray-700 px-6 py-1.5 rounded-full text-xs font-bold transition-all">View Profile</button>
              </div>
              
              {activeMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  {msg.type === 'post_share' ? (
                    <VideoShareBubble videoId={msg.content} />
                  ) : (
                    <div className={`px-5 py-2.5 rounded-2xl text-sm max-w-[80%] leading-relaxed ${msg.sender_id === currentUser.id ? 'bg-[#fe2c55] text-white rounded-tr-none' : 'bg-gray-800 text-gray-100 rounded-tl-none'}`}>
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 md:p-6 border-t border-gray-800 bg-[#010101] safe-area-bottom">
              <div className="flex items-center gap-3 bg-gray-900 rounded-full px-5 py-3 border border-transparent focus-within:border-white/20 transition-all">
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)} 
                  onKeyPress={e => e.key === 'Enter' && handleSend()} 
                  placeholder="Send a message..." 
                  className="flex-1 bg-transparent text-sm focus:outline-none" 
                />
                <div className="flex items-center gap-3">
                   <button className="text-gray-500 hover:text-white"><Smile className="w-5 h-5" /></button>
                   <button onClick={handleSend} disabled={!chatInput.trim()} className="text-[#fe2c55] disabled:opacity-30 disabled:grayscale transition-all"><Send className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
             <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto border border-gray-800">
               <MessageSquare className="w-10 h-10 text-gray-700" />
             </div>
             <div className="max-w-[280px]">
               <h2 className="text-xl font-bold text-white">Direct Messages</h2>
               <p className="text-xs text-gray-500 mt-2">Send messages to your friends or share your favorite videos directly.</p>
             </div>
             <button className="bg-[#fe2c55] text-white px-8 py-2.5 rounded-full font-bold text-sm shadow-xl shadow-[#fe2c55]/20 hover:scale-105 transition-all">Start Chatting</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxView;
