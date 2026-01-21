
import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from './VideoPlayer';
import { currentUser } from '../services/mockData';
import { getForYouFeed } from '../services/recommendationService';

const Feed: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [rankedVideos, setRankedVideos] = useState<any[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial ranking of the feed based on PHP-inspired algorithm
    const feed = getForYouFeed(currentUser.id);
    setRankedVideos(feed);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!feedRef.current) return;
      const index = Math.round(feedRef.current.scrollTop / window.innerHeight);
      setActiveIndex(index);
    };

    const container = feedRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={feedRef}
      className="video-container flex-1 bg-black overflow-y-scroll snap-y snap-mandatory scroll-smooth"
    >
      {rankedVideos.map((video, idx) => (
        <VideoPlayer 
          key={`${video.id}-${idx}`} 
          video={video} 
          isActive={idx === activeIndex} 
        />
      ))}
      
      {/* End of Feed Loading State */}
      <div className="h-screen flex flex-col items-center justify-center text-gray-400 space-y-6 snap-start">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-800 border-t-[#fe2c55] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#25f4ee] rounded-full animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="font-bold text-white tracking-wide">Refreshing AI Engine...</p>
          <p className="text-xs text-gray-500">Recalculating recommendations from behavioral profile</p>
        </div>
      </div>
    </div>
  );
};

export default Feed;
