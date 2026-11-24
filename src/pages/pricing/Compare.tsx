import React from 'react';
import {PageHeader} from '../../components/PageHeader';
import {PricingSubNav} from './pricing  components/PricingSubNav';
import {CompareMatrix} from './pricing  components/CompareMatrix';
import {Footer} from '../../components/Footer';

export const Compare: React.FC = () => {
  return (
    <main className="pb-4">
      <PageHeader
        tag="Compare"
        lines={[
          <>Sightline vs The</>,
          <>
            <span className="headline-serif-accent">Alternatives</span>
          </>,
        ]}
        subtitle="Why AI engineering teams replace generic APMs, raw log stacks, and homegrown scripts."
      />

      <PricingSubNav />
      <CompareMatrix />
      <Footer />
    </main>
  );
};

export default Compare;

