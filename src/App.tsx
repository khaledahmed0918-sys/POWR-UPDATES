import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { FeaturesSection } from './components/sections/FeaturesSection';
import { AchievementsSection } from './components/sections/AchievementsSection';
import { StatsSection } from './components/sections/StatsSection';
import { FollowerDemographicsSection } from './components/sections/FollowerDemographicsSection';
import { TournamentsSection } from './components/sections/TournamentsSection';
import { LatestNewsSection } from './components/sections/LatestNewsSection';
import { LatestVideosSection } from './components/sections/LatestVideosSection';
import { TeamSection } from './components/sections/TeamSection';
import { SocialsSection } from './components/sections/SocialsSection';
import { CreditsSection } from './components/sections/CreditsSection';
import { FooterSection } from './components/sections/FooterSection';
import { CombinedSection } from './components/sections/CombinedSection';
import { ImagePopup } from './components/ui/ImagePopup';
import { Streamers } from './components/sections/Streamer';
import { StreamerProvider } from './context/StreamerContext';
import { SnowEffect } from './components/ui/SnowEffect';
import { Home, MonitorPlay, Snowflake, Droplets } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-center">
        <div className="flex items-center gap-12">
          <Link 
            to="/" 
            title="الرئيسية"
            className={`transition-all duration-300 hover:scale-110 ${location.pathname === '/' ? 'text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]' : 'text-white/60 hover:text-white'}`}
          >
            <Home size={28} />
          </Link>
          <Link 
            to="/streamers" 
            title="البثوث"
            className={`transition-all duration-300 hover:scale-110 ${location.pathname === '/streamers' ? 'text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]' : 'text-white/60 hover:text-white'}`}
          >
            <MonitorPlay size={28} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

function FloatingSnowToggle({ snowEnabled, setSnowEnabled }: { snowEnabled: boolean, setSnowEnabled: (v: boolean) => void }) {
  return (
    <motion.button
      onClick={() => setSnowEnabled(!snowEnabled)}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full glass-card flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] hover:scale-110 transition-all duration-300 border border-white/20"
      whileTap={{ scale: 0.9 }}
      title={snowEnabled ? "إيقاف الثلج" : "تشغيل الثلج"}
    >
      <AnimatePresence mode="wait">
        {snowEnabled ? (
          <motion.div
            key="snow"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <Snowflake className="text-sky-300 drop-shadow-[0_0_5px_rgba(14,165,233,0.8)]" size={28} />
          </motion.div>
        ) : (
          <motion.div
            key="drop"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <Droplets className="text-sky-500/70" size={28} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function HomePage({ setPopupImage }: { setPopupImage: (url: string | null) => void }) {
  return (
    <>
      <HeroSection />
      <CombinedSection left={<AboutSection />} right={<SocialsSection />} />
      <CombinedSection left={<FeaturesSection />} right={<StatsSection />} />
      <AchievementsSection />
      <FollowerDemographicsSection />
      <TournamentsSection />
      <LatestVideosSection setPopupImage={setPopupImage} />
      <LatestNewsSection />
      <TeamSection />
      <CreditsSection />
      <FooterSection />
    </>
  );
}

function StreamersPage() {
  return (
    <>
      <HeroSection />
      <Streamers />
      <SocialsSection />
      <FooterSection />
    </>
  );
}

export default function App() {
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const [snowEnabled, setSnowEnabled] = useState(() => {
    const saved = localStorage.getItem('snowEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('snowEnabled', JSON.stringify(snowEnabled));
  }, [snowEnabled]);

  return (
    <StreamerProvider>
      <Router>
        <ScrollToTop />
        <SnowEffect enabled={snowEnabled} />
        <MainLayout>
          <Navigation />
          <FloatingSnowToggle snowEnabled={snowEnabled} setSnowEnabled={setSnowEnabled} />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<HomePage setPopupImage={setPopupImage} />} />
              <Route path="/streamers" element={<StreamersPage />} />
            </Routes>
          </div>
          <ImagePopup isOpen={!!popupImage} onClose={() => setPopupImage(null)} imageUrl={popupImage || ''} />
        </MainLayout>
      </Router>
    </StreamerProvider>
  );
}
