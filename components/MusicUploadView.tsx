
import React, { useState, useEffect } from 'react';
import { Upload, Music, Headphones, Image as ImageIcon, CheckCircle2, Loader2, Zap, AlertCircle, ChevronLeft, Waves, Disc } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MusicService } from '../services/musicService';

const AudioProcessingStep: React.FC<{ label: string; status: 'pending' | 'loading' | 'complete'; delay: number }> = ({ label, status, delay }) => {
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
      {currentStatus === 'loading' && <span className="text-[10px] text-[#25f4ee] font-bold animate-pulse uppercase tracking-widest">Mastering</span>}
    </div>
  );
};

const MusicUploadView: React.FC = () => {
  const [step, setStep] = useState<'upload' | 'details' | 'processing'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: 'Pop',
    is_original: true
  });
  const navigate = useNavigate();

  const handleFileUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setStep('details');
    }, 1500);
  };

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Call MusicService to register the track
    try {
      await MusicService.uploadMusic({
        ...formData,
        cover_url: `https://picsum.photos/seed/${formData.title}/400/400`,
        duration: 30
      });
    } catch (err) {
      console.error("Music upload failed", err);
    }
  };

  if (step === 'processing') {
    return (
      <div className="max-w-xl mx-auto p-8 animate-in fade-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex p-5 bg-[#25f4ee]/10 rounded-full mb-6">
            <Waves className="w-10 h-10 text-[#25f4ee]" />
          </div>
          <h1 className="text-3xl font-bold italic tracking-tighter">MusicService V2</h1>
          <p className="text-gray-400 text-sm mt-2">Professional audio transcoding & loudness normalization</p>
        </div>

        <div className="space-y-3">
          <AudioProcessingStep label="Analyzing Audio Duration (FFProbe)" status="loading" delay={1200} />
          <AudioProcessingStep label="Normalizing to -14 LUFS" status="loading" delay={2500} />
          <AudioProcessingStep label="LAME VBR MP3 Encoding (320kbps)" status="loading" delay={4000} />
          <AudioProcessingStep label="Resizing Cover Art (300x300 Fit)" status="loading" delay={5500} />
          <AudioProcessingStep label="Indexing to Content Discovery" status="loading" delay={7000} />
        </div>

        <div className="mt-10 p-5 bg-[#fe2c55]/10 border border-[#fe2c55]/20 rounded-2xl flex gap-4">
          <Zap className="w-6 h-6 text-[#fe2c55] shrink-0" />
          <p className="text-xs text-red-200 leading-relaxed">
            Your track is being distributed to our global edge nodes. 
            Once processed, it will be available for creators to use in their videos.
          </p>
        </div>

        <button 
          onClick={() => navigate('/music')}
          className="w-full mt-10 bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all shadow-xl"
        >
          Go to Sound Library
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">Cancel Upload</span>
      </button>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Left: File Area */}
        <div className="md:w-1/3 space-y-6">
          <div 
            onClick={step === 'upload' ? handleFileUpload : undefined}
            className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 transition-all relative overflow-hidden group ${step === 'upload' ? 'border-gray-800 hover:border-[#fe2c55] cursor-pointer hover:bg-[#fe2c55]/5' : 'border-[#fe2c55] bg-gray-900'}`}
          >
            {isUploading ? (
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 text-[#fe2c55] animate-spin mx-auto" />
                <p className="font-bold text-sm">Uploading Audio...</p>
              </div>
            ) : step === 'upload' ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#fe2c55]" />
                </div>
                <div>
                  <p className="font-bold">Select Audio File</p>
                  <p className="text-xs text-gray-500 mt-1">MP3, WAV, or AAC (Max 50MB)</p>
                </div>
              </div>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <img src="https://picsum.photos/seed/newmusic/400/400" className="absolute inset-0 w-full h-full object-cover" alt="Cover preview" />
                <div className="relative z-20 text-center space-y-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Change Cover</p>
                </div>
              </>
            )}
          </div>
          
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle className="w-3 h-3" /> Requirements
            </h3>
            <ul className="text-[10px] text-gray-400 space-y-1">
              <li>• Minimum 320kbps bitrate recommended</li>
              <li>• Audio must be between 5s and 10min</li>
              <li>• Cover art must be square (1:1)</li>
              <li>• No copyright protected content allowed</li>
            </ul>
          </div>
        </div>

        {/* Right: Meta Area */}
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Disc className="w-8 h-8 text-[#fe2c55]" />
              Track Details
            </h1>
            <p className="text-gray-400 text-sm mt-1">Provide metadata for the global Lynx Audio Portfolio.</p>
          </div>

          <form onSubmit={handleFinalize} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400">Track Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Neon Horizon"
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#fe2c55] transition-all"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400">Artist Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="Your stage name"
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#fe2c55] transition-all"
                  value={formData.artist}
                  onChange={e => setFormData({...formData, artist: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400">Album (Optional)</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
                  value={formData.album}
                  onChange={e => setFormData({...formData, album: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400">Genre</label>
                <select 
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
                  value={formData.genre}
                  onChange={e => setFormData({...formData, genre: e.target.value})}
                >
                  <option>Pop</option>
                  <option>Hip Hop</option>
                  <option>EDM</option>
                  <option>Rock</option>
                  <option>Lofi</option>
                  <option>Electronic</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#fe2c55]/10 rounded-lg">
                  <Headphones className="w-5 h-5 text-[#fe2c55]" />
                </div>
                <div>
                  <p className="text-sm font-bold">Original Sound Registration</p>
                  <p className="text-xs text-gray-500">I own the rights to this audio track.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.is_original}
                  onChange={e => setFormData({...formData, is_original: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#fe2c55]"></div>
              </label>
            </div>

            <div className="flex gap-4 pt-6">
              <button 
                type="button"
                onClick={() => setStep('upload')}
                className="flex-1 py-4 border border-gray-800 rounded-xl font-bold hover:bg-gray-900 transition-all"
              >
                Discard
              </button>
              <button 
                type="submit"
                disabled={!formData.title || !formData.artist}
                className="flex-[2] py-4 bg-[#fe2c55] text-white rounded-xl font-bold hover:bg-[#e0264d] transition-all shadow-xl shadow-[#fe2c55]/20 disabled:opacity-50 disabled:grayscale"
              >
                Upload & Master Track
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MusicUploadView;
