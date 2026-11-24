import React, {useMemo, useState} from 'react';
import {motion} from 'framer-motion';
import {BillingCycle} from './BillingToggle';
import {useInView} from '../../../hooks/useInView';
import {useReducedMotion} from '../../../hooks/useReducedMotion';

interface UsageCalculatorProps {
  cycle: BillingCycle;
}

// Log-scale slider from 10K (10^4) to 50M (5 * 10^7)
const MIN_EXP = Math.log10(10_000);
const MAX_EXP = Math.log10(50_000_000);

function formatTraces(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

export const UsageCalculator: React.FC<UsageCalculatorProps> = ({cycle}) => {
  const reducedMotion = useReducedMotion();
  const {ref, inView} = useInView<HTMLElement>({threshold: 0.06, once: true});
  const [sliderPos, setSliderPos] = useState<number>(62); // defaults around ~2.5M traces

  const calc = useMemo(() => {
    const exp = MIN_EXP + (sliderPos / 100) * (MAX_EXP - MIN_EXP);
    const traces = Math.round(Math.pow(10, exp));
    const seatBase = cycle === 'monthly' ? 49 : 39;

    if (traces <= 50_000) {
      return {
        traces,
        tier: 'Starter',
        monthlyCost: 0,
        included: 50_000,
        overage: 0,
        includedPct: (traces / 50_000) * 100,
        overagePct: 0,
      };
    }

    if (traces <= 25_000_000) {
      const included = 5_000_000;
      const overageTraces = Math.max(0, traces - included);
      const overageCost = Math.ceil(overageTraces / 1_000_000) * 2.5;
      const total = Math.round(seatBase + overageCost);
      const barMax = Math.max(included, traces);
      return {
        traces,
        tier: 'Team',
        monthlyCost: total,
        included: Math.min(traces, included),
        overage: overageTraces,
        includedPct: (Math.min(traces, included) / barMax) * 100,
        overagePct: (overageTraces / barMax) * 100,
      };
    }

    return {
      traces,
      tier: 'Enterprise',
      monthlyCost: null,
      included: traces,
      overage: 0,
      includedPct: 100,
      overagePct: 0,
    };
  }, [sliderPos, cycle]);

  return (
    <section
      ref={ref}
      className="mx-1.5 sm:mx-5 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10"
    >
      <motion.div
        initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
        animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
        transition={{duration: 0.55, ease: [0.16, 1, 0.3, 1]}}
        className="w-full max-w-[1360px] mx-auto min-w-0 rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] text-white p-3.5 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-center"
      >
        <div className="lg:col-span-7 w-full min-w-0">
          <span className="block font-mono text-[10px] sm:text-[12px] uppercase tracking-[0.08em] text-[#D9C4A8]">
            Usage Calculator
          </span>
          <h2 className="mt-1.5 sm:mt-2 headline-display text-[22px] leading-[1.15] sm:text-[40px] text-white">
            Estimate your monthly{' '}
            <span className="headline-serif-accent text-[#D9C4A8]">trace</span> volume
          </h2>

          <div className="mt-4 sm:mt-7 min-w-0">
            <div className="flex items-center justify-between gap-2 text-[11.5px] sm:text-[13px] font-mono tabular-nums mb-1.5 sm:mb-2">
              <span className="text-white/75 truncate">Monthly agent traces</span>
              <span className="text-[#D9C4A8] font-semibold shrink-0">
                {formatTraces(calc.traces)} / mo
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              aria-label="Traces per month slider"
              className="w-full accent-[#D9C4A8] cursor-pointer h-1.5 sm:h-2 rounded-lg bg-white/15"
            />

            <div className="flex justify-between text-[10px] sm:text-[11px] font-mono text-white/50 mt-1 sm:mt-1.5 tabular-nums">
              <span>10K</span>
              <span>100K</span>
              <span>1M</span>
              <span>5M</span>
              <span>50M</span>
            </div>
          </div>

          {/* Included vs Overage bar */}
          <div className="mt-4 sm:mt-6 min-w-0">
            <div className="flex items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono tabular-nums text-white/75 mb-1.5">
              <span className="truncate">Included: {formatTraces(calc.included)}</span>
              <span className="truncate text-right">Overage: {formatTraces(calc.overage)}</span>
            </div>
            <div className="h-2.5 sm:h-3 w-full rounded-[3px] bg-white/10 overflow-hidden flex">
              <div
                style={{width: `${calc.includedPct}%`}}
                className="h-full bg-[#D9C4A8] transition-all duration-200"
              />
              <div
                style={{width: `${calc.overagePct}%`}}
                className="h-full bg-[#3B66F5] transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 w-full min-w-0 bg-white/10 border border-white/15 rounded-[6px] p-3.5 sm:p-6 flex flex-col gap-2 sm:gap-3">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-[10px] sm:text-[12px] font-mono uppercase tracking-[0.08em] text-[#D9C4A8] truncate">
              Recommended Tier
            </span>
            <span className="shrink-0 px-2 sm:px-2.5 py-0.5 rounded-[2px] bg-[#0B2FA8] border border-white/20 text-[10.5px] sm:text-[12px] font-mono">
              {calc.tier}
            </span>
          </div>

          <div className="mt-1 sm:mt-2 font-mono text-[30px] sm:text-[44px] font-medium tracking-[-0.04em] leading-none tabular-nums">
            {calc.monthlyCost === null ? 'Custom' : `$${calc.monthlyCost}`}
            {calc.monthlyCost !== null && (
              <span className="text-[12px] sm:text-[14px] text-white/70 font-normal">
                {' '}
                / mo est.
              </span>
            )}
          </div>

          <p className="text-[12px] sm:text-[13px] text-white/75 leading-[1.45] sm:leading-[1.5]">
            {calc.tier === 'Starter'
              ? 'Covered 100% by Starter free tier (50K traces/mo).'
              : calc.tier === 'Team'
                ? `Includes 1 seat (${cycle}) + 5M included traces ($2.50 / 1M overage).`
                : 'Volume discounts, dedicated cluster, and custom retention apply.'}
          </p>
        </div>
      </motion.div>
    </section>
  );
};