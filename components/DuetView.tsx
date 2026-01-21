
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Columns, 
  Rows, 
  Maximize, 
  Video as VideoIcon, 
  Mic, 
  MicOff, 
  Zap, 
  Loader2, 
  CheckCircle2,
  Play,
  Pause,
  RefreshCw,
  LayoutTemplate,
  AlertCircle
} from 'lucide-react';
import { mockVideos } from '../services/mockData';
import { DuetLayoutType } from '../types';
import { DuetService } from '../services/duetService';

const DuetView: React.FC = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'setup' | 'recording' | 'processing' | 'complete' | 'error'>('setup');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [layout, setLayout] = useState<DuetLayoutType>('left-right');
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentDuetId, setCurrentDuetId] = useState<string | null>(null);
  
  const video = mockVideos.find(v => v.id === videoId) || mockVideos[0];
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // PHP-inspired permission check
    const check = DuetService.canDuet(video);
    if (!check.allowed) {
      setErrorMsg(check.error || 'Duets are not allowed for this video.');
      setStatus('error');
      return;
    }

    if (status === 'setup') {
      startCamera();
    }
  }, [status, video]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: true 
      });
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access failed", err);
      setErrorMsg("Could not access your camera.");
      setStatus('error');
    }
  };

  const startRecording = () => {
    // Create duet metadata record in 'pending' status
    const duetId = DuetService.createDuetRecord(video, layout);
    setCurrentDuetId(duetId);

    setStatus('recording');
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }

    const duration = video.duration * 1000;
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          finishRecording(duetId);
          return 100;
        }
        return prev + step;
      });
    }, interval);
  };

  const finishRecording = async (duetId: string) => {
    setStatus('processing');
    if (videoRef.current) videoRef.current.pause();
    
    // Simulate backend processing service
    await DuetService.processVideoComposition(duetId);
    setStatus('complete');
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'left-right': return 'flex-row';
      case 'top-bottom': return 'flex-col';
      case 'picture-in-picture': return 'relative';
      default: return 'flex-row';
    }
  };

  if (status === 'error') {
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8 text-center space-y-6 bg-[#010101]">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Action Restricted</h2>
          <p className="text-gray-400 mt-2">{errorMsg}</p>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-gray-800 border-t-[#25f4ee] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <LayoutTemplate className="w-8 h-8 text-[#fe2c55]" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Merging Video Streams</h2>
          <p className="text-gray-400 max-w-xs mx-auto text-sm">Compositing dual-view layout and synchronizing audio tracks via DuetProcessingService.</p>
        </div>
        <div className="w-full max-w-xs bg-gray-900 h-1.5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#fe2c55] to-[#25f4ee] animate-[shimmer_2s_infinite] w-full" />
        </div>
      </div>
    );
  }

  if (status === 'complete') {
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Duet Created!</h2>
          <p className="text-gray-400">Your composite video is ready for publishing.</p>
        </div>
        <button 
          onClick={() => navigate('/upload', { state: { isDuet: true, originalVideo: video, layout, duetId: currentDuetId } })}
          className="bg-[#fe2c55] text-white px-10 py-3 rounded-xl font-bold hover:bg-[#e0264d] transition-all shadow-xl shadow-[#fe2c55]/20"
        >
          Next: Finalize Post
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-black flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-50 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex bg-black/40 backdrop-blur-md rounded-full border border-white/10 p-1">
          <button 
            onClick={() => setLayout('left-right')}
            className={`p-2 rounded-full transition-all ${layout === 'left-right' ? 'bg-[#fe2c55] text-white' : 'text-gray-400'}`}
          >
            <Columns className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setLayout('top-bottom')}
            className={`p-2 rounded-full transition-all ${layout === 'top-bottom' ? 'bg-[#fe2c55] text-white' : 'text-gray-400'}`}
          >
            <Rows className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setLayout('picture-in-picture')}
            className={`p-2 rounded-full transition-all ${layout === 'picture-in-picture' ? 'bg-[#fe2c55] text-white' : 'text-gray-400'}`}
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
        <div className="w-10" />
      </div>

      <div className={`flex-1 flex overflow-hidden ${getLayoutClasses()} transition-all duration-500 ease-in-out`}>
        <div className={`bg-zinc-900 border-gray-800 transition-all duration-500 overflow-hidden relative
          ${layout === 'left-right' ? 'w-1/2 border-r' : 'w-full'}
          ${layout === 'top-bottom' ? 'h-1/2 border-b' : 'h-full'}
          ${layout === 'picture-in-picture' ? 'absolute inset-0 z-10' : ''}
        `}>
          <video 
            ref={videoRef}
            src={video.video_url}
            className="w-full h-full object-cover"
            muted={status === 'setup'}
            playsInline
            loop={status === 'setup'}
            autoPlay={status === 'setup'}
          />
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-black/60 backdrop-blur text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider text-white border border-white/10">
              Original: @{video.user.username}
            </span>
          </div>
        </div>

        <div className={`bg-zinc-800 transition-all duration-500 overflow-hidden relative
          ${layout === 'left-right' ? 'w-1/2' : 'w-full'}
          ${layout === 'top-bottom' ? 'h-1/2' : 'h-full'}
          ${layout === 'picture-in-picture' ? 'absolute bottom-20 right-4 w-1/3 h-1/4 z-20 rounded-2xl border-2 border-[#fe2c55] shadow-2xl' : ''}
        `}>
          <video 
            ref={cameraRef}
            className="w-full h-full object-cover scale-x-[-1]"
            autoPlay
            playsInline
            muted
          />
          <div className="absolute top-4 right-4 z-20">
             <span className="bg-[#fe2c55] text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
               Duet: You
             </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 z-50 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center gap-6">
        {status === 'recording' && (
          <div className="w-full max-w-md bg-white/10 h-1.5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-[#fe2c55] transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex items-center gap-10">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full border transition-all ${isMuted ? 'bg-red-500 border-red-500 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {status === 'setup' ? (
            <button 
              onClick={startRecording}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group transition-all hover:scale-110 active:scale-95"
            >
              <div className="w-16 h-16 bg-[#fe2c55] rounded-full group-hover:scale-90 transition-transform shadow-lg shadow-[#fe2c55]/40" />
            </button>
          ) : (
            <div className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center">
              <div className="w-12 h-12 bg-[#fe2c55] rounded-lg animate-pulse" />
            </div>
          )}

          <button className="p-4 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all">
            <RefreshCw className="w-6 h-6" />
          </button>
        </div>

        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {status === 'recording' ? `Recording Duet... ${Math.floor(progress)}%` : 'Ready to record'}
        </p>
      </div>
    </div>
  );
};

export default DuetView;
