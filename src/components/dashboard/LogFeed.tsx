import React, {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {LOG_TEMPLATES, LogTemplate} from '../../lib/mockData';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface LogEntry extends LogTemplate {
  uid: number;
  traceId: string;
  timestamp: string;
}

type FilterTab = 'All' | 'Errors' | 'Tools';

function createInitialLogs(): LogEntry[] {
  const now = Date.now();
  return LOG_TEMPLATES.slice(0, 6)
    .reverse()
    .map((tpl, i) => {
      const hexNum = (0x8f21 + (5 - i)).toString(16);
      const t = new Date(now - i * 1200).toTimeString().slice(0, 8);
      return {
        ...tpl,
        uid: 5 - i,
        traceId: `trace_${hexNum}`,
        timestamp: t,
      };
    });
}

interface LogFeedProps {
  inView: boolean;
  delayIdx: number;
  subscribe: (intervalMs: number, cb: () => void) => () => void;
}

export const LogFeed: React.FC<LogFeedProps> = React.memo(({inView, delayIdx, subscribe}) => {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const seqRef = useRef<number>(6);
  const [tilt, setTilt] = useState({rx: 0, ry: 0});
  const [logs, setLogs] = useState<LogEntry[]>(() => createInitialLogs());
  const [filter, setFilter] = useState<FilterTab>('All');

  useEffect(() => {
    return subscribe(1200, () => {
      const idx = seqRef.current;
      seqRef.current += 1;
      const tpl = LOG_TEMPLATES[idx % LOG_TEMPLATES.length];
      const traceId = `trace_${(0x8f21 + idx).toString(16)}`;
      const timestamp = new Date().toTimeString().slice(0, 8);

      setLogs((prev) => [
        {...tpl, uid: idx, traceId, timestamp},
        ...prev.slice(0, 15),
      ]);
    });
  }, [subscribe]);

  const visibleLogs = logs
    .filter((entry) => {
      if (filter === 'Errors') return entry.status === 'fail' || entry.status === 'retry';
      if (filter === 'Tools') return entry.kind === 'tool';
      return true;
    })
    .slice(0, 8);

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
      className="col-span-2 md:col-span-12 h-full w-full min-w-0 bg-white/5 border border-white/10 rounded-[6px] p-2.5 sm:p-5 text-white flex flex-col justify-between will-change-transform"
    >
      {/* Header + Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 sm:pb-3 border-b border-white/10 min-w-0">
        <span className="text-[11px] sm:text-[12px] font-medium tracking-[0.08em] uppercase text-[#D9C4A8] truncate">
          LIVE LOG FEED
        </span>

        <div className="flex items-center gap-1 shrink-0" role="tablist" aria-label="Log filters">
          {(['All', 'Errors', 'Tools'] as FilterTab[]).map((tab) => {
            const active = filter === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab)}
                className={`px-1.5 sm:px-2 py-0.5 rounded-[3px] text-[10px] sm:text-[11px] font-mono transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#0B2FA8] text-white border border-white/25'
                    : 'bg-white/5 text-white/65 border border-transparent hover:text-white'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compact Mobile / Standard Desktop Monospace Feed */}
      <div className="relative h-[240px] sm:h-[320px] pt-2 sm:pt-2.5 overflow-hidden font-mono text-[10.5px] sm:text-[12px] tabular-nums">
        <div className="flex flex-col gap-1 sm:gap-1.5">
          <AnimatePresence initial={false}>
            {visibleLogs.map((item, idx) => {
              const dotColor =
                item.status === 'fail'
                  ? 'bg-[#F87171]'
                  : item.status === 'retry'
                    ? 'bg-[#FBBF24]'
                    : 'bg-[#4ADE80]';

              const lineFade = idx >= 6 ? 'opacity-45' : idx >= 5 ? 'opacity-70' : 'opacity-100';

              return (
                <motion.div
                  key={item.uid}
                  layout={!reducedMotion}
                  initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: -8}}
                  animate={{opacity: 1, y: 0}}
                  exit={reducedMotion ? {opacity: 0} : {opacity: 0}}
                  transition={{duration: reducedMotion ? 0 : 0.24}}
                  className={`flex items-center justify-between gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-[4px] bg-white/[0.04] border border-white/[0.06] min-w-0 ${lineFade}`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                    <span className="text-white/45 shrink-0 hidden sm:inline">
                      {item.timestamp}
                    </span>
                    <span className="text-[#8EB0FF] shrink-0 max-w-[74px] sm:max-w-none truncate">
                      {item.traceId}
                    </span>
                    <span
                      className={`truncate ${
                        item.status === 'fail'
                          ? 'text-red-300'
                          : item.status === 'retry'
                            ? 'text-amber-300'
                            : 'text-white/90'
                      }`}
                    >
                      {item.event} {item.detail}
                    </span>
                  </div>
                  <span className="text-white/55 shrink-0 text-right whitespace-nowrap">
                    {item.duration}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom fade mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-9 sm:h-12 bg-gradient-to-t from-[#0A1F6B]/95 to-transparent"
        />
      </div>
    </motion.div>
  );
});

LogFeed.displayName = 'LogFeed';