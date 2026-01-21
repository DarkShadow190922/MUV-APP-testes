
import React, { useState, useEffect, useRef } from 'react';
import { Users, Heart, MessageCircle, Gift, Share2, X, Plus, Camera, Mic, Settings, Radio, StopCircle, Zap, AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';
import { currentUser } from '../services/mockData';
import { LiveChatService } from '../services/liveChatService';
import { LiveChatMessage, VideoFilter } from '../types';

type StreamStatus = 'idle' | 'setup' | 'live' | 'ended' | 'error';

const FILTERS: { name: string, value: VideoFilter }[] = [
  { name: 'Normal', value: 'none' },
  { name: 'Vintage', value: 'sepia' },
  { name: 'Noir', value: 'grayscale' },
  { name: 'Pop', value: 'contrast' },
  { name: 'Cyber', value: 'hue-rotate' },
  { name: 'Inverse', value: 'invert' }
];

const LiveStreamView: React.FC = () => {
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [viewers, setViewers] = useState(0);
  const [streamId, setStreamId] = useState('');
  const [comments, setComments] = useState<LiveChatMessage[]>([]);
  const [activeFilter, setActiveFilter] = useState<VideoFilter>('none');
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const startSetup = async () => {
    setErrorMessage(null);
    setStatus('setup');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage("Camera access is not supported by your browser or environment.");
      setStatus('error');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(console.error);
      }
    } catch (err: any) {
      setErrorMessage("Permission denied. Allow camera access.");
      setStatus('error');
    }
  };

  const goLive = () => {
    setStreamId(`stream_${currentUser.id}_${Date.now()}`);
    setStatus('live');
    setViewers(Math.floor(Math.random() * 50) + 10);
  };

  const stopStream = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setStatus('ended');
  };

  useEffect(() => {
    if (status !== 'live' || !streamId) return;
    const unsubscribe = LiveChatService.subscribe(streamId, (msg) => setComments(prev => [...prev.slice(-40), msg]));
    const botInterval = setInterval(() => {
        LiveChatService.sendMessage(streamId, {
          userId: 'bot', username: 'TikTokFan', avatar: 'https://picsum.photos/seed/bot/100', text: 'Amazing live! 🔥'
        });
    }, 5000);
    return () => { unsubscribe(); clearInterval(botInterval); };
  }, [status, streamId]);

  const filterStyle = {
    filter: activeFilter === 'none' ? 'none' : 
            activeFilter === 'sepia' ? 'sepia(0.8)' :
            activeFilter === 'grayscale' ? 'grayscale(1)' :
            activeFilter === 'contrast' ? 'contrast(1.5)' :
            activeFilter === 'hue-rotate' ? 'hue-rotate(90deg)' :
            activeFilter === 'invert' ? 'invert(0.8)' : 'none'
  };

  if (status === 'idle') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black p-6 text-center space-y-6">
        <div className="w-20 h-20 bg-gradient-to-tr from-[#fe2c55] to-[#25f4ee] rounded-3xl flex items-center justify-center animate-pulse"><Radio className="w-10 h-10 text-white" /></div>
        <h1 className="text-3xl font-bold">Ready to connect?</h1>
        <button onClick={startSetup} className="bg-[#fe2c55] text-white px-10 py-3 rounded-full font-bold text-lg hover:scale-105 transition-all">Start Live Video</button>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-black overflow-hidden">
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover scale-x-[-1] transition-all duration-500" style={filterStyle} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />

      {/* Setup Overlay with Filters */}
      {status === 'setup' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="bg-gray-900/90 border border-gray-800 p-8 rounded-3xl w-full max-w-md space-y-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-center">Live Studio</h2>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Stream title..." className="w-full bg-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#fe2c55] outline-none" />
            
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-3 h-3" /> Visual Filters</p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {FILTERS.map(f => (
                  <button key={f.value} onClick={() => setActiveFilter(f.value)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${activeFilter === f.value ? 'bg-[#fe2c55] border-[#fe2c55] text-white' : 'bg-gray-800 border-transparent text-gray-400'}`}>{f.name}</button>
                ))}
              </div>
            </div>

            <button onClick={goLive} disabled={!title} className="w-full bg-[#fe2c55] text-white py-4 rounded-xl font-bold hover:bg-[#e0264d] disabled:opacity-50 transition-all shadow-lg shadow-[#fe2c55]/20">Go Live Now</button>
          </div>
        </div>
      )}

      {status === 'live' && (
        <>
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
            <div className="bg-[#fe2c55] text-white text-[10px] font-bold px-3 py-1.5 rounded flex items-center gap-2 uppercase tracking-wider animate-pulse"><div className="w-2 h-2 bg-white rounded-full" />Live</div>
            <button onClick={stopStream} className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10"><X className="w-5 h-5 text-white" /></button>
          </div>
          <div className="absolute bottom-24 left-4 right-16 flex flex-col justify-end gap-2 max-w-[85%] z-20 pointer-events-none">
            <div className="space-y-2 h-[250px] overflow-y-auto no-scrollbar pb-4">
              {comments.map((c) => (
                <div key={c.id} className="animate-in slide-in-from-left-4 fade-in duration-300">
                  <div className="backdrop-blur-md px-3 py-2 rounded-2xl inline-flex items-start gap-2 bg-black/40 border border-white/5">
                    <span className="font-bold text-xs text-[#25f4ee]">{c.username}</span>
                    <span className="text-sm text-white">{c.text}</span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveStreamView;
