
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Upload, FileVideo, CheckCircle2, Loader2, Music, Image as ImageIcon, Zap, AlertCircle, X, Layers, ShieldCheck, ShieldAlert, Shield, Sparkles, Scissors, ChevronRight, Waves, Lock, MessageSquare, Repeat } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockMusic } from '../services/mockData';
import { DuetService } from '../services/duetService';
import { StitchService } from '../services/stitchService';
import { SecurityService } from '../services/securityService';
import { VideoFilter } from '../types';

const FILTERS: { name: string, value: VideoFilter }[] = [
  { name: 'Normal', value: 'none' },
  { name: 'Retro', value: 'sepia' },
  { name: 'B&W', value: 'grayscale' },
  { name: 'Vibrant', value: 'contrast' },
  { name: 'Cold', value: 'hue-rotate' },
  { name: 'Negative', value: 'invert' }
];

const ProcessingStep: React.FC<{ label: string; status: 'pending' | 'loading' | 'complete'; delay: number }> = ({ label, status, delay }) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  useEffect(() => {
    if (status === 'loading') {
      const timer = setTimeout(() => setCurrentStatus('complete'), delay);
      return () => clearTimeout(timer);
    }
  }, [status, delay]);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-800">
      <div className="flex items-center gap-3">
        {currentStatus === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-gray-700" />}
        {currentStatus === 'loading' && <Loader2 className="w-5 h-5 text-[#25f4ee] animate-spin" />}
        {currentStatus === 'complete' && <CheckCircle2 className="w-5 h-5 text-green-400" />}
        <span className={`text-sm font-medium ${currentStatus === 'complete' ? 'text-white' : 'text-gray-400'}`}>{label}</span>
      </div>
    </div>
  );
};

