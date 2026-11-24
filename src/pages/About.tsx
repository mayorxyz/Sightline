import React from 'react';
import {PageHeader} from '../components/PageHeader';
import {SectionTag} from '../components/SectionTag';
import {Button} from '../components/Button';
import {StatChip} from '../components/StatChip';
import {Footer} from '../components/Footer';
import {MissionReveal} from '../components/company/MissionReveal';
import {StoryTimeline} from '../components/company/StoryTimeline';
import {ValueCard} from '../components/company/ValueCard';
import {TeamCard} from '../components/company/TeamCard';
import {RolesList} from '../components/company/RolesList';
import {COMPANY_STATS, COMPANY_VALUES, TEAM_MEMBERS} from '../lib/companyContent';
import {useInView} from '../hooks/useInView';

export const About: React.FC = () => {
  const {ref: statsRef, inView: statsInView} = useInView<HTMLElement>({
    threshold: 0.06,
    once: true,
  });

  return (
    <main className="pb-2 sm:pb-4 overflow-x-clip">
      <PageHeader
        tag="About"
        lines={[
          <>
            Built By People Who <span className="headline-serif-accent">Debugged</span>
          </>,
          'Agents At 2am',
        ]}
        subtitle="We are a small distributed team obsessed with making multi-step AI agents observable, fast, and dependable."
      />

      <MissionReveal />

      <StoryTimeline />

      {/* Values: 4 Cards */}
      <section className="mx-1.5 sm:mx-5 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10">
        <div className="w-full max-w-[1360px] mx-auto min-w-0">
          <SectionTag label="Values" />
          <h2 className="mt-2.5 sm:mt-4 headline-display text-[24px] leading-[1.12] sm:text-[48px] text-[#0B0B0B] mb-4 sm:mb-8">
            How we build <span className="headline-serif-accent">together</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch gap-3 sm:gap-5">
            {COMPANY_VALUES.map((val, idx) => (
              <div key={val.id} className="w-full min-w-0 h-full">
                <ValueCard value={val} index={idx} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team: 8 Cards */}
      <section className="mx-1.5 sm:mx-5 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10">
        <div className="w-full max-w-[1360px] mx-auto min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-2 sm:gap-4 mb-4 sm:mb-8 min-w-0">
            <div className="min-w-0">
              <SectionTag label="Team" />
              <h2 className="mt-2.5 sm:mt-4 headline-display text-[24px] leading-[1.12] sm:text-[48px] text-[#0B0B0B]">
                Engineers and designers <span className="headline-serif-accent">behind</span> the traces
              </h2>
            </div>
            <span className="font-mono text-[10.5px] sm:text-[12px] text-[#0B0B0B]/60 shrink-0">
              Lagos · London · Toronto
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch gap-3 sm:gap-5">
            {TEAM_MEMBERS.map((member, idx) => (
              <div key={member.id} className="w-full min-w-0 h-full">
                <TeamCard member={member} index={idx} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Numbers */}
      <section
        ref={statsRef}
        className="mx-1.5 sm:mx-5 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10"
      >
        <div className="w-full max-w-[1360px] mx-auto min-w-0 rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] text-white p-4 sm:p-10 flex flex-wrap items-center justify-between gap-4 sm:gap-6">
          <div className="min-w-0">
            <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#D9C4A8] mb-1.5 sm:mb-2">
              Sightline by the numbers
            </span>
            <h2 className="text-[20px] sm:text-[32px] font-medium tracking-[-0.02em] leading-snug">
              Small footprint, global production scale
            </h2>
          </div>

          <div className="flex flex-wrap items-stretch gap-2 sm:gap-3 min-w-0">
            {COMPANY_STATS.map((stat, idx) => (
              <StatChip
                key={stat.label}
                target={stat.target}
                decimals={stat.decimals}
                suffix={stat.suffix}
                label={stat.label}
                active={statsInView}
                delayMs={80 + idx * 90}
              />
            ))}
          </div>
        </div>
      </section>

      <RolesList />

      {/* CTA Band */}
      <section className="mx-1.5 sm:mx-5 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10">
        <div className="w-full max-w-[1360px] mx-auto min-w-0 rounded-[6px] sm:rounded-[8px] bg-[#D9C4A8]/55 border border-[#0B0B0B]/15 p-4 sm:p-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto min-w-0">
          <div className="min-w-0">
            <h2 className="headline-display text-[22px] leading-[1.12] sm:text-[42px] text-[#0B0B0B]">
              Want to see how we trace <span className="headline-serif-accent">agents</span>?
            </h2>
            <p className="mt-1.5 sm:mt-2 text-[13px] sm:text-[15px] leading-[1.45] sm:leading-[1.5] text-[#0B0B0B]/70 max-w-[520px]">
              Inspect real waterfall spans in our browser sandbox or talk directly with an engineer.
            </p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            <Button label="Try Sandbox" variant="primary" to="/demo/sandbox" />
            <Button label="Contact Us" variant="secondary" to="/contact" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;