import React, {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface SpanBar {
  id: string;
  label: string;
  start: number;
  end: number;
  tokens: string;
  cost: string;
  color: string;
}

const TOTAL_MS = 1900;

const SPANS: SpanBar[] = [
  {
    id: 'planner',
    label: 'Planner',
    start: 0,
    end: 180,
    tokens: '384 tok',
    cost: '$0.0008',
    color: '#0A1F6B',
  },
  {
    id: 'search_kb',
    label: 'search_kb',
    start: 180,
    end: 492,
    tokens: '1,120 tok',
    cost: '$0.0004',
    color: '#0B2FA8',
  },
  {
    id: 'rerank',
    label: 'rerank',
    start: 492,
    end: 610,
    tokens: '640 tok',
    cost: '$0.0003',
    color: '#2B53D6',
  },
  {
    id: 'claude-sonnet',
    label: 'claude-sonnet',
    start: 610,
    end: 1810,
    tokens: '2,410 tok',
    cost: '$0.0026',
    color: '#0B2FA8',
  },
  {
    id: 'guardrail',
    label: 'guardrail',
    start: 1810,
    end: 1850,
    tokens: '96 tok',
    cost: '$0.0001',
    color: '#0B0B0B',
  },
  {
    id: 'output',
    label: 'output',
    start: 1850,
    end: 1870,
    tokens: '418 tok',
    cost: '$0.0001',
    color: '#0B0B0B',
  },
];

const TICKS = [0, 500, 1000, 1500, 1870];

interface TraceWaterfallProps {
  active: boolean;
}

export const TraceWaterfall: React.FC<TraceWaterfallProps> = ({active}) => {
  const reducedMotion = useReducedMotion();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col justify-between bg-white/85 rounded-[6px] border border-[#0B0B0B]/12 p-3.5 sm:p-4 text-[#0B0B0B]">
      {/* Mini header */}
      <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-[#0B0B0B]/65 pb-2 border-b border-[#0B0B0B]/10">
        <span>trace_94c2 · 6 spans</span>
        <span className="text-[#0B2FA8] font-medium">1,870ms total</span>
      </div>

      {/* 6 Waterfall Bars */}
      <div className="flex flex-col gap-2 my-auto py-2">
        {SPANS.map((span, idx) => {
          const leftPct = (span.start / TOTAL_MS) * 100;
          const widthPct = Math.max(2.6, ((span.end - span.start) / TOTAL_MS) * 100);
          const duration = span.end - span.start;
          const isHovered = hoveredId === span.id;

          return (
            <div
              key={span.id}
              onMouseEnter={() => setHoveredId(span.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(span.id)}
              onBlur={() => setHoveredId(null)}
              tabIndex={0}
              className="relative grid grid-cols-[96px_1fr_52px] items-center gap-2 text-[11px] rounded-[3px] px-1 py-0.5 hover:bg-[#0B0B0B]/5 focus-visible:outline-2 focus-visible:outline-[#0B2FA8] cursor-pointer"
            >
              <span className="font-mono text-[11px] font-medium text-[#0B0B0B] truncate">
                {span.label}
              </span>

              <div className="relative h-3.5 bg-[#0B0B0B]/6 rounded-[2px] overflow-hidden">
                <motion.div
                  style={{
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    backgroundColor: span.color,
                    transformOrigin: 'left center',
                  }}
                  initial={reducedMotion ? {scaleX: 1} : {scaleX: 0}}
                  animate={active || reducedMotion ? {scaleX: 1} : {scaleX: 0}}
                  transition={{
                    duration: reducedMotion ? 0 : 0.45,
                    delay: reducedMotion ? 0 : idx * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute inset-y-0 rounded-[2px]"
                />
              </div>

              <span className="font-mono text-[10px] tabular-nums text-right text-[#0B0B0B]/70">
                {duration}ms
              </span>

              {/* Hover Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{opacity: 0, y: 4}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 2}}
                    transition={{duration: 0.15}}
                    className="pointer-events-none absolute right-14 -top-9 z-20 flex items-center gap-2.5 bg-[#0B0B0B] text-white font-mono text-[10px] tabular-nums px-2.5 py-1 rounded-[3px] shadow-lg whitespace-nowrap"
                  >
                    <span className="text-[#D9C4A8]">{span.label}</span>
                    <span>{span.tokens}</span>
                    <span>{span.cost}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Time Axis Ticks */}
      <div className="pt-2 border-t border-[#0B0B0B]/10 grid grid-cols-[96px_1fr_52px] gap-2 items-center">
        <span className="text-[10px] font-mono text-[#0B0B0B]/50">timeline</span>
        <div className="flex items-center justify-between text-[10px] font-mono tabular-nums text-[#0B0B0B]/55">
          {TICKS.map((t) => (
            <span key={t}>{t}ms</span>
          ))}
        </div>
        <span />
      </div>
    </div>
  );
};
