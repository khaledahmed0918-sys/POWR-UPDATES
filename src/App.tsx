/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
import { CoinsTasksSection } from './components/sections/CoinsTasksSection';

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-center gap-8">
        <Link 
          to="/" 
          className={`text-lg font-bold transition-colors ${location.pathname === '/' ? 'text-blue-400' : 'text-white/70 hover:text-white'}`}
        >
          الرئيسية
        </Link>
        <Link 
          to="/streamers" 
          className={`text-lg font-bold transition-colors ${location.pathname === '/streamers' ? 'text-blue-400' : 'text-white/70 hover:text-white'}`}
        >
          البثوث
        </Link>
      </div>
    </nav>
  );
}

function HomePage({ setPopupImage }: { setPopupImage: (url: string | null) => void }) {
  return (
    <>
      <HeroSection />
      
      <CombinedSection 
        left={<AboutSection />} 
        right={<SocialsSection />} 
      />
      
      <CombinedSection 
        left={<FeaturesSection />} 
        right={<StatsSection />} 
      />
      
      <AchievementsSection />
      <FollowerDemographicsSection />
      <TournamentsSection />
      <CoinsTasksSection />
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

  return (
    <StreamerProvider>
      <Router>
        <ScrollToTop />
        <MainLayout>
          <Navigation />
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
