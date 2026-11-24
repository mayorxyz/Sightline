import React, {useRef, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {MODEL_USAGE} from '../../lib/mockData';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface ModelDonutProps {
  inView: boolean;
  delayIdx: number;
}

export const ModelDonut: React.FC<ModelDonutProps> = React.memo(({inView, delayIdx}) => {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({rx: 0, ry: 0});
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const radius = 58;
  const circumference = 2 * Math.PI * radius;

  // Compute dash arrays and cumulative offsets
  let cumulativePct = 0;
  const segments = MODEL_USAGE.map((seg) => {
    const segLength = (seg.pct / 100) * circumference;
    const offset = -(cumulativePct / 100) * circumference;
    cumulativePct += seg.pct;
    return {
      ...seg,
      segLength,
      offset,
    };
  });

  const hoveredSeg = segments.find((s) => s.id === hoveredId) ?? null;

  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || window.innerWidth < 768 || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-ny * 4).toFixed(2)),
      ry: Number((nx * 4).toFixed(2)),
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleCardMove}
      onMouseLeave={() => setTilt({rx: 0, ry: 0})}
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
      className="h-full w-full min-w-0 bg-white/5 border border-white/10 rounded-[6px] p-2.5 sm:p-5 text-white flex flex-col justify-between will-change-transform"
    >
      <span className="text-[11px] sm:text-[12px] font-medium tracking-[0.08em] uppercase text-[#D9C4A8] truncate">
        MODEL USAGE
      </span>

      <div className="relative flex items-center justify-center my-2 sm:my-4">
        <svg
          viewBox="0 0 164 164"
          className="w-[128px] h-[128px] sm:w-[164px] sm:h-[164px] -rotate-90 overflow-visible"
        >
          <circle
            cx="82"
            cy="82"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="16"
          />

          {segments.map((seg, idx) => {
            const isHovered = hoveredId === seg.id;
            return (
              <motion.circle
                key={seg.id}
                cx="82"
                cy="82"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={isHovered ? 24 : 16}
                strokeDashoffset={seg.offset}
                initial={
                  reducedMotion
                    ? {strokeDasharray: `${seg.segLength} ${circumference}`}
                    : {strokeDasharray: `0 ${circumference}`}
                }
                animate={
                  inView || reducedMotion
                    ? {
                        strokeDasharray: `${seg.segLength} ${circumference}`,
                        strokeWidth: isHovered ? 24 : 16,
                      }
                    : {strokeDasharray: `0 ${circumference}`}
                }
                transition={{
                  strokeDasharray: {
                    duration: reducedMotion ? 0 : 0.75,
                    delay: reducedMotion ? 0 : 0.15 + idx * 0.18,
                    ease: [0.16, 1, 0.3, 1],
                  },
                  strokeWidth: {duration: 0.18},
                }}
                onMouseEnter={() => setHoveredId(seg.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setHoveredId((prev) => (prev === seg.id ? null : seg.id))}
                className="cursor-pointer"
              />
            );
          })}
        </svg>

        {/* Center Total */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-[19px] sm:text-[24px] font-medium tabular-nums leading-none">
            2.3M
          </span>
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.06em] text-white/55 mt-0.5 sm:mt-1">
            total runs
          </span>
        </div>

        {/* Hover / Tap Segment Tooltip */}
        <AnimatePresence>
          {hoveredSeg && (
            <motion.div
              initial={{opacity: 0, y: 4}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: 2}}
              transition={{duration: 0.14}}
              className="pointer-events-none absolute -top-1.5 sm:-top-2 z-20 max-w-full bg-[#0B0B0B] border border-white/20 rounded-[4px] px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-mono tabular-nums shadow-lg truncate"
            >
              <span className="text-[#D9C4A8]">{hoveredSeg.name}</span> · {hoveredSeg.pct}% (
              {hoveredSeg.runs})
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-1 sm:gap-1.5 pt-1.5 sm:pt-2 border-t border-white/10">
        {segments.map((seg) => (
          <div
            key={seg.id}
            onMouseEnter={() => setHoveredId(seg.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setHoveredId((prev) => (prev === seg.id ? null : seg.id))}
            className="flex items-center justify-between gap-2 text-[10.5px] sm:text-[12px] font-mono tabular-nums cursor-pointer hover:text-[#D9C4A8] transition-colors min-w-0"
          >
            <span className="inline-flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-[2px] shrink-0"
                style={{backgroundColor: seg.color}}
              />
              <span className="truncate">{seg.name}</span>
            </span>
            <span className="text-white/80 shrink-0 tabular-nums">{seg.pct}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
});

ModelDonut.displayName = 'ModelDonut';