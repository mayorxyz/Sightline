import React, {useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {ChevronRight} from 'lucide-react';
import {AgentRowData, INITIAL_AGENTS} from '../../lib/mockData';
import {AgentDrawer} from './AgentDrawer';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface AgentTableProps {
  inView: boolean;
  delayIdx: number;
  subscribe: (intervalMs: number, cb: () => void) => () => void;
}

export const AgentTable: React.FC<AgentTableProps> = React.memo(({inView, delayIdx, subscribe}) => {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({rx: 0, ry: 0});
  const [rows, setRows] = useState<AgentRowData[]>(INITIAL_AGENTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Drift numbers slightly every 3s via shared ticker
  useEffect(() => {
    if (reducedMotion) return;
    return subscribe(3000, () => {
      setRows((prev) =>
        prev.map((row) => {
          const runInc = Math.floor(Math.random() * 14) + 1;
          const p95Shift = (Math.random() - 0.5) * 0.04;
          return {
            ...row,
            runs: row.runs + runInc,
            p95: Number(Math.max(0.5, row.p95 + p95Shift).toFixed(2)),
          };
        })
      );
    });
  }, [reducedMotion, subscribe]);

  const selectedAgent = rows.find((r) => r.id === selectedId) ?? null;

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
          : `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="h-full w-full min-w-0 bg-white/5 border border-white/10 rounded-[6px] p-2.5 sm:p-5 text-white flex flex-col justify-between will-change-transform"
    >
      <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
        <span className="text-[11px] sm:text-[12px] font-medium tracking-[0.08em] uppercase text-[#D9C4A8] truncate">
          AGENT STATUS
        </span>
        <span className="text-[10px] sm:text-[11px] font-mono text-white/55 whitespace-nowrap">
          Tap row for trace
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.05em] sm:tracking-[0.06em] text-white/55">
              <th className="py-1.5 sm:py-2 pr-1.5 sm:pr-3 font-normal">Agent</th>
              <th className="py-1.5 sm:py-2 px-1.5 sm:px-3 font-normal">Status</th>
              <th className="hidden sm:table-cell py-2 px-3 font-normal text-right">Runs (24h)</th>
              <th className="py-1.5 sm:py-2 px-1.5 sm:px-3 font-normal text-right">p95</th>
              <th className="hidden sm:table-cell py-2 px-3 font-normal text-right">Error rate</th>
              <th className="py-1.5 sm:py-2 pl-1.5 sm:pl-3 font-normal text-right">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06] text-[12px] sm:text-[13px]">
            {rows.map((row) => {
              const isSelected = selectedId === row.id;
              const dotClass =
                row.status === 'healthy'
                  ? `bg-[#22C55E] ${reducedMotion ? '' : 'animate-pulse'}`
                  : row.status === 'retrying'
                    ? `bg-[#F59E0B] ${reducedMotion ? '' : 'animate-[pulse_0.8s_ease-in-out_infinite]'}`
                    : `bg-[#FBBF24] ${reducedMotion ? '' : 'animate-pulse'}`;

              return (
                <tr
                  key={row.id}
                  onClick={() => setSelectedId((prev) => (prev === row.id ? null : row.id))}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId((prev) => (prev === row.id ? null : row.id));
                    }
                  }}
                  className={`cursor-pointer transition-colors hover:bg-white/[0.07] active:bg-white/[0.1] focus-visible:outline-2 focus-visible:outline-[#D9C4A8] ${
                    isSelected ? 'bg-white/[0.09]' : ''
                  }`}
                >
                  <td className="py-2 sm:py-3 pr-1.5 sm:pr-3 font-medium text-white align-middle">
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 max-w-[96px] sm:max-w-none">
                      <span className="truncate">{row.name}</span>
                      <ChevronRight
                        className={`shrink-0 w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/40 transition-transform ${
                          isSelected ? 'rotate-90 text-[#D9C4A8]' : ''
                        }`}
                      />
                    </span>
                  </td>
                  <td className="py-2 sm:py-3 px-1.5 sm:px-3 whitespace-nowrap align-middle">
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[12px] font-mono">
                      <span className={`shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${dotClass}`} />
                      <span className="text-white/85">{row.status}</span>
                    </span>
                  </td>
                  <td className="hidden sm:table-cell py-3 px-3 text-right font-mono tabular-nums text-white/90 align-middle">
                    {row.runs.toLocaleString()}
                  </td>
                  <td className="py-2 sm:py-3 px-1.5 sm:px-3 text-right font-mono tabular-nums text-white/90 whitespace-nowrap align-middle">
                    {row.p95.toFixed(2)}s
                  </td>
                  <td className="hidden sm:table-cell py-3 px-3 text-right font-mono tabular-nums text-white/90 align-middle">
                    {row.errorRate.toFixed(1)}%
                  </td>
                  <td className="py-2 sm:py-3 pl-1.5 sm:pl-3 text-right font-mono tabular-nums text-[#D9C4A8] whitespace-nowrap align-middle">
                    ${row.cost}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AgentDrawer agent={selectedAgent} onClose={() => setSelectedId(null)} />
    </motion.div>
  );
});

AgentTable.displayName = 'AgentTable';