/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MainLayout } from './components/layout/MainLayout';
import { HeroSection } from './components/sections/HeroSection';
import { FeaturesSection } from './components/sections/FeaturesSection';
import { StatsSection } from './components/sections/StatsSection';
import { LatestNewsSection } from './components/sections/LatestNewsSection';
import { SocialsSection } from './components/sections/SocialsSection';
import { CreditsSection } from './components/sections/CreditsSection';
import { FooterSection } from './components/sections/FooterSection';

export default function App() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <LatestNewsSection />
      <SocialsSection />
      <CreditsSection />
      <FooterSection />
    </MainLayout>
  );
}
