import { useState, useEffect } from 'react';
import { Container } from '../layout/Container';
import { SectionTitle } from '../ui/SectionTitle';
import { Card } from '../ui/Card';
import { FaXTwitter, FaHeart, FaRetweet, FaPlay } from 'react-icons/fa6';
import { TimelineSection } from '../layout/TimelineSection';
import { ImagePopup } from '../ui/ImagePopup';

interface Tweet {
  text: string;
  url?: string;
  date: string;
  likes?: number;
  reposts?: number;
  images?: string[];
  videos?: string[];
}

interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

export function LatestNewsSection() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  async function loadTweets() {
    try {
      const res = await fetch("https://dolabriform-fascinatedly-lecia.ngrok-free.dev/api/tweets", {
        headers: {
          "ngrok-skip-browser-warning": "true"
        }
      });
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No tweets found.');
      }

      setTweets(data);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching/parsing tweets:", err);
      setError('تعذر جلب التغريدات حالياً. يرجى المحاولة لاحقاً.');
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTweets();
    const interval = setInterval(() => loadTweets(), 30000);
    return () => clearInterval(interval);
  }, []);

  const getMediaType = (url: string): 'video' | 'image' => {
    return /\.(mp4|webm|ogg)$/i.test(url) ? 'video' : 'image';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ar-SA', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <TimelineSection className="bg-black/20 border-y border-white/5 overflow-hidden">
        <Container>
          <SectionTitle title="أحدث التغريدات" subtitle="جاري تحميل التغريدات..." />
        </Container>
        <div dir="ltr" className="w-full overflow-hidden mt-8 relative">
          <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#0a0000] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#0a0000] to-transparent z-10 pointer-events-none" />
          
          <div className="flex w-max gap-8 px-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="w-[300px] md:w-[400px] h-64 flex flex-col border-white/5 bg-white/5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full"></div>
                  <div className="flex-1">
                    <div className="w-24 h-4 bg-white/10 rounded mb-2"></div>
                    <div className="w-16 h-3 bg-white/10 rounded"></div>
                  </div>
                </div>
                <div className="space-y-3 mt-2">
                  <div className="w-full h-4 bg-white/10 rounded"></div>
                  <div className="w-5/6 h-4 bg-white/10 rounded"></div>
                  <div className="w-4/6 h-4 bg-white/10 rounded"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </TimelineSection>
    );
  }

  if (error && tweets.length === 0) {
    return (
      <TimelineSection className="bg-black/20 border-y border-white/5">
        <Container>
          <SectionTitle title="أحدث التغريدات" subtitle="مقتطفات من أحدث تغريداتنا على منصة X" />
          <div className="text-center text-red-400 py-8 bg-red-900/10 rounded-2xl border border-red-900/20">
            {error}
          </div>
        </Container>
      </TimelineSection>
    );
  }

  return (
    <TimelineSection className="bg-black/20 border-y border-white/5 overflow-hidden">
      <Container>
        <SectionTitle title="أحدث التغريدات" subtitle="مقتطفات من أحدث تغريداتنا على منصة X" />
      </Container>

      {/* Image Popup */}
      <ImagePopup 
        isOpen={!!selectedMedia && selectedMedia.type === 'image'} 
        onClose={() => setSelectedMedia(null)} 
        imageUrl={selectedMedia?.type === 'image' ? selectedMedia.url : ''} 
      />
      
      {/* Video Lightbox (Keep for video) */}
      {selectedMedia && selectedMedia.type === 'video' && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <video 
              src={selectedMedia.url} 
              controls 
              autoPlay 
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl" 
            />
          </div>
        </div>
      )}
      
      {/* Manual Scroll Container */}
      <div 
        dir="ltr" 
        className="w-full overflow-x-auto mt-8 relative scroll-smooth snap-x snap-mandatory"
      >
        <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#0a0000] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#0a0000] to-transparent z-10 pointer-events-none" />
        
        <div 
          className="flex w-max gap-8 px-4 pb-4"
        >
          {tweets.map((tweet, index) => (
            <a 
              key={`${tweet.url || index}-${index}`}
              href={tweet.url || "https://x.com/powrupdates"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[300px] md:w-[400px] flex-shrink-0 group snap-start"
              dir="rtl"
            >
              <Card className="flex flex-col h-full text-right border-white/10 hover:border-[#1DA1F2]/50 hover:shadow-[0_10px_40px_-10px_rgba(29,161,242,0.3)] transition-all duration-300">
                
                {/* Header: Avatar & Name */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                      <img 
                        src="https://i.postimg.cc/mgqrqxng/IMG-9107.jpg" 
                        alt="POWR UPDATES" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png";
                        }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-sm">POWR UPDATES</span>
                      <span className="text-xs text-gray-500" dir="rtl">{formatDate(tweet.date)}</span>
                    </div>
                  </div>
                  <div className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] group-hover:text-[#1DA1F2] group-hover:drop-shadow-[0_0_8px_rgba(29,161,242,0.6)] transition-all duration-300">
                    <FaXTwitter size={20} />
                  </div>
                </div>

                {/* Body: Text */}
                <p className="text-white text-sm md:text-base leading-relaxed mb-4 whitespace-pre-wrap">
                  {tweet.text}
                </p>

                {/* Media: Images */}
                {tweet.images && tweet.images.length > 0 && (
                  <div className={`grid gap-2 mb-4 ${tweet.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {tweet.images.map((img, idx) => {
                      const type = getMediaType(img);
                      return (
                        <div 
                          key={idx} 
                          className="rounded-xl overflow-hidden bg-black/50 border border-white/5 aspect-video relative cursor-pointer group/media"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedMedia({ url: img, type });
                          }}
                        >
                          {type === 'video' ? (
                            <>
                              <video src={img} className="absolute inset-0 w-full h-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/media:bg-black/50 transition-colors">
                                <div className="text-white opacity-80">
                                  <FaPlay size={32} />
                                </div>
                              </div>
                            </>
                          ) : (
                            <img 
                              src={img} 
                              alt="Tweet media" 
                              className="absolute inset-0 w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-500" 
                              loading="lazy" 
                              referrerPolicy="no-referrer" 
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Footer: Stats */}
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-4">
                    {tweet.reposts && tweet.reposts > 0 ? (
                      <span className="flex items-center gap-1.5 hover:text-[#00BA7C] transition-colors">
                        <FaRetweet size={14} /> {tweet.reposts}
                      </span>
                    ) : null}
                    {tweet.likes && tweet.likes > 0 ? (
                      <span className="flex items-center gap-1.5 hover:text-[#F91880] transition-colors">
                        <FaHeart size={14} /> {tweet.likes}
                      </span>
                    ) : null}
                  </div>
                  <span className="text-red-500 group-hover:text-[#1DA1F2] transition-colors duration-300">عرض على X &larr;</span>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </TimelineSection>
  );
}
