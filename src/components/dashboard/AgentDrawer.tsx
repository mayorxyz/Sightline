import React, {useEffect} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {X} from 'lucide-react';
import {AgentRowData} from '../../lib/mockData';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface AgentDrawerProps {
  agent: AgentRowData | null;
  onClose: () => void;
}

export const AgentDrawer: React.FC<AgentDrawerProps> = ({agent, onClose}) => {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!agent) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [agent, onClose]);

  return (
    <AnimatePresence>
      {agent && (
        <motion.div
          initial={reducedMotion ? {opacity: 1} : {opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          exit={reducedMotion ? {opacity: 0} : {opacity: 0, y: 10}}
          transition={{duration: reducedMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1]}}
          role="dialog"
          aria-label={`${agent.name} trace details`}
          className="mt-2.5 sm:mt-4 w-full overflow-hidden rounded-[6px] bg-[#06154D] border border-white/20 p-2.5 sm:p-4 text-white shadow-xl sm:shadow-2xl"
        >
          <div className="flex items-start sm:items-center justify-between gap-2.5 pb-2 sm:pb-3 border-b border-white/10">
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-[14px] font-medium tracking-[-0.01em] truncate">
                {agent.name}
              </div>
              <div className="mt-0.5 font-mono text-[9px] sm:text-[11px] text-white/60 tabular-nums truncate">
                latest trace · p95 {agent.p95.toFixed(2)}s · err {agent.errorRate.toFixed(1)}%
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close agent detail drawer"
              className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-[4px] bg-white/10 hover:bg-white/20 active:bg-white/25 text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2.5 sm:mt-3 flex flex-col gap-1.5 sm:gap-2">
            {agent.waterfall.map((span) => {
              const total = Math.max(100, agent.waterfall[agent.waterfall.length - 1].endMs);
              const leftPct = (span.startMs / total) * 100;
              const widthPct = Math.max(4, ((span.endMs - span.startMs) / total) * 100);
              return (
                <div
                  key={span.label}
                  className="grid grid-cols-[70px_1fr_38px] sm:grid-cols-[120px_1fr_54px] items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[11px] font-mono tabular-nums"
                >
                  <span className="text-white/80 truncate" title={span.label}>
                    {span.label}
                  </span>
                  <div className="relative h-2 sm:h-2.5 bg-white/10 rounded-[2px] overflow-hidden min-w-0">
                    <div
                      style={{
                        left: `${leftPct}%`,
                        width: `${widthPct}%`,
                        backgroundColor: span.color,
                      }}
                      className="absolute inset-y-0 rounded-[2px]"
                    />
                  </div>
                  <span className="text-right text-white/65 whitespace-nowrap">
                    {span.endMs - span.startMs}ms
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};