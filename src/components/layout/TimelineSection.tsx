import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { cn } from '../../utils/cn';

interface TimelineSectionProps {
  children: React.ReactNode;
  isSplit?: boolean;
  className?: string;
  isLast?: boolean;
}

export function TimelineSection({ children, isSplit = false, className, isLast = false }: TimelineSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={ref} className={cn("relative w-full py-16", className)}>
      {/* Background Line with subtle glow and mask */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none flex justify-center opacity-40 md:opacity-60"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
        }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
          {/* Always show straight line on mobile, or if not split */}
          <g className={isSplit ? "lg:hidden" : ""}>
            <path 
              d="M 50 0 L 50 100" 
              fill="none" 
              stroke="rgba(255,255,255,0.05)" 
              strokeWidth="1" 
              vectorEffect="non-scaling-stroke" 
            />
            <motion.path 
              d="M 50 0 L 50 100" 
              fill="none" 
              stroke="#ef4444" 
              strokeWidth="2" 
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: scaleY }}
            />
          </g>

          {/* Show split line only on lg screens when isSplit is true */}
          {isSplit && (
            <g className="hidden lg:block">
              {/* Left Branch */}
              <path 
                d="M 50 0 L 50 5 L 25 15 L 25 85 L 50 95 L 50 100" 
                fill="none" 
                stroke="rgba(255,255,255,0.05)" 
                strokeWidth="1" 
                vectorEffect="non-scaling-stroke" 
              />
              <motion.path 
                d="M 50 0 L 50 5 L 25 15 L 25 85 L 50 95 L 50 100" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="2" 
                vectorEffect="non-scaling-stroke"
                style={{ pathLength: scaleY }}
              />
              
              {/* Right Branch */}
              <path 
                d="M 50 0 L 50 5 L 75 15 L 75 85 L 50 95 L 50 100" 
                fill="none" 
                stroke="rgba(255,255,255,0.05)" 
                strokeWidth="1" 
                vectorEffect="non-scaling-stroke" 
              />
              <motion.path 
                d="M 50 0 L 50 5 L 75 15 L 75 85 L 50 95 L 50 100" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="2" 
                vectorEffect="non-scaling-stroke"
                style={{ pathLength: scaleY }}
              />
            </g>
          )}
        </svg>
      </div>

      {/* Glassmorphism Scroll to Top Button at the end of the very last section */}
      {isLast && (
        <button 
          onClick={scrollToTop}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 w-14 h-14 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-red-500 hover:bg-white/10 hover:text-red-400 hover:scale-110 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all duration-300 cursor-pointer group"
          aria-label="العودة للأعلى"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-1 transition-transform duration-300">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        </button>
      )}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
