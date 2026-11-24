import React, {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {DEMO_TERMINAL_STEPS} from '../../lib/mockData';
import {StatChip} from '../StatChip';
import {useInView} from '../../hooks/useInView';
import {useReducedMotion} from '../../hooks/useReducedMotion';

export const AgentRunTerminal: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const {ref, inView} = useInView<HTMLDivElement>({threshold: 0.15, once: true});
  const [visibleCount, setVisibleCount] = useState<number>(
    reducedMotion ? DEMO_TERMINAL_STEPS.length : 1
  );

  useEffect(() => {
    if (reducedMotion) {
      setVisibleCount(DEMO_TERMINAL_STEPS.length);
      return;
    }

    const timer = setInterval(() => {
      setVisibleCount((prev) => (prev >= DEMO_TERMINAL_STEPS.length ? 1 : prev + 1));
    }, 1050);

    return () => clearInterval(timer);
  }, [reducedMotion]);

  const displayed = DEMO_TERMINAL_STEPS.slice(0, visibleCount);
  const totalElapsedMs = displayed.reduce((acc, s) => acc + s.latencyMs, 0);

  return (
    <div
      ref={ref}
      className="w-full rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] text-white p-4 sm:p-6 lg:p-8 flex flex-col justify-between gap-4 sm:gap-6"
    >
      {/* Terminal Stream */}
      <div className="rounded-[6px] bg-[#06154D] border border-white/15 p-3 sm:p-5">
        <div className="flex items-center justify-between pb-2 sm:pb-3 mb-2 sm:mb-3 border-b border-white/10 font-mono text-[10px] sm:text-[11px] text-white/65">
          <span>live agent run · trace_8f21</span>
          <span className="text-[#D9C4A8] tabular-nums">
            elapsed {(totalElapsedMs / 1000).toFixed(2)}s
          </span>
        </div>

        <div className="flex flex-col gap-2 min-h-[140px] sm:min-h-[168px] font-mono text-[11px] sm:text-[12.5px] tabular-nums">
          {displayed.map((step) => (
            <motion.div
              key={step.cmd + step.detail}
              initial={reducedMotion ? {opacity: 1, x: 0} : {opacity: 0, x: -8}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.25}}
              className="flex items-center justify-between gap-2 sm:gap-3 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-[4px] bg-white/[0.04]"
            >
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <span
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${
                    step.status === 'info' ? 'bg-[#D9C4A8]' : 'bg-[#22C55E]'
                  }`}
                />
                <span className="text-[#8EB0FF]">{step.cmd}</span>
                <span className="text-white/90 truncate">{step.detail}</span>
              </div>
              <span className="text-white/50 text-[9px] sm:text-[11px] shrink-0">+{step.latencyMs}ms</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3 Stat Chips */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        <StatChip
          target={2.3}
          decimals={1}
          suffix="M"
          label="traces/day"
          active={inView}
          delayMs={100}
        />
        <StatChip
          target={1.84}
          decimals={2}
          prefix="p95 "
          suffix="s"
          label=""
          active={inView}
          delayMs={180}
        />
        <StatChip
          target={99.97}
          decimals={2}
          suffix="%"
          label="uptime"
          active={inView}
          delayMs={260}
        />
      </div>

      {/* Testimonial Card */}
      <blockquote className="rounded-[6px] bg-white/10 border border-white/15 p-4 sm:p-5">
        <p className="text-[15px] sm:text-[17px] font-medium leading-[1.45] text-white">
          &ldquo;We found a hallucination loop in 20 minutes.&rdquo;
        </p>
        <footer className="mt-2 sm:mt-3 text-[12px] sm:text-[13px] text-[#D9C4A8]">
          Amara O. · Head of AI, Lumen Labs
        </footer>
      </blockquote>
    </div>
  );
};