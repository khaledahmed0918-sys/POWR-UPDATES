/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MainLayout } from './components/layout/MainLayout';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { FeaturesSection } from './components/sections/FeaturesSection';
import { AchievementsSection } from './components/sections/AchievementsSection';
import { StatsSection } from './components/sections/StatsSection';
import { TournamentsSection } from './components/sections/TournamentsSection';
import { LatestNewsSection } from './components/sections/LatestNewsSection';
import { TeamSection } from './components/sections/TeamSection';
import { SocialsSection } from './components/sections/SocialsSection';
import { CreditsSection } from './components/sections/CreditsSection';
import { FooterSection } from './components/sections/FooterSection';

export default function App() {
  return (
    <MainLayout>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <AchievementsSection />
      <StatsSection />
      <TournamentsSection />
      <LatestNewsSection />
      <TeamSection />
      <SocialsSection />
      <CreditsSection />
      <FooterSection />
    </MainLayout>
  );
}
