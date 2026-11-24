import React, {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {SectionTag} from '../components/SectionTag';
import {RevealText} from '../components/RevealText';
import {WindowBar} from '../components/dashboard/WindowBar';
import {KpiCard} from '../components/dashboard/KpiCard';
import {StreamChart} from '../components/dashboard/StreamChart';
import {LogFeed} from '../components/dashboard/LogFeed';
import {AgentTable} from '../components/dashboard/AgentTable';
import {ModelDonut} from '../components/dashboard/ModelDonut';
import {KPI_SPECS} from '../lib/mockData';
import {useInView} from '../hooks/useInView';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {useLiveTicker} from '../hooks/useLiveTicker';

const DashboardSection: React.FC = () => {
  const reducedMotion = useReducedMotion();

  const {ref: sectionRef, inView: isVisible} = useInView<HTMLElement>({
    threshold: 0.02,
    rootMargin: '60px 0px 60px 0px',
    once: false,
  });

  const [hasEntered, setHasEntered] = useState(false);
  useEffect(() => {
    if (isVisible) setHasEntered(true);
  }, [isVisible]);

  const {subscribe} = useLiveTicker(isVisible && !reducedMotion);

  return (
    <section
      ref={sectionRef}
      id="live-dashboard"
      className="mx-1.5 sm:mx-5 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10"
    >
      <div className="w-full max-w-[1360px] mx-auto">
        {/* Section Tag, Headline, Subheading */}
        <div className="mb-5 sm:mb-12 text-left">
          <motion.div
            initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            animate={hasEntered || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
          >
            <SectionTag label="Live Dashboard" />
          </motion.div>

          <RevealText
            as="h2"
            visible={hasEntered}
            delayBase={0.1}
            className="mt-3 sm:mt-6 text-[26px] leading-[1.12] sm:text-[58px] lg:text-[72px] text-[#0B0B0B] max-w-[900px]"
            lines={[
              <>See Every Run</>,
              <>
                <span className="headline-serif-accent">As It Happens</span>
              </>,
            ]}
          />

          <motion.p
            initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            animate={hasEntered || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            transition={{
              duration: 0.55,
              delay: reducedMotion ? 0 : 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-2.5 sm:mt-4 text-[13px] sm:text-[16px] leading-[1.5] sm:leading-[1.6] text-[#0B0B0B]/70 max-w-[480px]"
          >
            A live view of traces, cost, and health across all your agents.
          </motion.p>
        </div>

        {/* Large Navy (#0A1F6B) Dashboard Shell */}
        <motion.div
          initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
          animate={hasEntered || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
          transition={{duration: 0.55, ease: [0.16, 1, 0.3, 1]}}
          className="w-full overflow-hidden rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] p-2 sm:p-6 shadow-[0_12px_30px_rgba(10,31,107,0.18)] sm:shadow-[0_24px_60px_rgba(10,31,107,0.22)]"
        >
          <WindowBar liveActive={isVisible && !reducedMotion} />

          {/* 2-col Mobile (2x2 KPIs + full-width cards) / 6-col Tablet / 12-col Desktop */}
          <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 items-stretch gap-2 sm:gap-4">
            {/* 1. KPI Row */}
            {KPI_SPECS.map((spec, idx) => (
              <div
                key={spec.id}
                className="col-span-1 md:col-span-3 lg:col-span-3 min-w-0 h-full"
              >
                <KpiCard
                  spec={spec}
                  inView={hasEntered}
                  delayIdx={idx}
                  subscribe={subscribe}
                />
              </div>
            ))}

            {/* 2. Streaming Chart */}
            <div className="col-span-2 md:col-span-6 lg:col-span-8 min-w-0 h-full">
              <StreamChart inView={hasEntered} delayIdx={4} subscribe={subscribe} />
            </div>

            {/* 3. Log Feed */}
            <div className="col-span-2 md:col-span-6 lg:col-span-4 min-w-0 h-full">
              <LogFeed inView={hasEntered} delayIdx={5} subscribe={subscribe} />
            </div>

            {/* 4. Agent Status Table */}
            <div className="col-span-2 md:col-span-6 lg:col-span-8 min-w-0 h-full">
              <AgentTable inView={hasEntered} delayIdx={6} subscribe={subscribe} />
            </div>

            {/* 5. Model Usage Donut */}
            <div className="col-span-2 md:col-span-6 lg:col-span-4 min-w-0 h-full">
              <ModelDonut inView={hasEntered} delayIdx={7} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardSection;