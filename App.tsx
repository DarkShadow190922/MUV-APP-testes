
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import ProfileView from './components/ProfileView';
import WalletView from './components/WalletView';
import LiveStreamView from './components/LiveStreamView';
import InboxView from './components/InboxView';
import UploadView from './components/UploadView';
import MusicView from './components/MusicView';
import MusicDiscoveryView from './components/MusicDiscoveryView';
import SoundExtractorView from './components/SoundExtractorView';
import MusicUploadView from './components/MusicUploadView';
import DuetView from './components/DuetView';
import StitchView from './components/StitchView';
import HashtagView from './components/HashtagView';
import BottomNav from './components/BottomNav';
import ExploreView from './components/ExploreView';
import SearchResultsView from './components/SearchResultsView';
import SettingsView from './components/SettingsView';

const Layout: React.FC<{ children: React.ReactNode, hideSidebar?: boolean }> = ({ children, hideSidebar }) => (
  <div className="min-h-screen bg-[#010101] text-white flex flex-col">
    <Navbar />
    <div className="flex flex-1 pt-16 pb-16 md:pb-0 overflow-hidden">
      {!hideSidebar && <Sidebar />}
      <main className={`flex-1 ${!hideSidebar ? 'md:ml-20 lg:ml-72' : ''} h-full overflow-y-auto custom-scrollbar`}>
        {children}
      </main>
    </div>
    <BottomNav />
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Feed /></Layout>} />
        <Route path="/following" element={<Layout><Feed /></Layout>} />
        <Route path="/explore" element={<Layout><ExploreView /></Layout>} />
        <Route path="/search/:query" element={<Layout><SearchResultsView /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsView /></Layout>} />
        <Route path="/live" element={<Layout hideSidebar><LiveStreamView /></Layout>} />
        <Route path="/profile" element={<Layout><ProfileView /></Layout>} />
        <Route path="/wallet" element={<Layout><WalletView /></Layout>} />
        <Route path="/music" element={<Layout><MusicDiscoveryView /></Layout>} />
        <Route path="/music/upload" element={<Layout><MusicUploadView /></Layout>} />
        <Route path="/music/:musicId" element={<Layout><MusicView /></Layout>} />
        <Route path="/tag/:tag" element={<Layout><HashtagView /></Layout>} />
        <Route path="/extract-sound/:videoId" element={<Layout><SoundExtractorView /></Layout>} />
        <Route path="/duet/:videoId" element={<Layout hideSidebar><DuetView /></Layout>} />
        <Route path="/stitch/:videoId" element={<Layout hideSidebar><StitchView /></Layout>} />
        <Route path="/notifications" element={<Layout hideSidebar><InboxView /></Layout>} />
        <Route path="/inbox" element={<Layout hideSidebar><InboxView /></Layout>} />
        <Route path="/messages" element={<Layout hideSidebar><InboxView /></Layout>} />
        <Route path="/upload" element={<Layout><UploadView /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;
