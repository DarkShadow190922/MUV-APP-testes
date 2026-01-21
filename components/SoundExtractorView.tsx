
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Scissors, Play, Loader2, Music, CheckCircle2, ChevronLeft, Waves, Clock } from 'lucide-react';
import { mockVideos } from '../services/mockData';
import { MusicService } from '../services/musicService';

const SoundExtractorView: React.FC = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'extracting' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [newSoundId, setNewSoundId] = useState<string | null>(null);
  
  const video = mockVideos.find(v => v.id === videoId) || mockVideos[0];
  const videoRef = useRef<HTMLVideoElement>(null);

  const startExtraction = async () => {
    setStatus('extracting');
    setProgress(0);
    
    // Simulate FFMpeg progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) { // Hold at 90 until service actually completes
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Call MusicService to extract sound
      const music = await MusicService.createSoundFromVideo(video.id, startTime, duration);
      setNewSoundId(music.id);
      setProgress(100);
      setStatus('complete');
    } catch (err) {
      console.error("Extraction failed", err);
      setStatus('idle');
    }
  };

  const handleFinish = () => {
    navigate(`/music/${newSoundId || 'm-new-ext'}`, { state: { fromExtraction: true } });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="font-bold">Cancel Extraction</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="aspect-[9/16] bg-black rounded-3xl overflow-hidden border border-gray-800 shadow-2xl relative">
            <video 
              ref={videoRef}
              src={video.video_url} 
              className="w-full h-full object-contain"
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6">
               <div className="flex items-center gap-2 text-xs font-bold text-white/80 uppercase tracking-widest bg-black/40 backdrop-blur px-3 py-1.5 rounded-full w-fit">
                  <Scissors className="w-3 h-3 text-[#fe2c55]" />
                  Audio Source Preview
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 flex flex-col justify-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Music className="w-8 h-8 text-[#fe2c55]" />
              MusicService
            </h1>
            <p className="text-gray-400 mt-2">Extracting original audio segment from @{video.user.username}'s video.</p>
          </div>

          {status === 'idle' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Start Time
                    </span>
                    <span className="font-mono text-[#25f4ee]">{startTime}s</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max={Math.max(0, video.duration - 5)} 
                    value={startTime}
                    onChange={(e) => setStartTime(parseInt(e.target.value))}
                    className="w-full accent-[#fe2c55]" 
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2">
                       <Waves className="w-4 h-4" /> Duration
                    </span>
                    <span className="font-mono text-[#25f4ee]">{duration}s</span>
                  </div>
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full bg-gray-800 rounded-lg p-3 text-sm focus:outline-none border border-gray-700"
                  >
                    <option value={15}>15 Seconds (Optimized)</option>
                    <option value={30}>30 Seconds (Extended)</option>
                    <option value={60}>60 Seconds (Full Track)</option>
                  </select>
                </div>
              </div>

              {/* Corrected onClick handler from startRecording to startExtraction */}
              <button 
                onClick={startExtraction}
                className="w-full bg-[#fe2c55] text-white py-4 rounded-xl font-bold hover:bg-[#e0264d] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#fe2c55]/20"
              >
                <Scissors className="w-5 h-5" />
                Extract Audio Segment
              </button>
            </div>
          )}

          {status === 'extracting' && (
            <div className="space-y-8 animate-in zoom-in duration-300">
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <Loader2 className="w-20 h-20 text-[#25f4ee] animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
                    {progress}%
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold">FFMpeg Clipping...</h2>
                  <p className="text-sm text-gray-500">Transcoding stream to 320kbps MP3</p>
                </div>
              </div>

              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#fe2c55] to-[#25f4ee] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 {[1,2,3,4].map(i => (
                   <div key={i} className={`h-1 bg-white/5 rounded-full ${progress > (i * 25) ? 'bg-[#25f4ee]/20' : ''}`} />
                 ))}
              </div>
            </div>
          )}

          {status === 'complete' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-8">
              <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-3xl text-center space-y-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Extraction Successful</h2>
                <p className="text-gray-400">"Original Sound - @{video.user.username}" has been generated and indexed.</p>
              </div>

              <button 
                onClick={handleFinish}
                className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all shadow-xl"
              >
                View Sound Detail
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoundExtractorView;
