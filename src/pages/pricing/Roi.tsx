import React, {useState} from 'react';
import {PageHeader} from '../../components/PageHeader';
import {PricingSubNav} from './pricing  components/PricingSubNav';
import {RoiCalculator} from './pricing  components/RoiCalculator';
import {RoiResults} from './pricing  components/RoiResults';
import {Footer} from '../../components/Footer';
import {ROI_DEFAULTS, RoiInputs} from '../../lib/pricingContent';

export const Roi: React.FC = () => {
  const [inputs, setInputs] = useState<RoiInputs>(ROI_DEFAULTS);

  return (
    <main className="pb-4">
      <PageHeader
        tag="ROI Calculator"
        lines={[
          <>
            Calculate What <span className="headline-serif-accent">Blind</span>
          </>,
          <>Agents Cost You</>,
        ]}
        subtitle="Estimate monthly engineering hours, token waste, and incident costs recovered with full observability."
      />

      <PricingSubNav />

      <section className="mx-3 sm:mx-5 mt-6 mb-6 border border-[#0B0B0B]/20 py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <RoiCalculator inputs={inputs} onChange={setInputs} />
          </div>
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <RoiResults inputs={inputs} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Roi;
