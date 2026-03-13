import { motion } from 'motion/react';
import { Avatar } from '../ui/Avatar';
import { Container } from '../layout/Container';

export function HeroSection() {
  return (
    <section className="relative w-full flex flex-col items-center pb-16">
      {/* Banner Background - Full Width */}
      <div className="absolute top-0 left-0 w-full h-[300px] md:h-[450px] -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1A0505]/60 to-[var(--color-brand-dark)] z-10" />
        <motion.img 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://i.postimg.cc/x17d7rZT/IMG_9108.jpg" 
          alt="POWR UPDATES Banner" 
          className="w-full h-full object-cover object-center opacity-90"
          referrerPolicy="no-referrer"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </div>

      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col items-center mt-40 md:mt-64"
        >
          <Avatar 
            src="https://i.postimg.cc/mgqrqxng/IMG-9107.jpg" 
            alt="POWR UPDATES Avatar" 
            size="xl"
            className="mb-6 shadow-[0_0_50px_rgba(139,0,0,0.6)] border-red-900/50 transition-transform duration-500 hover:scale-105"
          />
          <h1 className="text-5xl md:text-7xl font-black text-center tracking-wider text-white drop-shadow-2xl leading-tight">
            POWR<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">UPDATES</span>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-6 text-gray-300 text-lg md:text-xl font-medium text-center max-w-2xl leading-relaxed"
          >
            المصدر الأول والأسرع لأخبار وتحديثات باور إيسبورتس. نضعك في قلب الحدث لحظة بلحظة.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
