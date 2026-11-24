import React, {useEffect, useState} from 'react';
import {useReducedMotion} from '../hooks/useReducedMotion';

interface StatChipProps {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix: string;
  label: string;
  active: boolean;
  delayMs?: number;
}

export const StatChip: React.FC<StatChipProps> = ({
  target,
  decimals = 0,
  prefix = '',
  suffix,
  label,
  active,
  delayMs = 0,
}) => {
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState<number>(reducedMotion ? target : 0);

  useEffect(() => {
    if (reducedMotion) {
      setValue(target);
      return;
    }
    if (!active) return;

    let rafId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    timeoutId = setTimeout(() => {
      const duration = 1150;
      const start = performance.now();

      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(target * eased);
        if (t < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          setValue(target);
        }
      };

      rafId = requestAnimationFrame(step);
    }, delayMs);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [active, delayMs, reducedMotion, target]);

  const formatted = value.toFixed(decimals);

  return (
    <div className="inline-flex items-baseline gap-1.5 px-3 py-1.5 rounded-[4px] bg-white/10 border border-white/20 text-white text-[13px] whitespace-nowrap">
      <span className="font-mono font-medium tabular-nums text-[#D9C4A8]">
        {prefix}
        {formatted}
        {suffix}
      </span>
      <span className="text-white/85 font-normal">{label}</span>
    </div>
  );
};
