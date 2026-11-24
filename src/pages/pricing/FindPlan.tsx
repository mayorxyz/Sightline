import React from 'react';
import {PageHeader} from '../../components/PageHeader';
import {PricingSubNav} from './pricing  components/PricingSubNav';
import {PlanQuiz} from './pricing  components/PlanQuiz';
import {Footer} from '../../components/Footer';

export const FindPlan: React.FC = () => {
  return (
    <main className="pb-4">
      <PageHeader
        tag="Find My Plan"
        lines={[
          <>Find The Plan That</>,
          <>
            <span className="headline-serif-accent">Fits</span>
          </>,
        ]}
        subtitle="Answer three quick questions about monthly volume, production quality gates, and team access."
      />

      <PricingSubNav />

      <section className="mx-3 sm:mx-5 mt-6 mb-6 border border-[#0B0B0B]/20 py-12 px-4 sm:px-6 lg:px-10">
        <PlanQuiz />
      </section>

      <Footer />
    </main>
  );
};

export default FindPlan;
