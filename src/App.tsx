/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { FeaturesSection } from './components/sections/FeaturesSection';
import { AchievementsSection } from './components/sections/AchievementsSection';
import { StatsSection } from './components/sections/StatsSection';
import { TournamentsSection } from './components/sections/TournamentsSection';
import { LatestNewsSection } from './components/sections/LatestNewsSection';
import { LatestVideosSection } from './components/sections/LatestVideosSection';
import { TeamSection } from './components/sections/TeamSection';
import { SocialsSection } from './components/sections/SocialsSection';
import { CreditsSection } from './components/sections/CreditsSection';
import { FooterSection } from './components/sections/FooterSection';
import { CombinedSection } from './components/sections/CombinedSection';
import { ImagePopup } from './components/ui/ImagePopup';

export default function App() {
  const [popupImage, setPopupImage] = useState<string | null>(null);

  return (
    <MainLayout>
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
      <TournamentsSection />
      <LatestVideosSection setPopupImage={setPopupImage} />
      <LatestNewsSection />
      <TeamSection />
      <CreditsSection />
      <FooterSection />
      
      <ImagePopup isOpen={!!popupImage} onClose={() => setPopupImage(null)} imageUrl={popupImage || ''} />
    </MainLayout>
  );
}
