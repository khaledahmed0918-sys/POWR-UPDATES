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

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function Navigation({ snowEnabled, setSnowEnabled }: { snowEnabled: boolean, setSnowEnabled: (v: boolean) => void }) {
  const location = useLocation();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="w-10"></div> {/* Spacer */}
        <div className="flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-lg font-bold transition-colors ${location.pathname === '/' ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'text-white/70 hover:text-white'}`}
          >
            الرئيسية
          </Link>
          <Link 
            to="/streamers" 
            className={`text-lg font-bold transition-colors ${location.pathname === '/streamers' ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'text-white/70 hover:text-white'}`}
          >
            البثوث
          </Link>
        </div>
        <button 
          onClick={() => setSnowEnabled(!snowEnabled)}
          className="text-2xl hover:scale-110 transition-transform drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
          title={snowEnabled ? "إيقاف الثلج" : "تشغيل الثلج"}
        >
          {snowEnabled ? '❄️' : '🧊'}
        </button>
      </div>
    </nav>
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
          <Navigation snowEnabled={snowEnabled} setSnowEnabled={setSnowEnabled} />
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
