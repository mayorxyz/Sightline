import React from 'react';
import {motion} from 'framer-motion';
import {BeforeAfterComparison} from '../../lib/companyContent';
import {useInView} from '../../hooks/useInView';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface BeforeAfterBarsProps {
  items: BeforeAfterComparison[];
}

export const BeforeAfterBars: React.FC<BeforeAfterBarsProps> = ({items}) => {
  const reducedMotion = useReducedMotion();
  const {ref, inView} = useInView<HTMLDivElement>({threshold: 0.06, once: true});

  return (
    <div
      ref={ref}
      className="w-full min-w-0 rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] text-white p-3.5 sm:p-7 flex flex-col gap-3.5 sm:gap-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 pb-2.5 sm:pb-3 border-b border-white/15 min-w-0">
        <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#D9C4A8] shrink-0">
          Before &amp; After Impact
        </span>
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 font-mono text-[9.5px] sm:text-[10.5px] text-white/70">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-white/35 shrink-0" />
            Before
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[#D9C4A8] shrink-0" />
            With Sightline
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3.5 sm:gap-5 min-w-0">
        {items.map((item, idx) => (
          <div key={item.label} className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 min-w-0">
              <span className="text-[13px] sm:text-[14px] leading-snug font-medium text-white min-w-0">
                {item.label}
              </span>
              <span className="shrink-0 px-1.5 sm:px-2 py-0.5 rounded-[2px] bg-[#D9C4A8] text-[#0A1F6B] font-mono text-[9.5px] sm:text-[10.5px] font-semibold whitespace-nowrap">
                {item.improvementTag}
              </span>
            </div>

            <div className="grid grid-cols-[62px_minmax(0,1fr)] sm:grid-cols-[74px_minmax(0,1fr)] items-center gap-2 sm:gap-3 font-mono text-[10.5px] sm:text-[11.5px] tabular-nums min-w-0">
              <span className="text-white/55 truncate">{item.beforeLabel}</span>
              <div className="h-2 sm:h-2.5 w-full min-w-0 rounded-[2px] bg-white/10 overflow-hidden">
                <motion.div
                  initial={reducedMotion ? {width: `${item.beforePct}%`} : {width: 0}}
                  animate={inView || reducedMotion ? {width: `${item.beforePct}%`} : {width: 0}}
                  transition={{duration: reducedMotion ? 0 : 0.65, delay: idx * 0.08}}
                  className="h-full bg-white/35"
                />
              </div>
            </div>

            <div className="grid grid-cols-[62px_minmax(0,1fr)] sm:grid-cols-[74px_minmax(0,1fr)] items-center gap-2 sm:gap-3 font-mono text-[10.5px] sm:text-[11.5px] tabular-nums min-w-0">
              <span className="text-[#D9C4A8] font-medium truncate">{item.afterLabel}</span>
              <div className="h-2 sm:h-2.5 w-full min-w-0 rounded-[2px] bg-white/10 overflow-hidden">
                <motion.div
                  initial={reducedMotion ? {width: `${item.afterPct}%`} : {width: 0}}
                  animate={inView || reducedMotion ? {width: `${item.afterPct}%`} : {width: 0}}
                  transition={{duration: reducedMotion ? 0 : 0.75, delay: 0.14 + idx * 0.08}}
                  className="h-full bg-[#D9C4A8]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};