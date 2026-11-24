import React, {Suspense, lazy} from 'react';
import {HeroSection} from '../sections/HeroSection';
import {HeadlineSection} from '../sections/HeadlineSection';
import {Footer} from '../components/Footer';

const WhySightline = lazy(() => import('../sections/WhyOrchestrateIQ'));
const FeaturesSection = lazy(() => import('../sections/FeaturesSection'));
const DashboardSection = lazy(() => import('../sections/DashboardSection'));
const HowItWorks = lazy(() => import('../sections/HowItWorks'));
const Testimonials = lazy(() => import('../sections/Testimonials'));
const PricingTeaser = lazy(() => import('../sections/PricingTeaser'));
const FaqSection = lazy(() => import('../sections/FaqSection'));
const FinalCta = lazy(() => import('../sections/FinalCta'));

const SectionFallback: React.FC<{dark?: boolean}> = ({dark}) => (
  <div className="mx-3 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-12 px-4 sm:px-6 lg:px-10">
    <div
      className={`w-full min-h-[420px] rounded-[8px] animate-pulse ${
        dark ? 'bg-[#0A1F6B]/90' : 'bg-[#0B0B0B]/5'
      }`}
    />
  </div>
);

export const Home: React.FC = () => {
  return (
    <main className="pb-4">
      {/* Phase 1: Hero + Logo Strip + Headline Block */}
      <HeroSection />
      <HeadlineSection />

      {/* Phase 2: Why Sightline */}
      <Suspense fallback={<SectionFallback dark />}>
        <WhySightline />
      </Suspense>

      {/* Phase 3: Features (Pinned Horizontal Scroll) */}
      <Suspense fallback={<SectionFallback />}>
        <FeaturesSection />
      </Suspense>

      {/* Phase 4: Live Dashboard */}
      <Suspense fallback={<SectionFallback dark />}>
        <DashboardSection />
      </Suspense>

      {/* Phase 5: Remaining Home Sections */}
      <Suspense fallback={<SectionFallback />}>
        <HowItWorks />
      </Suspense>

      <Suspense fallback={<SectionFallback dark />}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <PricingTeaser />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <FaqSection />
      </Suspense>

      <Suspense fallback={<SectionFallback dark />}>
        <FinalCta />
      </Suspense>

      <Footer />
    </main>
  );
};
