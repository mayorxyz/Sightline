import React, {useRef, useState} from 'react';
import {MoveHorizontal} from 'lucide-react';
import {useInView} from '../../hooks/useInView';

const RAW_LOGS = [
  '2026-11-23T09:14:02.114Z INFO worker-4 handling req_88a12 user=4812',
  '2026-11-23T09:14:02.248Z DEBUG http POST /v1/kb/query status=200 ms=312',
  '2026-11-23T09:14:02.249Z WARN rate_limit_near remaining=12 tool=search_kb',
  '2026-11-23T09:14:03.351Z INFO llm_invoke model=claude-sonnet tok_in=1840 tok_out=570',
  '2026-11-23T09:14:03.360Z DEBUG guardrail pii_scan=clean latency=9ms',
  '2026-11-23T09:14:03.364Z INFO response_flushed bytes=1420 total_ms=1250',
  '2026-11-23T09:14:03.901Z INFO worker-2 handling req_88a13 user=9104',
  '2026-11-23T09:14:04.118Z ERROR timeout tool=refund_api retry=1/3',
];

const TRACE_TREE = [
  {name: 'Support-Triage (root)', ms: '1,250ms', cost: '$0.0042', depth: 0, badge: 'ok'},
  {name: 'Planner', ms: '48ms', cost: '$0.0004', depth: 1, badge: 'ok'},
  {name: 'Tool: search_kb', ms: '312ms', cost: '$0.0002', depth: 1, badge: 'cached'},
  {name: 'LLM: claude-sonnet', ms: '1,100ms', cost: '$0.0035', depth: 1, badge: '2.4K tok'},
  {name: 'Guardrail: PII scan', ms: '9ms', cost: '$0.0001', depth: 1, badge: 'passed'},
];

export const BeforeAfterSlider: React.FC = () => {
  const {ref} = useInView<HTMLElement>({threshold: 0.15, once: true});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [splitPct, setSplitPct] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplitPct(Math.max(12, Math.min(88, Math.round(pct))));
  };

  return (
    <section
      ref={ref}
      className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10"
    >
      <div className="max-w-[1360px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <h2 className="headline-display text-[28px] sm:text-[44px] leading-tight text-[#0B0B0B]">
              Before and <span className="headline-serif-accent">after</span> Sightline
            </h2>
            <p className="mt-2 text-[14px] sm:text-[16px] text-[#0B0B0B]/70 max-w-[540px]">
              Drag the divider to compare noisy plain-text worker logs against a causal trace tree.
            </p>
          </div>
          <span className="font-mono text-[11px] sm:text-[12px] text-[#0B0B0B]/60 tabular-nums">
            Split: {splitPct}%
          </span>
        </div>

        <div
          ref={containerRef}
          onPointerMove={(e) => {
            if (dragging) updateFromClientX(e.clientX);
          }}
          onPointerUp={() => setDragging(false)}
          onPointerLeave={() => setDragging(false)}
          className="relative h-[320px] sm:h-[360px] rounded-[6px] overflow-hidden border border-[#0B0B0B]/15 select-none touch-none"
        >
          {/* Right Base Layer: Structured Trace View */}
          <div className="absolute inset-0 bg-[#D9C4A8] p-4 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-[#0B0B0B]/15">
              <span className="font-mono text-[10px] sm:text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0B2FA8]">
                After · Structured Trace Tree
              </span>
              <span className="font-mono text-[10px] sm:text-[12px] text-[#0B0B0B]/70 tabular-nums">
                trace_8f21 · $0.0042
              </span>
            </div>

            <div className="flex flex-col gap-2 my-auto">
              {TRACE_TREE.map((row) => (
                <div
                  key={row.name}
                  style={{marginLeft: `${row.depth * 16}px`}}
                  className="bg-white rounded-[4px] border border-[#0B0B0B]/10 px-3 py-1.5 sm:px-3.5 sm:py-2 flex items-center justify-between gap-2 shadow-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#0B2FA8] shrink-0" />
                    <span className="text-[11px] sm:text-[13px] font-medium text-[#0B0B0B] truncate">
                      {row.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 font-mono text-[9px] sm:text-[11px] tabular-nums shrink-0">
                    <span className="px-1 py-0.5 rounded-[2px] bg-[#0B2FA8]/10 text-[#0B2FA8]">
                      {row.badge}
                    </span>
                    <span className="text-[#0B0B0B]/75">{row.ms}</span>
                    <span className="hidden sm:inline text-[#0B0B0B]/55">{row.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Left Clipped Layer: Raw Logs Wall of Text */}
          <div
            style={{clipPath: `inset(0 ${100 - splitPct}% 0 0)`}}
            className="absolute inset-0 bg-[#0B0B0B] text-white/80 p-4 sm:p-8 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/15">
              <span className="font-mono text-[10px] sm:text-[12px] font-semibold uppercase tracking-[0.08em] text-red-300">
                Before · Raw Unstructured Logs
              </span>
              <span className="font-mono text-[10px] sm:text-[12px] text-white/45">grep &quot;req_88a12&quot;</span>
            </div>

            <pre className="my-auto font-mono text-[10px] sm:text-[12px] leading-[1.6] sm:leading-[1.85] text-white/75 overflow-hidden whitespace-pre">
              {RAW_LOGS.join('\n')}
            </pre>
          </div>

          {/* Draggable Vertical Handle */}
          <div
            style={{left: `${splitPct}%`}}
            onPointerDown={(e) => {
              setDragging(true);
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            }}
            className="absolute inset-y-0 -translate-x-1/2 w-8 flex items-center justify-center cursor-ew-resize z-20"
          >
            <div className="w-[2px] h-full bg-white shadow-[0_0_8px_rgba(0,0,0,0.4)]" />
            <span className="absolute inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0B2FA8] text-white border-2 border-white shadow-lg">
              <MoveHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>

          {/* Accessible Range Input for Keyboard Users */}
          <input
            type="range"
            min={12}
            max={88}
            value={splitPct}
            onChange={(e) => setSplitPct(Number(e.target.value))}
            aria-label="Compare raw logs before and structured trace after"
            className="sr-only"
          />
        </div>
      </div>
    </section>
  );
};