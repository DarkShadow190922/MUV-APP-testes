
import React, { useRef, useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Music, CheckCircle2, X, Send, Layers, Sparkles, Scissors, MoreHorizontal, ArrowRight, ShieldAlert, Gift, FastForward, Languages, Bookmark, Ban, Download, EyeOff, LayoutTemplate } from 'lucide-react';
import { Video } from '../types';
import { mockComments, mockMusic, currentUser, mockVideos } from '../services/mockData';
import { useNavigate, Link } from 'react-router-dom';
import { trackInteraction } from '../services/recommendationService';
import { AnalyticsService } from '../services/analyticsService';
import { MonetizationService } from '../services/monetizationService';
import { MessageService } from '../services/messageService';
import ReportModal from './ReportModal';
import TipModal from './TipModal';

interface VideoPlayerProps {
  video: Video & { recommendation_reason?: string };
  isActive: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(video.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showCaptions, setShowCaptions] = useState(false);
  const [heartAnim, setHeartAnim] = useState<{ x: number, y: number, id: number } | null>(null);
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(e => console.log('Autoplay blocked'));
      setIsPlaying(true);
      AnalyticsService.trackVideoView(video.id, currentUser.id);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive, video]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isLiked) {
      setIsLiked(true);
      setLikes(prev => prev + 1);
    }
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setHeartAnim({ x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() });
    setTimeout(() => setHeartAnim(null), 1000);
  };

  const changeSpeed = () => {
    const speeds = [0.5, 1, 1.5, 2, 3];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackSpeed(newSpeed);
    if (videoRef.current) videoRef.current.playbackRate = newSpeed;
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    MessageService.shareVideo(currentUser.id, 'u2', video.id);
    alert(`Video shared with @travel_junkie!`);
  };

  const toggleQuickMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickMenu(!showQuickMenu);
  };

  const renderDescription = () => {
    const parts = video.description.split(' ');
    return parts.map((part, i) => {
      if (part.startsWith('#')) {
        const tag = part.substring(1);
        return (
          <Link 
            key={i} 
            to={`/tag/${tag}`} 
            className="font-bold hover:underline mr-1 text-sky-400"
            onClick={e => e.stopPropagation()}
          >
            {part}
          </Link>
        );
      }
      return part + ' ';
    });
  };

  return (
    <div className="video-slide relative flex items-center justify-center bg-black overflow-hidden" onContextMenu={toggleQuickMenu}>
      <video
        ref={videoRef}
        src={video.video_url}
        className={`h-full w-auto max-w-full object-contain relative z-10 cursor-pointer transition-all duration-300 ${showComments || showQuickMenu ? 'opacity-50 blur-md' : ''}`}
        loop playsInline onClick={() => { if(showQuickMenu) setShowQuickMenu(false); else togglePlay(); }} onDoubleClick={handleDoubleClick}
      />

      {heartAnim && (
        <div key={heartAnim.id} className="absolute z-50 pointer-events-none animate-in zoom-in fade-out duration-1000 fill-[#fe2c55]" style={{ left: heartAnim.x - 40, top: heartAnim.y - 40 }}>
          <Heart className="w-20 h-20 fill-current drop-shadow-2xl" />
        </div>
      )}

      {/* Quick Menu (Long Press / Context Menu) */}
      {showQuickMenu && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200" onClick={() => setShowQuickMenu(false)}>
           <div className="bg-gray-900/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 w-full max-w-[280px] grid grid-cols-2 gap-4 shadow-2xl" onClick={e => e.stopPropagation()}>
              <button onClick={() => { setIsBookmarked(!isBookmarked); setShowQuickMenu(false); }} className="flex flex-col items-center gap-2 p-4 hover:bg-white/5 rounded-2xl transition-all">
                <Bookmark className={`w-8 h-8 ${isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Save</span>
              </button>
              <button onClick={() => { navigate(`/stitch/${video.id}`); setShowQuickMenu(false); }} className="flex flex-col items-center gap-2 p-4 hover:bg-white/5 rounded-2xl transition-all">
                <Scissors className="w-8 h-8 text-white" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Stitch</span>
              </button>
              <button onClick={() => { alert('Algorithm updated. Less like this.'); setShowQuickMenu(false); }} className="flex flex-col items-center gap-2 p-4 hover:bg-white/5 rounded-2xl transition-all">
                <EyeOff className="w-8 h-8 text-white" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Dislike</span>
              </button>
              <button onClick={() => { setIsReportModalOpen(true); setShowQuickMenu(false); }} className="flex flex-col items-center gap-2 p-4 hover:bg-white/5 rounded-2xl transition-all">
                <ShieldAlert className="w-8 h-8 text-[#fe2c55]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Report</span>
              </button>
           </div>
        </div>
      )}

      {/* Side Actions */}
      <div className={`absolute right-4 bottom-24 md:bottom-24 mb-16 flex flex-col gap-5 z-20 transition-opacity ${showComments || showQuickMenu ? 'opacity-0' : 'opacity-100'}`}>
        <Link to="/profile" className="flex flex-col items-center group/avatar relative" onClick={e => e.stopPropagation()}>
          <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-800">
            <img src={video.user.avatar} className="w-full h-full object-cover" alt="avatar" />
          </div>
          <div className="absolute -bottom-2 w-5 h-5 bg-[#fe2c55] rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white">+</div>
        </Link>
        <button onClick={() => { setIsLiked(!isLiked); setLikes(prev => isLiked ? prev - 1 : prev + 1); }} className="flex flex-col items-center">
          <Heart className={`w-9 h-9 transition-all ${isLiked ? 'fill-[#fe2c55] text-[#fe2c55] scale-110' : 'text-white hover:scale-105'}`} />
          <span className="text-[11px] font-bold mt-1 drop-shadow-lg">{likes.toLocaleString()}</span>
        </button>
        <button onClick={() => setShowComments(true)} className="flex flex-col items-center">
          <MessageCircle className="w-9 h-9 text-white hover:scale-105 transition-all" />
          <span className="text-[11px] font-bold mt-1 drop-shadow-lg">{video.comments_count}</span>
        </button>
        <button onClick={() => setIsBookmarked(!isBookmarked)} className="flex flex-col items-center">
          <Bookmark className={`w-9 h-9 transition-all ${isBookmarked ? 'fill-yellow-400 text-yellow-400 scale-110' : 'text-white hover:scale-105'}`} />
          <span className="text-[11px] font-bold mt-1 drop-shadow-lg">{isBookmarked ? 'Saved' : 'Save'}</span>
        </button>
        <button onClick={handleShare} className="flex flex-col items-center">
          <Share2 className="w-9 h-9 text-white hover:scale-105 transition-all" />
          <span className="text-[11px] font-bold mt-1 drop-shadow-lg">{video.shares_count}</span>
        </button>
      </div>

      {/* Info Overlay */}
      <div className={`absolute left-4 bottom-24 md:bottom-8 z-20 transition-opacity max-w-[80%] ${showComments || showQuickMenu ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-bold text-lg drop-shadow-lg">@{video.user.username}</h3>
          {video.user.verified && <CheckCircle2 className="w-4 h-4 text-sky-400 fill-sky-400" />}
        </div>
        <div className="text-sm drop-shadow-lg leading-relaxed line-clamp-2 md:line-clamp-none">
          {renderDescription()}
        </div>
        <div className="flex items-center gap-2 mt-4 bg-black/40 backdrop-blur-md rounded-full px-4 py-1.5 w-fit border border-white/10">
          <Music className="w-3.5 h-3.5 animate-pulse" />
          <span className="text-xs font-semibold">{video.music_title} - {video.music_artist}</span>
        </div>
      </div>

      {/* Captions Simulation */}
      {showCaptions && (
        <div className="absolute bottom-40 inset-x-0 z-30 flex justify-center px-8 text-center pointer-events-none">
          <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
            [Lynx Auto-Caption] This content is incredibly engaging... 🔥
          </div>
        </div>
      )}

      {/* Comment Drawer */}
      <div className={`absolute inset-x-0 bottom-0 z-40 bg-[#121212] rounded-t-3xl transition-transform duration-500 h-[75vh] flex flex-col shadow-2xl border-t border-white/5 ${showComments ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="p-5 border-b border-white/5 flex justify-between items-center">
          <span className="font-bold text-sm tracking-tight">{video.comments_count} comments</span>
          <button onClick={() => setShowComments(false)} className="p-1 hover:bg-white/5 rounded-full transition-colors"><X className="w-6 h-6" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          {mockComments.map(c => (
            <div key={c.id} className="flex gap-3">
              <img src={c.user.avatar} className="w-10 h-10 rounded-full border border-white/5 shrink-0" alt="avatar" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500">@{c.user.username}</p>
                <p className="text-sm leading-relaxed">{c.content}</p>
                <div className="flex gap-4 mt-2">
                   <span className="text-[10px] font-bold text-gray-600">2h ago</span>
                   <button className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-[#121212] border-t border-white/5 safe-area-bottom">
           <div className="bg-gray-800/50 rounded-full px-5 py-2.5 flex items-center gap-2 border border-white/5 focus-within:border-[#fe2c55]/50 transition-all">
              <input type="text" placeholder="Add a comment..." className="bg-transparent border-none flex-1 text-sm focus:outline-none" />
              <button className="text-[#fe2c55] font-bold text-sm">Post</button>
           </div>
        </div>
      </div>
      <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} contentType="video" contentId={video.id} userId={video.user.id} />
      <TipModal isOpen={isTipModalOpen} onClose={() => setIsTipModalOpen(false)} toUser={video.user} videoId={video.id} />
    </div>
  );
};

export default VideoPlayer;
