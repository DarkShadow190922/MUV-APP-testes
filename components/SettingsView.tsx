
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Lock, Bell, Shield, Languages, HelpCircle, Info, LogOut, Moon, Eye, Share2, Download, Trash2, ChevronRight } from 'lucide-react';
import { currentUser } from '../services/mockData';

const SettingItem: React.FC<{ icon: any; label: string; value?: string; onClick?: () => void; danger?: boolean }> = ({ icon: Icon, label, value, onClick, danger }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${danger ? 'text-red-500' : 'text-gray-200'}`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-lg ${danger ? 'bg-red-500/10' : 'bg-gray-800'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-xs text-gray-500">{value}</span>}
      <ChevronRight className="w-4 h-4 text-gray-600" />
    </div>
  </button>
);

const SettingsView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-800 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Settings and privacy</h1>
      </div>

      <div className="space-y-8">
        {/* Account Section */}
        <div className="space-y-2">
          <h3 className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Account</h3>
          <div className="bg-gray-900/40 border border-white/5 rounded-3xl overflow-hidden">
            <SettingItem icon={User} label="Manage account" value={currentUser.email} />
            <SettingItem icon={Lock} label="Privacy" value="Public" />
            <SettingItem icon={Shield} label="Security" value="High" />
            <SettingItem icon={Share2} label="Share profile" />
          </div>
        </div>

        {/* Content & Activity Section */}
        <div className="space-y-2">
          <h3 className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Content & Activity</h3>
          <div className="bg-gray-900/40 border border-white/5 rounded-3xl overflow-hidden">
            <SettingItem icon={Bell} label="Push notifications" value="On" />
            <SettingItem icon={Languages} label="App language" value="English" />
            <SettingItem icon={Moon} label="Dark mode" value="Always On" />
            <SettingItem icon={Eye} label="Watch history" />
            <SettingItem icon={Download} label="Free up space" value="124 MB" />
          </div>
        </div>

        {/* Support & About Section */}
        <div className="space-y-2">
          <h3 className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Support & About</h3>
          <div className="bg-gray-900/40 border border-white/5 rounded-3xl overflow-hidden">
            <SettingItem icon={HelpCircle} label="Report a problem" />
            <SettingItem icon={Info} label="Terms of Service" />
            <SettingItem icon={Shield} label="Privacy Policy" />
          </div>
        </div>

        {/* Login Section */}
        <div className="space-y-2 pt-4">
          <div className="bg-gray-900/40 border border-white/5 rounded-3xl overflow-hidden">
            <SettingItem icon={LogOut} label="Log out" onClick={() => navigate('/')} danger />
            <SettingItem icon={Trash2} label="Delete account" danger />
          </div>
          <p className="text-center text-[10px] text-gray-600 font-medium py-4">Version 100.2.5 (Lynx Protocol)</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
