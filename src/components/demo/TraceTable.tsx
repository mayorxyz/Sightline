import React from 'react';
import {SandboxTraceRun} from '../../lib/demoContent';

interface TraceTableProps {
  runs: SandboxTraceRun[];
  selectedId: string | null;
  onSelectRun: (run: SandboxTraceRun) => void;
}

export const TraceTable: React.FC<TraceTableProps> = ({runs, selectedId, onSelectRun}) => {
  return (
    <div className="rounded-[6px] bg-white/5 border border-white/15 overflow-hidden">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/15">
        <span className="font-mono text-[10px] sm:text-[12px] uppercase tracking-[0.08em] text-[#D9C4A8]">
          Recent Agent Traces ({runs.length})
        </span>
        <span className="hidden sm:inline font-mono text-[10px] sm:text-[11px] text-white/55">Click any row to inspect</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-white/10 font-mono text-[9px] sm:text-[10.5px] uppercase tracking-[0.06em] text-white/50">
              <th className="py-2 sm:py-2.5 px-3 sm:px-4">Trace ID</th>
              <th className="py-2 sm:py-2.5 px-2 sm:px-3">Agent</th>
              <th className="py-2 sm:py-2.5 px-2 sm:px-3">Status</th>
              <th className="py-2 sm:py-2.5 px-2 sm:px-3 text-right">Duration</th>
              <th className="py-2 sm:py-2.5 px-3 sm:px-4 text-right">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 font-mono text-[11px] sm:text-[12px] tabular-nums">
            {runs.map((run) => {
              const active = selectedId === run.id;
              const statusStyle =
                run.status === 'ok'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25'
                  : run.status === 'degraded'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-400/25'
                    : 'bg-red-500/15 text-red-300 border-red-400/25';

              return (
                <tr
                  key={run.id}
                  tabIndex={0}
                  onClick={() => onSelectRun(run)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectRun(run);
                    }
                  }}
                  aria-selected={active}
                  className={`transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D9C4A8] ${
                    active ? 'bg-[#0B2FA8]/70' : 'hover:bg-white/[0.06]'
                  }`}
                >
                  <td className="py-2 sm:py-2.5 px-3 sm:px-4 text-[#8EB0FF] font-medium truncate max-w-[100px]">{run.id}</td>
                  <td className="py-2 sm:py-2.5 px-2 sm:px-3 font-sans text-xs sm:text-[13px] text-white font-medium truncate max-w-[120px]">
                    {run.agent}
                  </td>
                  <td className="py-2 sm:py-2.5 px-2 sm:px-3">
                    <span
                      className={`inline-block px-1.5 sm:px-2 py-0.5 rounded-[2px] border text-[9px] sm:text-[10.5px] whitespace-nowrap ${statusStyle}`}
                    >
                      {run.status}
                    </span>
                  </td>
                  <td className="py-2 sm:py-2.5 px-2 sm:px-3 text-right text-white/80 whitespace-nowrap">
                    {(run.durationMs / 1000).toFixed(2)}s
                  </td>
                  <td className="py-2 sm:py-2.5 px-3 sm:px-4 text-right text-[#D9C4A8] whitespace-nowrap">
                    ${run.cost.toFixed(4)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};