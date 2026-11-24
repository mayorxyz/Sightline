import React from 'react';
import {motion} from 'framer-motion';
import {INTEGRATIONS} from '../../lib/mockData';
import {useInView} from '../../hooks/useInView';
import {useReducedMotion} from '../../hooks/useReducedMotion';

export const IntegrationGrid: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const {ref, inView} = useInView<HTMLElement>({threshold: 0.15, once: true});

  return (
    <section
      ref={ref}
      className="mx-3 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10"
    >
      <div className="max-w-[1360px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-2 mb-5 sm:mb-8">
          <div>
            <h2 className="headline-display text-[30px] sm:text-[46px] leading-[1.02] text-[#0B0B0B]">
              Works with your <span className="headline-serif-accent">existing</span> stack
            </h2>
            <p className="mt-2 sm:mt-3 text-[14px] sm:text-[16px] leading-[1.55] text-[#0B0B0B]/70 max-w-[520px]">
              Drop-in adapters for major model providers, agent frameworks, incident pipelines, and
              cloud data warehouses.
            </p>
          </div>
          <span className="font-mono text-[11px] sm:text-[12px] text-[#0B0B0B]/60">12 native connectors</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {INTEGRATIONS.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
              animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
              transition={{
                duration: reducedMotion ? 0 : 0.48,
                delay: reducedMotion ? 0 : idx * 0.045,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={reducedMotion ? undefined : {y: -4}}
              className="group min-w-0 bg-white rounded-[6px] border border-[#0B0B0B]/12 p-3 sm:p-5 flex flex-col justify-between gap-3 sm:gap-4 transition-shadow duration-200 hover:shadow-[0_12px_28px_rgba(10,31,107,0.08)]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-[4px] bg-[#0B2FA8]/10 text-[#0B2FA8] font-mono text-[12px] font-semibold">
                  {item.abbr}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] text-[#15803D] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  <span>Connected</span>
                </span>
              </div>

              <div>
                <div className="text-[16px] font-medium text-[#0B0B0B] tracking-[-0.02em]">
                  {item.name}
                </div>
                <div className="text-[12px] text-[#0B0B0B]/55 mt-0.5">{item.category}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
