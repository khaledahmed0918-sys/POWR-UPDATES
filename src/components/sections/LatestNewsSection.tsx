import { useState, useEffect } from 'react';
import { Container } from '../layout/Container';
import { SectionTitle } from '../ui/SectionTitle';
import { Card } from '../ui/Card';
import { FaXTwitter } from 'react-icons/fa6';

interface Tweet {
  id: string;
  title: string;
  link: string;
  pubDate: string;
}

export function LatestNewsSection() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTweets = async () => {
    try {
      const response = await fetch('/api/twitter');
      if (!response.ok) throw new Error('Failed to fetch tweets');
      
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      const items = Array.from(xmlDoc.querySelectorAll('item')).slice(0, 5);
      
      if (items.length === 0) throw new Error('No tweets found in RSS');

      const parsedTweets = items.map((item, index) => ({
        id: item.querySelector('guid')?.textContent || String(index),
        title: item.querySelector('title')?.textContent || '',
        link: item.querySelector('link')?.textContent || '',
        pubDate: item.querySelector('pubDate')?.textContent || '',
      }));

      setTweets(parsedTweets);
      setError(null);
    } catch (err) {
      console.error('Error fetching tweets:', err);
      setError('تعذر جلب التغريدات حالياً. سيتم المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
    // تحديث التغريدات كل 45 ثانية
    const interval = setInterval(fetchTweets, 45000);
    return () => clearInterval(interval);
  }, []);

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
      <section className="w-full py-16 bg-black/20 border-y border-white/5">
        <Container>
          <SectionTitle title="أحدث التغريدات" subtitle="جاري تحميل التغريدات..." />
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        </Container>
      </section>
    );
  }

  if (error && tweets.length === 0) {
    return (
      <section className="w-full py-16 bg-black/20 border-y border-white/5">
        <Container>
          <SectionTitle title="أحدث التغريدات" subtitle="مقتطفات من أحدث تغريداتنا على منصة X" />
          <div className="text-center text-red-400 py-8 bg-red-900/10 rounded-2xl border border-red-900/20">
            {error}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="w-full py-16 bg-black/20 border-y border-white/5 overflow-hidden">
      <Container>
        <SectionTitle title="أحدث التغريدات" subtitle="مقتطفات من أحدث تغريداتنا على منصة X" />
      </Container>
      
      {/* Marquee Container (dir="ltr" ensures standard left-to-right scrolling logic) */}
      <div dir="ltr" className="w-full overflow-hidden mt-8 relative">
        {/* Gradient masks for smooth fade on edges */}
        <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#0a0000] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#0a0000] to-transparent z-10 pointer-events-none" />
        
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {/* Duplicate tweets array to create an infinite loop effect */}
          {[...tweets, ...tweets].map((tweet, index) => (
            <a 
              key={`${tweet.id}-${index}`}
              href={tweet.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[300px] md:w-[400px] mx-4 block flex-shrink-0 group"
              dir="rtl"
            >
              <Card className="flex flex-col h-full text-right border-white/10 hover:border-[#1DA1F2]/50 hover:shadow-[0_10px_40px_-10px_rgba(29,161,242,0.3)] transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <FaXTwitter className="text-gray-400 group-hover:text-[#1DA1F2] transition-colors duration-300" size={24} />
                  <span className="text-xs text-gray-500" dir="rtl">{formatDate(tweet.pubDate)}</span>
                </div>
                <p className="text-white text-sm md:text-base leading-relaxed mb-4 line-clamp-4">
                  {tweet.title}
                </p>
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center text-xs text-gray-400">
                  <span className="text-red-500 group-hover:text-[#1DA1F2] transition-colors duration-300">عرض على X &larr;</span>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
