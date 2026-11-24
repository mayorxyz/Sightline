import React from 'react';
import {motion} from 'framer-motion';
import {Clock, Globe, KeyRound, ScrollText, Server, ShieldCheck} from 'lucide-react';
import {PageHeader} from '../../components/PageHeader';
import {PricingSubNav} from './pricing  components/PricingSubNav';
import {EnterpriseForm} from './pricing  components/EnterpriseForm';
import {Footer} from '../../components/Footer';
import {
  ENTERPRISE_CAPABILITIES,
  ENTERPRISE_NEXT_STEPS,
} from '../../lib/pricingContent';
import {useReducedMotion} from '../../hooks/useReducedMotion';

const CAP_ICONS = [KeyRound, ScrollText, Server, Globe, ShieldCheck, Clock];

export const Enterprise: React.FC = () => {
  const reducedMotion = useReducedMotion();

  return (
    <main className="pb-4">
      <PageHeader
        tag="Enterprise"
        lines={[
          <>Built For Production At</>,
          <>
            <span className="headline-serif-accent">Scale</span>
          </>,
        ]}
        subtitle="Private VPC hosting, SAML SSO, regional data residency, and contractual SLAs for regulated AI teams."
      />

      <PricingSubNav />

      {/* 6 Capability Cards */}
      <section className="mx-3 sm:mx-5 mt-6 mb-6 border border-[#0B0B0B]/20 py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ENTERPRISE_CAPABILITIES.map((cap, idx) => {
            const Icon = CAP_ICONS[idx % CAP_ICONS.length];
            return (
              <motion.div
                key={cap.id}
                initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.2}}
                transition={{
                  duration: reducedMotion ? 0 : 0.45,
                  delay: reducedMotion ? 0 : idx * 0.06,
                }}
                className="rounded-[8px] bg-white border border-[#0B0B0B]/12 p-6 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-[3px] bg-[#0B2FA8] text-white">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] px-2 py-0.5 rounded-[2px] bg-[#D9C4A8]/55 text-[#0A1F6B]">
                    {cap.badge}
                  </span>
                </div>
                <h2 className="text-[20px] font-medium tracking-[-0.02em] text-[#0B0B0B]">
                  {cap.title}
                </h2>
                <p className="text-[14px] leading-[1.6] text-[#0B0B0B]/70">{cap.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Enterprise Contact Form + What Happens Next Side Panel */}
      <section className="mx-3 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <EnterpriseForm />
          </div>

          <div className="lg:col-span-5 rounded-[8px] bg-[#0A1F6B] text-white p-6 sm:p-8 flex flex-col gap-6">
            <div className="pb-4 border-b border-white/15">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#D9C4A8] text-[#0A1F6B] font-mono text-[11px] font-semibold">
                Response within 1 business day
              </span>
              <h2 className="mt-4 text-[26px] font-medium tracking-[-0.02em]">
                What happens next
              </h2>
            </div>

            <div className="flex flex-col gap-5">
              {ENTERPRISE_NEXT_STEPS.map((st) => (
                <div key={st.step} className="flex items-start gap-3.5">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-[3px] bg-[#0B2FA8] border border-white/20 font-mono text-[12px] text-[#D9C4A8] shrink-0">
                    {st.step}
                  </span>
                  <div>
                    <h3 className="text-[16px] font-medium text-white">{st.title}</h3>
                    <p className="mt-1 text-[13.5px] leading-[1.55] text-white/70">{st.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Enterprise;