const UploadView: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [caption, setCaption] = useState('');
  const [activeFilter, setActiveFilter] = useState<VideoFilter>('none');
  const [audioStart, setAudioStart] = useState(0);
  
  // Advanced Settings
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const [allowComments, setAllowComments] = useState(true);
  const [allowDuet, setAllowDuet] = useState(true);
  const [allowStitch, setAllowStitch] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const safetyScore = useMemo(() => SecurityService.getContentSafetyScore(caption), [caption]);
  const isSpam = useMemo(() => SecurityService.spamDetection(caption), [caption]);

  const [selectedMusic, setSelectedMusic] = useState<any>(null);
  const [duetData, setDuetData] = useState<any>(null);
  const [stitchData, setStitchData] = useState<any>(null);

  useEffect(() => {
    const musicId = location.state?.musicId;
    if (musicId) {
      const found = mockMusic.find(m => m.id === musicId);
      if (found) setSelectedMusic(found);
    }
    if (location.state?.isDuet) {
      setDuetData({ originalVideo: location.state.originalVideo, layout: location.state.layout, duetId: location.state.duetId });
      setIsProcessing(true);
      setCaption(`Duet with @${location.state.originalVideo.user.username} #duet`);
    }
    if (location.state?.isStitch) {
      setStitchData({ originalVideo: location.state.originalVideo, stitchId: location.state.stitchId });
      setIsProcessing(true);
      setCaption(`Stitch with @${location.state.originalVideo.user.username} #stitch`);
    }
  }, [location.state]);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsProcessing(true);
    }, 2000);
  };

  const handlePublish = () => {
    if (isSpam || safetyScore < 40) {
      alert("Content flagged by Lynx Safety Engine. Please revise your caption.");
      return;
    }
    if (duetData?.duetId) DuetService.finalizeDuet(duetData.duetId, caption);
    if (stitchData?.stitchId) StitchService.finalizeStitch(stitchData.stitchId, caption);
    navigate('/');
  };

  const Toggle = ({ active, onToggle, label, icon: Icon }: any) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-400" />
        <span className="text-sm font-bold text-gray-200">{label}</span>
      </div>
      <button 
        onClick={() => onToggle(!active)}
        className={`w-11 h-6 rounded-full relative transition-all ${active ? 'bg-[#fe2c55]' : 'bg-gray-800'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${active ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );

  if (isProcessing) {
    return (
      <div className="max-w-xl mx-auto p-8 animate-in fade-in duration-500 pb-32">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-[#fe2c55]/10 rounded-full mb-4">
            <Zap className="w-8 h-8 text-[#fe2c55]" />
          </div>
          <h1 className="text-2xl font-bold italic tracking-tight">Post Production</h1>
          <p className="text-gray-400 text-sm">Finalizing your masterpiece</p>
        </div>

        <div className="space-y-3">
          <ProcessingStep label="Analyzing bitstream (FFProbe)" status="loading" delay={1000} />
          <ProcessingStep label="Applying Visual Filter" status="loading" delay={2000} />
          <ProcessingStep label="Syncing Assets & Layout" status="loading" delay={3000} />
          <ProcessingStep label="Metadata Sync & Distribution" status="loading" delay={4000} />
        </div>

        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#25f4ee]" />Safety Report</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${safetyScore > 80 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{safetyScore}/100</span>
           </div>
           <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${safetyScore > 60 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${safetyScore}%` }} />
           </div>
        </div>

        <div className="mt-8 space-y-4">
          <textarea 
            className="w-full bg-gray-900 rounded-xl p-4 text-sm h-24 focus:outline-none border border-gray-800 focus:ring-1 focus:ring-[#fe2c55]"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption..."
          />
          
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 space-y-1">
             <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-sm font-bold flex items-center gap-2"><Lock className="w-5 h-5 text-gray-400" /> Who can watch</span>
                <select 
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-[#fe2c55] outline-none"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
             </div>
             <Toggle label="Allow comments" icon={MessageSquare} active={allowComments} onToggle={setAllowComments} />
             <Toggle label="Allow Duet" icon={Repeat} active={allowDuet} onToggle={setAllowDuet} />
             <Toggle label="Allow Stitch" icon={Scissors} active={allowStitch} onToggle={setAllowStitch} />
          </div>

          <button onClick={handlePublish} className="w-full bg-[#fe2c55] text-white py-4 rounded-xl font-bold hover:bg-[#e0264d] shadow-xl">Publish to Feed</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 pb-32">
      <h1 className="text-3xl font-bold mb-8">Upload video</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Preview & Upload Area */}
        <div className="lg:col-span-4 space-y-4">
          <div 
            onClick={handleUpload}
            className={`aspect-[9/16] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-6 transition-all cursor-pointer relative overflow-hidden group border-gray-800 hover:border-[#fe2c55] bg-gray-900/50`}
          >
            {isUploading ? (
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 text-[#fe2c55] animate-spin mx-auto" />
                <p className="font-bold">Uploading...</p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <Upload className="w-12 h-12 text-gray-500 mx-auto" />
                <p className="font-bold text-sm">Select file</p>
                <p className="text-[10px] text-gray-500">Up to 10 minutes • MP4/WebM</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-xs font-bold text-white bg-[#fe2c55] px-4 py-2 rounded-full">Replace Video</span>
            </div>
          </div>
        </div>

        {/* Editing Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Audio Trimmer */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2"><Music className="w-5 h-5 text-[#fe2c55]" /> Sound Sync</h2>
              <button onClick={() => navigate('/music')} className="text-xs font-bold text-[#25f4ee] hover:underline">Choose Sound</button>
            </div>
            
            <div className="bg-black/40 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#fe2c55]/20 rounded flex items-center justify-center">
                  <Music className="w-5 h-5 text-[#fe2c55]" />
                </div>
                <div>
                  <p className="text-sm font-bold">{selectedMusic?.title || 'Original Sound'}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{selectedMusic?.artist || 'You'}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <span>Start: {audioStart}s</span>
                  <span>Clip: 15s</span>
                </div>
                <div className="relative h-12 bg-gray-800 rounded-lg overflow-hidden flex items-center px-1">
                   <div className="absolute inset-0 flex items-center justify-around px-2 opacity-30">
                      {[...Array(30)].map((_, i) => (
                        <div key={i} className="w-1 bg-white rounded-full" style={{ height: `${Math.random() * 80 + 20}%` }} />
                      ))}
                   </div>
                   <input 
                     type="range" min="0" max="60" value={audioStart} 
                     onChange={(e) => setAudioStart(parseInt(e.target.value))}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                   />
                   <div 
                     className="absolute h-full w-24 bg-[#fe2c55]/30 border-x-2 border-[#fe2c55] z-10 transition-all pointer-events-none"
                     style={{ left: `${(audioStart / 60) * 100}%` }}
                   />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Selector */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
             <h2 className="text-lg font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#25f4ee]" /> Visual Filters</h2>
             <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                {FILTERS.map(f => (
                  <button 
                    key={f.value} 
                    onClick={() => setActiveFilter(f.value)}
                    className="flex flex-col items-center gap-2 group shrink-0"
                  >
                    <div className={`w-16 h-16 rounded-full border-2 transition-all overflow-hidden ${activeFilter === f.value ? 'border-[#fe2c55] scale-110 shadow-lg shadow-[#fe2c55]/20' : 'border-transparent'}`}>
                       <div className="w-full h-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center text-[10px] font-bold uppercase text-white/40">
                          {f.name}
                       </div>
                    </div>
                    <span className={`text-[10px] font-bold ${activeFilter === f.value ? 'text-white' : 'text-gray-500'}`}>{f.name}</span>
                  </button>
                ))}
             </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 py-4 border border-gray-800 rounded-2xl font-bold hover:bg-gray-800 transition-colors">Discard</button>
            <button 
              onClick={handleUpload}
              className="flex-[2] py-4 bg-[#fe2c55] text-white rounded-2xl font-bold hover:bg-[#e0264d] transition-all shadow-xl shadow-[#fe2c55]/20"
            >
              Process & Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadView;
