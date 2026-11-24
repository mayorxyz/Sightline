import React, {useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {KpiSpec} from '../../lib/mockData';
import {Sparkline} from './Sparkline';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface KpiCardProps {
  spec: KpiSpec;
  inView: boolean;
  delayIdx: number;
  subscribe: (intervalMs: number, cb: () => void) => () => void;
}

export const KpiCard: React.FC<KpiCardProps> = React.memo(
  ({spec, inView, delayIdx, subscribe}) => {
    const reducedMotion = useReducedMotion();
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [tilt, setTilt] = useState({rx: 0, ry: 0});
    const [displayNum, setDisplayNum] = useState<number>(reducedMotion ? spec.target : 0);
    const [spark, setSpark] = useState<number[]>(spec.initialSpark);

    // Count up from 0 on enter (1.2s ease-out)
    useEffect(() => {
      if (reducedMotion) {
        setDisplayNum(spec.target);
        return;
      }
      if (!inView) return;

      let rafId = 0;
      const start = performance.now();
      const duration = 1200;

      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplayNum(spec.target * eased);
        if (t < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          setDisplayNum(spec.target);
        }
      };

      rafId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(rafId);
    }, [inView, reducedMotion, spec.target]);

    // Append random-walk sparkline point every 2s via shared ticker
    useEffect(() => {
      return subscribe(2000, () => {
        setSpark((prev) => {
          const last = prev[prev.length - 1];
          const delta = (Math.random() - 0.48) * spec.walkStep * 2;
          const next = Math.min(spec.max, Math.max(spec.min, last + delta));
          return [...prev.slice(1), Number(next.toFixed(spec.decimals + 1))];
        });
      });
    }, [reducedMotion, subscribe, spec]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || window.innerWidth < 768 || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({
        rx: Number((-ny * 4).toFixed(2)), // max 2deg
        ry: Number((nx * 4).toFixed(2)),
      });
    };

    const handleMouseLeave = () => setTilt({rx: 0, ry: 0});

    return (
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
        animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
        transition={{
          duration: reducedMotion ? 0 : 0.6,
          delay: reducedMotion ? 0 : delayIdx * 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          transform: reducedMotion
            ? undefined
            : `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="col-span-1 md:col-span-3 h-full w-full min-w-0 bg-white/5 border border-white/10 rounded-[6px] p-2.5 sm:p-5 text-white flex flex-col justify-between gap-2 sm:gap-3 will-change-transform"
      >
        <div className="flex items-center justify-between gap-1.5 min-w-0">
          <span
            title={spec.label}
            className="text-[10px] sm:text-[12px] font-medium tracking-[0.06em] sm:tracking-[0.08em] uppercase text-[#D9C4A8] truncate"
          >
            {spec.label}
          </span>
          <span
            className={`shrink-0 px-1 sm:px-1.5 py-0.5 rounded-[3px] font-mono text-[9.5px] sm:text-[10.5px] font-medium tabular-nums whitespace-nowrap ${
              spec.deltaPositive
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/25'
                : 'bg-red-500/15 text-red-300 border border-red-400/25'
            }`}
          >
            {spec.delta}
          </span>
        </div>

        <div className="text-[20px] sm:text-[32px] font-medium tracking-[-0.03em] leading-none font-mono tabular-nums break-all sm:truncate">
          {spec.prefix ?? ''}
          {displayNum.toFixed(spec.decimals)}
          {spec.suffix ?? ''}
        </div>

        <div className="w-full min-w-0 overflow-hidden">
          <Sparkline data={spark} id={spec.id} />
        </div>
      </motion.div>
    );
  }
);

KpiCard.displayName = 'KpiCard';