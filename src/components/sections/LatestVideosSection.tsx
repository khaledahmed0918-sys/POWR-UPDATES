import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Container } from '../layout/Container';
import { SectionTitle } from '../ui/SectionTitle';
import { Card } from '../ui/Card';
import { FaPlay, FaEye, FaHeart } from 'react-icons/fa6';
import { TimelineSection } from '../layout/TimelineSection';
import { MARQUEE_DURATION } from '../../constants';

interface Video {
  channelId: string;
  channelName: string;
  channelAvatar: string;
  videoId: string;
  title: string;
  url: string;
  thumbnail: string;
  views: number;
  likes: number;
  published: string;
}

export function LatestVideosSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    if (containerRef.current) {
      // The scrollWidth is the width of all items (videos + videos).
      // We want to animate through one set of videos (half the scrollWidth).
      const totalWidth = containerRef.current.scrollWidth;
      const setWidth = totalWidth / 2;
      setConstraints(setWidth);
    }
  }, [videos]);

  useEffect(() => {
    if (constraints > 0) {
      controls.start({
        x: [0, -constraints],
        transition: { repeat: Infinity, ease: "linear", duration: MARQUEE_DURATION }
      });
    }
  }, [controls, constraints]);

  async function loadVideos() {
    try {
      const res = await fetch("https://dolabriform-fascinatedly-lecia.ngrok-free.dev/last", {
        headers: {
          "ngrok-skip-browser-warning": "true"
        }
      });
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No videos found.');
      }

      setVideos(data);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching/parsing videos:", err);
      setError('تعذر جلب الفيديوهات حالياً. يرجى المحاولة لاحقاً.');
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVideos();
    const interval = setInterval(() => loadVideos(), 45000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ar-SA', {
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <TimelineSection className="bg-black/20 border-y border-white/5 overflow-hidden">
        <Container>
          <SectionTitle title="أحدث الفيديوهات" subtitle="جاري تحميل الفيديوهات..." />
        </Container>
        <div className="flex w-max gap-8 px-4 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="w-[320px] h-[300px] flex flex-col border-white/5 bg-white/5 animate-pulse p-0 overflow-hidden">
              <div className="w-full aspect-video bg-white/10"></div>
              <div className="p-4 flex flex-col flex-grow space-y-3">
                <div className="w-full h-4 bg-white/10 rounded"></div>
                <div className="w-5/6 h-4 bg-white/10 rounded"></div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-6 h-6 bg-white/10 rounded-full"></div>
                  <div className="w-20 h-3 bg-white/10 rounded"></div>
                </div>
                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between">
                  <div className="w-12 h-3 bg-white/10 rounded"></div>
                  <div className="w-12 h-3 bg-white/10 rounded"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </TimelineSection>
    );
  }

  return (
    <TimelineSection className="bg-black/20 border-y border-white/5 overflow-hidden">
      <Container>
        <SectionTitle title="أحدث الفيديوهات" subtitle="آخر مقاطع صناع المحتوى في باور" />
      </Container>

      <div className="w-full overflow-hidden mt-8 relative cursor-grab active:cursor-grabbing" ref={containerRef}>
        <motion.div 
          className="flex w-max gap-8 px-4 pb-4"
          drag="x"
          dragConstraints={{ right: 0, left: -constraints }}
          whileTap={{ cursor: "grabbing" }}
          animate={controls}
          onDragStart={() => controls.stop()}
          onDragEnd={() => controls.start({
            x: [0, -constraints],
            transition: { repeat: Infinity, ease: "linear", duration: MARQUEE_DURATION }
          })}
        >
          {videos.map((video, index) => (
            <a 
              key={`${video.videoId}-${index}`}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[320px] flex-shrink-0 group"
              dir="rtl"
            >
              <Card className="flex flex-col h-full border-white/10 hover:border-red-600/50 hover:shadow-[0_10px_40px_-10px_rgba(220,38,38,0.3)] transition-all duration-300 p-0 overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaPlay size={48} />
                  </div>
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-white font-bold text-sm line-clamp-2 mb-2 group-hover:text-red-500 transition-colors">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <img src={video.channelAvatar} alt={video.channelName} className="w-6 h-6 rounded-full" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
                    <span className="text-xs text-gray-400 truncate">{video.channelName}</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaEye size={12} /> {formatNumber(video.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaHeart size={12} /> {formatNumber(video.likes)}
                    </span>
                    <span>{formatDate(video.published)}</span>
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </motion.div>
      </div>
    </TimelineSection>
  );
}
