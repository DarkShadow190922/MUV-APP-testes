
import React, { useState, useMemo } from 'react';
import { Edit, Share, Lock, Grid, Heart, Bookmark, CheckCircle2, BarChart3, Info, TrendingUp, Users, Eye, PieChart, Globe, User, Shield, ShieldCheck, ShieldAlert, Key, Fingerprint, History, AlertCircle, QrCode, X, Download, Copy, Settings } from 'lucide-react';
import { currentUser, mockVideos } from '../services/mockData';
import { getUserInterests } from '../services/recommendationService';
import { AnalyticsService } from '../services/analyticsService';
import { SecurityService } from '../services/securityService';
import { useNavigate } from 'react-router-dom';

const QRCodeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[40px] p-8 w-full max-w-sm text-center space-y-6 shadow-2xl animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-black/5 rounded-full hover:bg-black/10">
          <X className="w-5 h-5 text-black" />
        </button>
        <div className="space-y-2 pt-4">
          <div className="w-12 h-12 bg-[#fe2c55] rounded-xl flex items-center justify-center mx-auto text-white font-bold text-2xl">L</div>
          <h2 className="text-2xl font-black text-black tracking-tight">@{currentUser.username}</h2>
        </div>
        <div className="bg-gray-100 aspect-square rounded-3xl flex items-center justify-center border-4 border-black/5 p-8">
           <div className="w-full h-full relative">
              {/* Mock QR Code Pattern */}
              <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-1">
                 {[...Array(100)].map((_, i) => (
                   <div key={i} className={`${Math.random() > 0.4 ? 'bg-black' : 'bg-transparent'} rounded-[1px]`} />
                 ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-white p-2 rounded-xl border border-black/5 shadow-lg">
                    <div className="w-8 h-8 bg-[#fe2c55] rounded flex items-center justify-center text-white font-bold text-sm">L</div>
                 </div>
              </div>
           </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button className="flex-1 flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
            <Download className="w-6 h-6 text-black" />
            <span className="text-[10px] font-bold text-black uppercase">Save Image</span>
          </button>
          <button className="flex-1 flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors" onClick={() => { alert('Link Copied!'); }}>
            <Copy className="w-6 h-6 text-black" />
            <span className="text-[10px] font-bold text-black uppercase">Copy Link</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'videos' | 'liked' | 'bookmarked' | 'interests' | 'analytics' | 'security'>('videos');
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();

  // Compute interests dynamically from the behavioral engine
  const interests = useMemo(() => getUserInterests(currentUser.id), []);

  // Fetch analytics data
  const analytics = useMemo(() => AnalyticsService.getUserAnalytics(currentUser.id), []);

  // Fetch security data
  const security = useMemo(() => SecurityService.getAccountRiskLevel(currentUser.id), []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
        <div className="relative group">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.username} 
            className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-gray-800 object-cover" 
          />
          <button className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Edit className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-2xl font-bold">{currentUser.username}</h1>
            <div className="flex items-center gap-2">
              <button className="bg-[#fe2c55] text-white px-6 py-1.5 rounded-sm font-semibold hover:bg-[#e0264d] transition-colors">
                Edit profile
              </button>
              <button onClick={() => setShowQR(true)} className="p-2 border border-gray-700 rounded-sm hover:bg-gray-800">
                <QrCode className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/settings')} className="p-2 border border-gray-700 rounded-sm hover:bg-gray-800">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 border border-gray-700 rounded-sm hover:bg-gray-800">
                <Share className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center gap-1">
              <span className="font-bold">{currentUser.following_count.toLocaleString()}</span>
              <span className="text-gray-400 text-sm">Following</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold">{currentUser.followers_count.toLocaleString()}</span>
              <span className="text-gray-400 text-sm">Followers</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold">{currentUser.likes_count.toLocaleString()}</span>
              <span className="text-gray-400 text-sm">Likes</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-lg">{currentUser.display_name}</p>
            <p className="text-gray-300">{currentUser.bio}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 flex justify-center mb-1 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors relative whitespace-nowrap ${activeTab === 'videos' ? 'text-white' : 'text-gray-500'}`}
        >
          <Grid className="w-5 h-5" />
          <span>Videos</span>
          {activeTab === 'videos' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />}
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors relative whitespace-nowrap ${activeTab === 'analytics' ? 'text-white' : 'text-gray-500'}`}
        >
          <TrendingUp className="w-5 h-5" />
          <span>Analytics</span>
          {activeTab === 'analytics' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />}
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors relative whitespace-nowrap ${activeTab === 'security' ? 'text-white' : 'text-gray-500'}`}
        >
          <Shield className="w-5 h-5" />
          <span>Security</span>
          {activeTab === 'security' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />}
        </button>
        <button 
          onClick={() => setActiveTab('interests')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors relative whitespace-nowrap ${activeTab === 'interests' ? 'text-white' : 'text-gray-500'}`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>AI Profile</span>
          {activeTab === 'interests' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />}
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'videos' && (
          <div className="grid grid-cols-3 gap-1 animate-in fade-in duration-300">
            {mockVideos.filter(v => v.user_id === currentUser.id).map((video) => (
              <div key={video.id} className="relative aspect-[3/4] bg-gray-900 group cursor-pointer overflow-hidden">
                <img src={video.thumbnail_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="thumbnail" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white font-bold drop-shadow-md">
                  <span className="text-xs">{(video.views / 1000).toFixed(1)}k</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="py-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Risk Overview Card */}
            <div className={`p-8 rounded-3xl border ${
              security.risk_level === 'low' ? 'bg-green-500/5 border-green-500/20' :
              security.risk_level === 'medium' ? 'bg-yellow-500/5 border-yellow-500/20' :
              'bg-red-500/5 border-red-500/20'
            }`}>
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">Account Security</h2>
                  <p className="text-sm text-gray-400">Behavioral risk analysis from SecurityService</p>
                </div>
                {security.risk_level === 'low' ? <ShieldCheck className="w-12 h-12 text-green-500" /> : <ShieldAlert className="w-12 h-12 text-yellow-500" />}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Account Health</span>
                    <span className="text-xl font-bold">{security.safety_score}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${security.risk_level === 'low' ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: `${security.safety_score}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                   <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                      <Fingerprint className="w-5 h-5 text-sky-400" />
                   </div>
                   <div>
                      <p className="text-xs font-bold">Identity Verification</p>
                      <p className="text-[10px] text-gray-500">{currentUser.verified ? 'Level 2: Verified Creator' : 'Level 1: Basic'}</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Suspicious Patterns */}
            <div className="bg-[#1f1f1f] p-6 rounded-2xl border border-gray-800">
               <h3 className="text-sm font-bold uppercase text-gray-400 mb-6 flex items-center gap-2">
                  <History className="w-4 h-4" /> Integrity History
               </h3>
               {security.suspicious_patterns.length > 0 ? (
                 <div className="space-y-3">
                   {security.suspicious_patterns.map((p, i) => (
                     <div key={i} className="flex gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                       <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                       <span className="text-xs text-red-200">{p}</span>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="py-6 text-center text-gray-500 space-y-2">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-green-500/20" />
                    <p className="text-xs font-bold">No suspicious behavior detected in the last 30 days.</p>
                 </div>
               )}
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button className="bg-white/5 border border-gray-800 p-6 rounded-2xl hover:bg-white/10 transition-all text-left group">
                  <Key className="w-6 h-6 text-[#fe2c55] mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-bold">2-Step Verification</p>
                  <p className="text-[10px] text-gray-500 mt-1">Enhance account safety</p>
               </button>
               <button className="bg-white/5 border border-gray-800 p-6 rounded-2xl hover:bg-white/10 transition-all text-left group">
                  <Fingerprint className="w-6 h-6 text-sky-400 mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-bold">Privacy Settings</p>
                  <p className="text-[10px] text-gray-500 mt-1">Manage visibility</p>
               </button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Overview Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#1f1f1f] p-5 rounded-2xl border border-gray-800">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Video Views</span>
                </div>
                <p className="text-xl font-bold">{analytics.video_views.toLocaleString()}</p>
                <p className="text-[10px] text-green-400 font-bold mt-1">+12.4% vs last period</p>
              </div>
              <div className="bg-[#1f1f1f] p-5 rounded-2xl border border-gray-800">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <User className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Profile Views</span>
                </div>
                <p className="text-xl font-bold">{analytics.profile_views.toLocaleString()}</p>
                <p className="text-[10px] text-green-400 font-bold mt-1">+8.1% vs last period</p>
              </div>
              <div className="bg-[#1f1f1f] p-5 rounded-2xl border border-gray-800">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Followers</span>
                </div>
                <p className="text-xl font-bold">{analytics.followers_gained.toLocaleString()}</p>
                <p className="text-[10px] text-green-400 font-bold mt-1">+24.0% vs last period</p>
              </div>
              <div className="bg-[#1f1f1f] p-5 rounded-2xl border border-gray-800">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Likes</span>
                </div>
                <p className="text-xl font-bold">{analytics.likes_received.toLocaleString()}</p>
                <p className="text-[10px] text-green-400 font-bold mt-1">+15.2% vs last period</p>
              </div>
            </div>

            {/* Middle Section: Demographics & Engagement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1f1f1f] p-6 rounded-2xl border border-gray-800">
                <h3 className="text-sm font-bold uppercase text-gray-400 mb-6 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Top Countries
                </h3>
                <div className="space-y-4">
                  {analytics.audience_demographics.countries.map(c => (
                    <div key={c.country} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span>{c.country}</span>
                        <span className="text-gray-400">{c.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#fe2c55]"
                          style={{ width: `${c.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1f1f1f] p-6 rounded-2xl border border-gray-800">
                <h3 className="text-sm font-bold uppercase text-gray-400 mb-6 flex items-center gap-2">
                  <PieChart className="w-4 h-4" /> Engagement Rate
                </h3>
                <div className="flex items-center justify-center py-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        className="stroke-gray-800 stroke-[3]"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="stroke-[#25f4ee] stroke-[3] transition-all duration-1000 ease-out"
                        fill="none"
                        strokeDasharray={`${analytics.engagement_rate}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold">{analytics.engagement_rate.toFixed(1)}%</span>
                      <span className="text-[8px] text-gray-500 uppercase font-bold">Avg Rate</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-800">
                   <div className="text-center">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Male</p>
                      <p className="text-sm font-bold">{analytics.audience_demographics.gender.male}%</p>
                   </div>
                   <div className="text-center border-x border-gray-800">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Female</p>
                      <p className="text-sm font-bold">{analytics.audience_demographics.gender.female}%</p>
                   </div>
                   <div className="text-center">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Other</p>
                      <p className="text-sm font-bold">{analytics.audience_demographics.gender.other}%</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'interests' && (
          <div className="py-8 px-4 animate-in fade-in duration-500">
            <div className="bg-[#1f1f1f] rounded-2xl p-6 border border-gray-800 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    Behavioral Interest Graph
                    <Info className="w-4 h-4 text-gray-500 cursor-help" />
                  </h2>
                  <p className="text-sm text-gray-400">Real-time analysis from Lynx's RecommendationService.</p>
                </div>
              </div>

              <div className="space-y-6">
                {interests.map((interest) => (
                  <div key={interest.name} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-gray-300">#{interest.name.toLowerCase()}</span>
                      <span className="text-[#25f4ee]">{interest.weight}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${interest.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${interest.weight}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'liked' || activeTab === 'bookmarked') && (
          <div className="col-span-3 py-20 flex flex-col items-center justify-center text-gray-500 space-y-4">
            <Lock className="w-16 h-16 stroke-[1px]" />
            <div className="text-center px-6">
              <p className="text-xl font-bold text-white">This user's private data is hidden</p>
              <p className="text-sm">Favorites and liked videos are currently set to private.</p>
            </div>
          </div>
        )}
      </div>
      <QRCodeModal isOpen={showQR} onClose={() => setShowQR(false)} />
    </div>
  );
};

export default ProfileView;
