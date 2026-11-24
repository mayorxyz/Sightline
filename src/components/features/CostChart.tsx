import React, {useEffect, useMemo, useState} from 'react';
import {motion} from 'framer-motion';
import {useReducedMotion} from '../../hooks/useReducedMotion';

const INITIAL_COST = [
  42, 40, 44, 43, 41, 45, 42, 39, 41, 43, 46, 44, 40, 38, 41, 43, 42, 44, 41, 40, 42, 43, 41, 42,
];
const INITIAL_LATENCY = [
  1.72, 1.81, 1.78, 1.9, 1.84, 1.76, 1.88, 1.94, 1.82, 1.79, 1.86, 1.91, 1.85, 1.77, 1.83, 1.89,
  1.81, 1.78, 1.86, 1.92, 1.84, 1.8, 1.83, 1.84,
];

const MODELS = [
  {name: 'claude-sonnet', pct: 44, color: '#D9C4A8', text: '#0B0B0B'},
  {name: 'gpt-4.1', pct: 38, color: '#FFFFFF', text: '#0B0B0B'},
  {name: 'gemini-2.5', pct: 18, color: '#0A1F6B', text: '#FFFFFF'},
];

interface CostChartProps {
  active: boolean;
}

export const CostChart: React.FC<CostChartProps> = ({active}) => {
  const reducedMotion = useReducedMotion();
  const [costSeries, setCostSeries] = useState<number[]>(INITIAL_COST);
  const [latencySeries, setLatencySeries] = useState<number[]>(INITIAL_LATENCY);
  const [drawn, setDrawn] = useState(reducedMotion);

  // Mark initial draw done after stroke animation
  useEffect(() => {
    if (reducedMotion) {
      setDrawn(true);
      return;
    }
    if (!active) return;
    const t = setTimeout(() => setDrawn(true), 900);
    return () => clearTimeout(t);
  }, [active, reducedMotion]);

  // Stream a new data point every 1.5s (shift left)
  useEffect(() => {
    if (reducedMotion || !drawn) return;

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setCostSeries((prev) => {
        const nextVal = Number((41.5 + Math.sin(step * 0.7) * 3.4 + (step % 3) * 0.6).toFixed(1));
        return [...prev.slice(1), nextVal];
      });
      setLatencySeries((prev) => {
        const nextVal = Number((1.84 + Math.cos(step * 0.55) * 0.11).toFixed(2));
        return [...prev.slice(1), nextVal];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [drawn, reducedMotion]);

  const {costPath, latencyPath} = useMemo(() => {
    const w = 420;
    const h = 112;
    const padX = 6;
    const padY = 10;

    const toPath = (values: number[], min: number, max: number) => {
      return values
        .map((v, i) => {
          const x = padX + (i / (values.length - 1)) * (w - padX * 2);
          const norm = (v - min) / Math.max(0.0001, max - min);
          const y = h - padY - norm * (h - padY * 2);
          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(' ');
    };

    return {
      costPath: toPath(costSeries, 34, 50),
      latencyPath: toPath(latencySeries, 1.65, 2.05),
    };
  }, [costSeries, latencySeries]);

  const latestCost = (costSeries[costSeries.length - 1] / 10000).toFixed(4);
  const latestLatency = latencySeries[latencySeries.length - 1].toFixed(2);

  return (
    <div className="h-full flex flex-col justify-between bg-[#082485] rounded-[6px] border border-white/18 p-3.5 text-white">
      {/* Legend Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/15">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-white/10 border border-white/20 font-mono text-[10.5px] tabular-nums">
            <span className="w-2 h-2 rounded-full bg-[#D9C4A8]" />
            <span>${latestCost} / run</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-white/10 border border-white/20 font-mono text-[10.5px] tabular-nums">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>{latestLatency}s p95</span>
          </span>
        </div>
        <span className="text-[10px] font-mono text-white/60">24 intervals</span>
      </div>

      {/* Dual-line SVG Chart */}
      <div className="my-auto py-1">
        <svg viewBox="0 0 420 112" className="w-full h-[108px] overflow-visible" aria-hidden="true">
          {/* Subtle Horizontal Grid */}
          {[22, 56, 90].map((y) => (
            <line
              key={y}
              x1="6"
              y1={y}
              x2="414"
              y2={y}
              stroke="rgba(255,255,255,0.12)"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
          ))}

          {/* Cost per run (Sand) */}
          <motion.path
            d={costPath}
            fill="none"
            stroke="#D9C4A8"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reducedMotion ? {pathLength: 1} : {pathLength: 0}}
            animate={active || reducedMotion ? {pathLength: 1} : {pathLength: 0}}
            transition={{duration: reducedMotion ? 0 : 0.85, ease: [0.16, 1, 0.3, 1]}}
          />

          {/* p95 Latency (White) */}
          <motion.path
            d={latencyPath}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reducedMotion ? {pathLength: 1} : {pathLength: 0}}
            animate={active || reducedMotion ? {pathLength: 1} : {pathLength: 0}}
            transition={{
              duration: reducedMotion ? 0 : 0.85,
              delay: reducedMotion ? 0 : 0.14,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </svg>
      </div>

      {/* Model Split Bar */}
      <div className="pt-2 border-t border-white/15">
        <div className="flex items-center justify-between text-[10.5px] font-mono tabular-nums text-white/75 mb-1.5">
          {MODELS.map((m) => (
            <span key={m.name}>
              {m.name} {m.pct}%
            </span>
          ))}
        </div>
        <div className="h-2.5 w-full rounded-[3px] overflow-hidden flex bg-white/10">
          {MODELS.map((m, idx) => (
            <motion.div
              key={m.name}
              style={{backgroundColor: m.color}}
              initial={reducedMotion ? {width: `${m.pct}%`} : {width: '0%'}}
              animate={active || reducedMotion ? {width: `${m.pct}%`} : {width: '0%'}}
              transition={{
                duration: reducedMotion ? 0 : 0.65,
                delay: reducedMotion ? 0 : 0.25 + idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
