import React, {useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight} from 'lucide-react';
import {PageHeader} from '../components/PageHeader';
import {PricingSubNav} from './pricing/pricing  components/PricingSubNav';
import {BillingCycle, BillingToggle} from './pricing/pricing  components/BillingToggle';
import {PricingCard} from './pricing/pricing  components/PricingCard';
import {UsageCalculator} from './pricing/pricing  components/UsageCalculator';
import {CompareTable} from './pricing/pricing  components/CompareTable';
import {Faq} from './pricing/pricing  components/Faq';
import {Footer} from '../components/Footer';
import {PRICING_TIERS} from '../lib/mockData';
import {EXTENDED_PRICING_FAQS, FaqCategory} from '../lib/pricingContent';
import {useInView} from '../hooks/useInView';

const FAQ_CATEGORIES: FaqCategory[] = [
  'All',
  'Plans & Billing',
  'Usage & Overages',
  'Trials & Refunds',
];

export const Pricing: React.FC = () => {
  const [cycle, setCycle] = useState<BillingCycle>('yearly');
  const [faqCategory, setFaqCategory] = useState<FaqCategory>('All');
  const {ref: tiersRef, inView: tiersInView} = useInView<HTMLElement>({
    threshold: 0.06,
    once: true,
  });

  const filteredFaqs = useMemo(() => {
    if (faqCategory === 'All') return EXTENDED_PRICING_FAQS;
    return EXTENDED_PRICING_FAQS.filter((item) => item.category === faqCategory);
  }, [faqCategory]);

  return (
    <main className="pb-2 sm:pb-4 overflow-x-clip">
      <PageHeader
        tag="Pricing"
        lines={[
          <>
            Simple Pricing That <span className="headline-serif-accent">Scales</span>
          </>,
          <>With Runs</>,
        ]}
        subtitle="Start free. Upgrade when your agents go to production."
      />

      <PricingSubNav />

      {/* Billing Toggle + 3 Tier Cards */}
      <section
        ref={tiersRef}
        className="mx-1.5 sm:mx-5 mt-3 sm:mt-6 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10"
      >
        <div className="w-full max-w-[1360px] mx-auto min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 mb-5 sm:mb-10">
            <BillingToggle cycle={cycle} onChange={setCycle} />

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:gap-4 text-[12px] sm:text-[13px]">
              <Link
                to="/pricing/find-plan"
                className="inline-flex items-center gap-1 font-medium text-[#0B2FA8] hover:underline whitespace-nowrap"
              >
                <span>Not sure? Take 3-question quiz</span>
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              </Link>
              <Link
                to="/pricing/roi"
                className="inline-flex items-center gap-1 font-mono text-[11px] sm:text-[12px] text-[#0B0B0B]/65 hover:text-[#0B2FA8] whitespace-nowrap"
              >
                <span>ROI Calculator</span>
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 items-stretch">
            {PRICING_TIERS.map((tier, idx) => (
              <div key={tier.id} className="w-full min-w-0 h-full">
                <PricingCard
                  tier={tier}
                  cycle={cycle}
                  inView={tiersInView}
                  delayIdx={idx}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <UsageCalculator cycle={cycle} />
      <CompareTable />

      <Faq
        items={filteredFaqs}
        title={
          <h2 className="headline-display text-[24px] leading-[1.12] sm:text-[44px] text-[#0B0B0B]">
            Billing &amp; plan <span className="headline-serif-accent">questions</span>
          </h2>
        }
        headerExtra={
          <div
            className="flex flex-wrap items-center gap-1.5 sm:gap-2"
            role="group"
            aria-label="Filter FAQ by category"
          >
            {FAQ_CATEGORIES.map((cat) => {
              const active = faqCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFaqCategory(cat)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-[3px] font-mono text-[10px] sm:text-[11px] border transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#0B2FA8] text-white border-[#0B2FA8]'
                      : 'bg-white text-[#0B0B0B]/75 border-[#0B0B0B]/15 hover:border-[#0B2FA8]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        }
      />

      <Footer />
    </main>
  );
};

export default Pricing;