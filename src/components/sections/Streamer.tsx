import React, { useState, useMemo } from 'react';
import { useStreamerData } from '../../hooks/useStreamerData';
import type { Channel } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { Skeleton } from '../ui/Skeleton';
import { ProgressiveImage } from '../ui/ProgressiveImage';
import { Search, Wifi, WifiOff, Twitter, Instagram, Youtube, Users, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const DiscordIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 127.14 96.36" fill="currentColor" className={className}>
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a67.58,67.58,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.33,46,96.22,53,91.08,65.69,84.69,65.69Z"/>
  </svg>
);

const isValidSocialLink = (link: string | undefined) => {
  if (!link) return false;
  const trimmed = link.trim();
  if (trimmed === '') return false;
  if (trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined') return false;
  return true;
};

const getOptimizedUrl = (url: string, width: number, height: number) => {
  if (!url || url.includes('wsrv.nl')) return url;
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&h=${height}&fit=cover&output=webp`;
};

export const Streamers: React.FC = () => {
  const { streamers, loading, retryStreamer } = useStreamerData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isReloadingAll, setIsReloadingAll] = useState(false);

  const filteredStreamers = useMemo(() => {
    let result = streamers.filter(s => 
      s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.live_title && s.live_title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    result.sort((a, b) => {
      // Sort loaded streamers first
      const aLoaded = !a.isLoading && !a.error;
      const bLoaded = !b.isLoading && !b.error;
      
      if (aLoaded && !bLoaded) return -1;
      if (!aLoaded && bLoaded) return 1;

      // Then loading streamers
      if (a.isLoading && !b.isLoading) return -1;
      if (!a.isLoading && b.isLoading) return 1;

      // Then sort by live status
      if (a.is_live && !b.is_live) return -1;
      if (!a.is_live && b.is_live) return 1;
      
      if (a.is_live && b.is_live) {
        return (b.viewer_count || 0) - (a.viewer_count || 0);
      }
      
      const timeA = a.last_stream_start_time && !isNaN(Date.parse(a.last_stream_start_time)) ? new Date(a.last_stream_start_time).getTime() : 0;
      const timeB = b.last_stream_start_time && !isNaN(Date.parse(b.last_stream_start_time)) ? new Date(b.last_stream_start_time).getTime() : 0;
      return timeB - timeA;
    });

    return result;
  }, [streamers, searchQuery]);

  const failedStreamers = useMemo(() => streamers.filter(s => s.error), [streamers]);
  const failedCount = failedStreamers.length;

  const handleReloadAllFailed = async () => {
    setIsReloadingAll(true);
    await Promise.all(failedStreamers.map(s => retryStreamer(s.username)));
    setIsReloadingAll(false);
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Network of strings background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10 z-0" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 0h2v120H9V0zm50 0h2v120h-2V0zM0 9v2h120V9H0zm0 50v2h120v-2H0z' fill='%233b82f6' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px' 
        }}
      />
      
      <div className="relative z-10 space-y-8 max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-red-500/20 pb-6">
          <h2 className="text-3xl font-bold text-red-100 flex items-center gap-3">
            <Users className="text-red-500" />
            حسابات أعضاء POWR
          </h2>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {failedCount > 0 && (
              <button
                type="button"
                onClick={handleReloadAllFailed}
                disabled={isReloadingAll}
                className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 px-4 py-3 rounded-xl flex items-center gap-2 transition-all font-bold whitespace-nowrap disabled:opacity-50"
              >
                <RefreshCw size={18} className={isReloadingAll ? 'animate-spin' : ''} />
                إعادة تحميل ({failedCount})
              </button>
            )}
            <div className="relative w-full md:w-96">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400/50" size={20} />
              <input
                type="text"
                placeholder="ابحث عن عضو..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-red-500/20 rounded-xl py-3 pr-12 pl-4 text-white placeholder-red-400/30 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        {loading && streamers.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="transform transition-transform duration-500">
                <GlassCard className="h-[420px] p-0 overflow-hidden flex flex-col border-red-500/10 bg-black/40">
                  <Skeleton className="h-32 w-full rounded-none bg-white/5" />
                  <div className="p-6 flex-1 flex flex-col gap-4">
                    <div className="flex items-center gap-4 -mt-12">
                      <Skeleton className="w-20 h-20 rounded-full border-4 border-black bg-white/10" />
                      <div className="flex-1 pt-8">
                        <Skeleton className="h-6 w-3/4 mb-2 bg-white/10" />
                        <Skeleton className="h-4 w-1/2 bg-white/5" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full bg-white/5" />
                    <Skeleton className="h-4 w-2/3 bg-white/5" />
                    <div className="mt-auto flex gap-2">
                      <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
                      <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            {filteredStreamers.map((streamer, i) => (
              <div key={streamer.username} className="transform transition-all duration-500 hover:z-10">
                <StreamerCard 
                  streamer={streamer} 
                  onRetry={() => retryStreamer(streamer.username)}
                />
              </div>
            ))}
            
            {filteredStreamers.length === 0 && (
              <div className="col-span-full text-center py-20 text-red-200/50">
                لا توجد نتائج مطابقة للبحث
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const StreamerCard: React.FC<{ streamer: Channel; onRetry: () => void }> = ({ streamer, onRetry }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await onRetry();
    setIsRetrying(false);
  };

  if (streamer.isLoading) {
    return (
      <GlassCard className="h-[420px] p-0 overflow-hidden flex flex-col border-red-500/10 bg-black/40">
        <Skeleton className="h-32 w-full rounded-none bg-white/5" />
        <div className="p-6 flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-4 -mt-12">
            <Skeleton className="w-20 h-20 rounded-full border-4 border-black bg-white/10" />
            <div className="flex-1 pt-8">
              <Skeleton className="h-6 w-3/4 mb-2 bg-white/10" />
              <Skeleton className="h-4 w-1/2 bg-white/5" />
            </div>
          </div>
          <Skeleton className="h-4 w-full bg-white/5" />
          <Skeleton className="h-4 w-2/3 bg-white/5" />
          <div className="mt-auto flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
            <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
          </div>
        </div>
      </GlassCard>
    );
  }

  if (streamer.error) {
    return (
      <GlassCard className="p-0 overflow-hidden flex flex-col h-[420px] items-center justify-center group hover:shadow-red-500/10 transition-all duration-500 border-red-500/20 bg-red-500/5">
        <div className="text-center p-6 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-2">
            <WifiOff className="text-red-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white">@{streamer.username}</h3>
          <p className="text-red-400/70 text-sm mb-4">فشل في جلب البيانات</p>
          <button 
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
          >
            <RefreshCw size={18} className={isRetrying ? 'animate-spin' : ''} />
            {isRetrying ? 'جاري التحميل...' : 'إعادة تحميل'}
          </button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-0 overflow-hidden flex flex-col h-[420px] group hover:shadow-red-500/20 hover:-translate-y-1 transition-all duration-500 border-red-500/20 bg-gradient-to-b from-black/60 to-black/80">
      {/* Banner */}
      <div className="h-32 w-full relative overflow-hidden bg-black/50 shrink-0">
        <ProgressiveImage 
          src={streamer.banner || 'https://i.postimg.cc/x17d7rZT/IMG_9108.jpg'} 
          alt={`${streamer.username} banner`} 
          width={800}
          height={300}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90" />
        
        {/* Live Status Badge */}
        <div className="absolute top-3 left-3">
          {streamer.live ? (
            <div className="flex items-center gap-2 bg-red-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              <Wifi size={14} />
              LIVE
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md text-gray-400 px-3 py-1 rounded-full text-xs font-bold border border-white/10">
              <WifiOff size={14} />
              OFFLINE
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col relative">
        {/* Avatar */}
        <div className="absolute -top-12 right-5 z-20">
          <div className={`p-1 rounded-full ${streamer.live ? 'bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-black border border-red-500/20'}`}>
            <ProgressiveImage 
              src={streamer.avatar || 'https://i.postimg.cc/mgqrqxng/IMG-9107.jpg'} 
              alt={streamer.username} 
              width={150}
              height={150}
              className="w-24 h-24 rounded-full object-cover border-4 border-black shadow-xl bg-black"
            />
          </div>
        </div>

        {/* Header Info */}
        <div className="mt-10 mb-4 shrink-0">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 truncate">
            {streamer.username}
            {streamer.live && <span className="w-2 h-2 bg-red-500 rounded-full animate-ping shrink-0" />}
          </h3>
          <p className="text-red-400/70 text-sm font-mono truncate">@{streamer.username}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4 shrink-0">
          <div className="bg-white/5 rounded-lg p-2 text-center border border-red-500/10">
            <div className="text-xs text-red-300/50 mb-1">المتابعون</div>
            <div className="font-mono font-bold text-red-100">
              {new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(streamer.followers || 0)}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center border border-red-500/10 flex flex-col justify-center">
            <div className="text-xs text-red-300/50 mb-1">{streamer.live ? 'المشاهدون' : 'آخر بث'}</div>
            <div className="font-mono font-bold text-red-100 text-xs flex items-center justify-center">
              {streamer.live ? (
                <span className="text-red-400">{streamer.viewers?.toLocaleString()}</span>
              ) : (
                <span className="text-[10px] leading-tight opacity-70 whitespace-nowrap">
                  {streamer.last_stream && !isNaN(Date.parse(streamer.last_stream))
                    ? formatDistanceToNow(new Date(streamer.last_stream), { addSuffix: true, locale: ar })
                    : 'غير متوفر'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stream Info */}
        <div className="bg-red-500/5 rounded-xl p-3 mb-4 border border-red-500/10 flex-1 overflow-hidden flex flex-col">
          <div className="text-xs text-red-400 mb-1 font-bold uppercase tracking-wider shrink-0">
            {streamer.live ? 'يبث الآن' : 'النبذة/البايو'}
          </div>
          <p className="text-sm text-red-100/90 line-clamp-2 leading-relaxed flex-1" title={streamer.title || ''}>
            {streamer.title || streamer.bio || 'لا يوجد نبذة/بايو'}
          </p>
          <div className="mt-2 flex items-center gap-2 shrink-0">
            <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-300 border border-red-500/20 truncate max-w-full">
              General
            </span>
          </div>
        </div>

        {/* Socials */}
        <div className="mt-auto pt-4 border-t border-red-500/10 flex gap-2 justify-end flex-wrap shrink-0">
          {isValidSocialLink(streamer.socials.twitter) && (
            <SocialIcon href={streamer.socials.twitter} icon={Twitter} className="text-[#1DA1F2] bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20" />
          )}
          {isValidSocialLink(streamer.socials.instagram) && (
            <SocialIcon href={streamer.socials.instagram} icon={Instagram} className="text-pink-400 bg-pink-500/10 hover:bg-pink-500/20" />
          )}
          {isValidSocialLink(streamer.socials.youtube) && (
            <SocialIcon href={streamer.socials.youtube} icon={Youtube} className="text-red-500 bg-red-500/10 hover:bg-red-500/20" />
          )}
          {isValidSocialLink(streamer.socials.discord) && (
            <SocialIcon href={streamer.socials.discord} icon={DiscordIcon} className="text-[#5865F2] bg-[#5865F2]/10 hover:bg-[#5865F2]/20" />
          )}
          {isValidSocialLink(streamer.socials.tiktok) && (
            <SocialIcon href={streamer.socials.tiktok} icon={({size, className}) => (
               <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
            )} className="text-pink-400 bg-pink-500/10 hover:bg-pink-500/20" />
          )}
           <a 
            href={`https://kick.com/${streamer.username}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-auto bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
          >
            KICK
          </a>
        </div>
      </div>
    </GlassCard>
  );
};

const SocialIcon: React.FC<{ href: string; icon: any; className: string }> = ({ href, icon: Icon, className }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className={`p-2 rounded-lg transition-all duration-300 ${className}`}
  >
    <Icon size={16} />
  </a>
);
