import React, {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Check} from 'lucide-react';
import {AUDIENCE_TABS, AudienceTab} from '../../lib/productContent';
import {useInView} from '../../hooks/useInView';
import {useReducedMotion} from '../../hooks/useReducedMotion';

export const AudienceTabs: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const {ref, inView} = useInView<HTMLElement>({threshold: 0.06, once: true});
  const [activeId, setActiveId] = useState<AudienceTab['id']>('ml');

  const active = AUDIENCE_TABS.find((t) => t.id === activeId) ?? AUDIENCE_TABS[0];

  return (
    <section
      ref={ref}
      className="mx-1.5 sm:mx-5 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10"
    >
      <motion.div
        initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
        animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
        transition={{duration: 0.55, ease: [0.16, 1, 0.3, 1]}}
        className="w-full max-w-[1360px] mx-auto min-w-0"
      >
        <div className="flex flex-wrap items-end justify-between gap-3 sm:gap-6 mb-4 sm:mb-8 min-w-0">
          <h2 className="headline-display text-[24px] leading-[1.12] sm:text-[44px] text-[#0B0B0B]">
            Who it&apos;s <span className="headline-serif-accent">for</span>
          </h2>

          <div
            role="tablist"
            aria-label="Audience roles"
            className="max-w-full overflow-x-auto inline-flex flex-nowrap sm:flex-wrap items-center gap-1 p-1 sm:p-1.5 rounded-[4px] bg-white border border-[#0B0B0B]/12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {AUDIENCE_TABS.map((tab) => {
              const isSelected = tab.id === activeId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveId(tab.id)}
                  className={`relative px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-[2px] text-[12px] sm:text-[13.5px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected ? 'text-white' : 'text-[#0B0B0B]/70 hover:text-[#0B0B0B]'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="audience-tab-pill"
                      transition={
                        reducedMotion
                          ? {duration: 0}
                          : {type: 'spring', stiffness: 440, damping: 34}
                      }
                      className="absolute inset-0 bg-[#0B2FA8] rounded-[2px]"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={reducedMotion ? {opacity: 1} : {opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={reducedMotion ? {opacity: 1} : {opacity: 0, y: -8}}
            transition={{duration: reducedMotion ? 0 : 0.22}}
            className="w-full min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-center bg-white rounded-[6px] sm:rounded-[8px] border border-[#0B0B0B]/12 p-3.5 sm:p-10"
          >
            <div className="lg:col-span-6 w-full min-w-0">
              <h3 className="text-[19px] sm:text-[32px] font-medium tracking-[-0.03em] leading-[1.15] sm:leading-[1.1] text-[#0B0B0B]">
                {active.headline}
              </h3>
              <ul className="mt-3.5 sm:mt-6 flex flex-col gap-2 sm:gap-3">
                {active.outcomes.map((out) => (
                  <li
                    key={out}
                    className="flex items-start gap-2 sm:gap-2.5 text-[13px] sm:text-[15px] leading-snug text-[#0B0B0B]/85 min-w-0"
                  >
                    <span className="mt-0.5 inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-[2px] bg-[#0B2FA8] text-white shrink-0">
                      <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" strokeWidth={2.4} />
                    </span>
                    <span className="min-w-0">{out}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6 w-full min-w-0 rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] text-white p-3.5 sm:p-6 flex flex-col justify-between gap-3 sm:gap-5">
              <div className="flex items-center justify-between gap-2 pb-2.5 sm:pb-3 border-b border-white/15 min-w-0">
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#D9C4A8] truncate">
                  {active.metricLabel}
                </span>
                <span className="font-mono text-[18px] sm:text-[24px] font-medium leading-none tabular-nums text-white shrink-0">
                  {active.metricValue}
                </span>
              </div>

              <div className="flex flex-col gap-2 sm:gap-2.5 min-w-0">
                {active.widgetLines.map((line) => (
                  <div
                    key={line.label}
                    className="flex items-center justify-between gap-2.5 sm:gap-3 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-[4px] bg-white/8 border border-white/10 font-mono text-[11px] sm:text-[12px] tabular-nums min-w-0"
                  >
                    <span className="text-white/85 truncate min-w-0">{line.label}</span>
                    <span className={`${line.tone} shrink-0`}>{line.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
};