
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Scissors, Play, Clock, CheckCircle2 } from 'lucide-react';
import { mockVideos } from '../services/mockData';
import { StitchService } from '../services/stitchService';

const StitchView: React.FC = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const video = mockVideos.find(v => v.id === videoId) || mockVideos[0];
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
    }
  }, [startTime]);

  const handleNext = () => {
    setIsProcessing(true);
    const stitchId = StitchService.createStitchRecord(video.id, startTime, startTime + duration);
    
    setTimeout(() => {
      navigate('/upload', { 
        state: { 
          isStitch: true, 
          originalVideo: video, 
          stitchId,
          clipStart: startTime,
          clipDuration: duration
        } 
      });
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-black flex flex-col animate-in fade-in duration-500">
      <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="font-bold">Select Segment</h2>
        <button 
          onClick={handleNext}
          disabled={isProcessing}
          className="text-[#fe2c55] font-bold px-4 py-1.5 hover:bg-[#fe2c55]/10 rounded-full transition-all"
        >
          Next
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 bg-zinc-900 relative flex items-center justify-center">
          <video 
            ref={videoRef}
            src={video.video_url}
            className="h-full w-auto object-contain"
            playsInline
            muted
          />
          {isProcessing && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-30">
              <div className="w-12 h-12 border-4 border-gray-800 border-t-[#fe2c55] rounded-full animate-spin mb-4" />
              <p className="font-bold text-sm">Clipping segment...</p>
            </div>
          )}
        </div>

        <div className="w-full md:w-80 bg-zinc-950 p-6 space-y-8 border-l border-white/5">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4" /> Start Time: {startTime.toFixed(1)}s
            </h3>
            <div className="relative h-12 bg-gray-900 rounded-xl overflow-hidden flex items-center px-1">
               <div className="absolute inset-0 flex items-center justify-around px-2 opacity-10">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-1 bg-white rounded-full" style={{ height: `${Math.random() * 60 + 20}%` }} />
                  ))}
               </div>
               <input 
                 type="range" min="0" max={Math.max(0, video.duration - duration)} step="0.1" value={startTime} 
                 onChange={(e) => setStartTime(parseFloat(e.target.value))}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
               />
               <div 
                 className="absolute h-full w-24 bg-[#fe2c55]/30 border-x-2 border-[#fe2c55] z-10 transition-all pointer-events-none"
                 style={{ left: `${(startTime / video.duration) * 100}%` }}
               />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Scissors className="w-4 h-4" /> Max duration: 5s
            </h3>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-xs text-gray-400 leading-relaxed">
                Stitch allows you to use up to 5 seconds of the original video to start your own story.
              </p>
            </div>
          </div>

          <div className="pt-8">
            <div className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
               <Play className="w-5 h-5 text-yellow-500" />
               <p className="text-[10px] font-bold text-yellow-200">The segment you select will appear at the start of your new video.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StitchView;
