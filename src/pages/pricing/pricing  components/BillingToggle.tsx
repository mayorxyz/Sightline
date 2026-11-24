import React from 'react';
import {motion} from 'framer-motion';
import {useReducedMotion} from '../../../hooks/useReducedMotion';

export type BillingCycle = 'monthly' | 'yearly';

interface BillingToggleProps {
  cycle: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}

export const BillingToggle: React.FC<BillingToggleProps> = ({cycle, onChange}) => {
  const reducedMotion = useReducedMotion();

  return (
    <div className="inline-flex items-center gap-3 p-1.5 rounded-[4px] bg-white border border-[#0B0B0B]/12">
      {(['monthly', 'yearly'] as BillingCycle[]).map((opt) => {
        const active = cycle === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`relative px-4 py-2 rounded-[2px] text-[13px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
              active ? 'text-white' : 'text-[#0B0B0B]/70 hover:text-[#0B0B0B]'
            }`}
          >
            {active && (
              <motion.span
                layoutId="billing-pill"
                transition={
                  reducedMotion
                    ? {duration: 0}
                    : {type: 'spring', stiffness: 460, damping: 34}
                }
                className="absolute inset-0 rounded-[2px] bg-[#0B2FA8]"
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-2 capitalize">
              <span>{opt}</span>
              {opt === 'yearly' && (
                <span className="px-1.5 py-0.5 rounded-[2px] bg-[#D9C4A8] text-[#0B0B0B] font-mono text-[10px] font-semibold">
                  Save 20%
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
