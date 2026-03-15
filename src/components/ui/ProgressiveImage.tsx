import React, { useState, useEffect } from 'react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({ src, alt, className = '', width, height }) => {
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [blur, setBlur] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout;
    let attempt = 0;

    // Generate URLs for different qualities
    const tinyRes = `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=${Math.max(10, Math.floor(width/20))}&h=${Math.max(10, Math.floor(height/20))}&fit=cover&output=webp&q=10`;
    const lowRes = `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=${Math.max(50, Math.floor(width/4))}&h=${Math.max(50, Math.floor(height/4))}&fit=cover&output=webp&q=30`;
    const highRes = `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=${width}&h=${height}&fit=cover&output=webp&q=80`;

    const loadImage = (url: string) => new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(url);
      img.onerror = reject;
    });

    const attemptLoad = async () => {
      try {
        // 1. Load tiny res immediately for placeholder
        if (isMounted && !currentSrc) {
          setCurrentSrc(tinyRes);
          setBlur(true);
        }

        // 2. Load low res
        if (isMounted) {
          await loadImage(lowRes);
          if (isMounted) {
            setCurrentSrc(lowRes);
            setBlur(true);
          }
        }

        // 3. Load high res
        if (isMounted) {
          await loadImage(highRes);
          if (isMounted) {
            setCurrentSrc(highRes);
            setBlur(false);
          }
        }
      } catch (err) {
        // If any load fails, retry indefinitely with exponential backoff
        if (isMounted) {
          attempt++;
          const delay = Math.min(1000 * Math.pow(1.5, attempt), 10000); // Max 10s delay between retries
          retryTimeout = setTimeout(attemptLoad, delay);
        }
      }
    };

    attemptLoad();

    return () => {
      isMounted = false;
      clearTimeout(retryTimeout);
    };
  }, [src, width, height]);

  return (
    <img
      src={currentSrc || `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=10&h=10&fit=cover&output=webp&q=1`}
      alt={alt}
      className={`${className} transition-all duration-1000 ${blur ? 'blur-md scale-110' : 'blur-0 scale-100'}`}
      loading="lazy"
      decoding="async"
    />
  );
};
