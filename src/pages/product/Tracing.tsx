import React, {useState} from 'react';
import {ProductPageTemplate} from '../../components/product/ProductPageTemplate';
import {PRODUCT_PAGES} from '../../lib/productContent';

type SpanFilter = 'All' | 'LLM' | 'Tool' | 'Guardrail';

interface DemoSpan {
  id: string;
  label: string;
  kind: Exclude<SpanFilter, 'All'>;
  start: number;
  end: number;
  tokens: string;
  cost: string;
  input: string;
  output: string;
}

const DEMO_SPANS: DemoSpan[] = [
  {
    id: 'planner',
    label: 'Planner (claude-sonnet)',
    kind: 'LLM',
    start: 0,
    end: 180,
    tokens: '384 tok',
    cost: '$0.0008',
    input: '{"query": "Can I refund order #4812 bought 21 days ago?"}',
    output: '{"plan": ["search_kb(refund_policy)", "synthesize_answer"]}',
  },
  {
    id: 'search_kb',
    label: 'Tool: search_kb',
    kind: 'Tool',
    start: 180,
    end: 492,
    tokens: '1,120 tok',
    cost: '$0.0004',
    input: '{"index": "support_docs_v4", "query": "refund window 30 days"}',
    output: '{"hits": 3, "top_score": 0.94, "doc_id": "pol_refund_30d"}',
  },
  {
    id: 'rerank',
    label: 'Tool: rerank_chunks',
    kind: 'Tool',
    start: 492,
    end: 610,
    tokens: '640 tok',
    cost: '$0.0003',
    input: '{"chunks": 3, "model": "rerank-v2"}',
    output: '{"selected": ["pol_refund_30d#sec2"]}',
  },
  {
    id: 'synthesis',
    label: 'LLM: claude-sonnet',
    kind: 'LLM',
    start: 610,
    end: 1810,
    tokens: '2,410 tok',
    cost: '$0.0026',
    input: '{"context": "Orders within 30 days qualify for full refund..."}',
    output: '"Order #4812 is eligible for a full refund within our 30-day policy."',
  },
  {
    id: 'guardrail',
    label: 'Guardrail: policy_pii',
    kind: 'Guardrail',
    start: 1810,
    end: 1850,
    tokens: '96 tok',
    cost: '$0.0001',
    input: '{"text": "Order #4812 is eligible for a full refund..."}',
    output: '{"pii_found": false, "grounded": true, "status": "pass"}',
  },
];

const TracingDemo: React.FC = () => {
  const [filter, setFilter] = useState<SpanFilter>('All');
  const [selectedId, setSelectedId] = useState<string>('search_kb');

  const visibleSpans = DEMO_SPANS.filter((s) => filter === 'All' || s.kind === filter);
  const selectedSpan =
    visibleSpans.find((s) => s.id === selectedId) ?? visibleSpans[0] ?? DEMO_SPANS[0];

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* Control Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-white/15">
        <div className="flex flex-wrap items-center gap-1.5">
          {(['All', 'LLM', 'Tool', 'Guardrail'] as SpanFilter[]).map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setFilter(chip)}
              className={`px-2.5 sm:px-3 py-1 rounded-[3px] font-mono text-[10px] sm:text-[11.5px] transition-colors cursor-pointer ${
                filter === chip
                  ? 'bg-[#D9C4A8] text-[#0A1F6B] font-semibold'
                  : 'bg-white/10 text-white/75 hover:bg-white/20'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
        <span className="font-mono text-[10px] sm:text-[11px] text-white/65 tabular-nums">
          Click any span to inspect payload
        </span>
      </div>

      {/* Waterfall + Inspector Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col gap-2">
          {visibleSpans.map((span) => {
            const leftPct = (span.start / 1900) * 100;
            const widthPct = Math.max(4, ((span.end - span.start) / 1900) * 100);
            const active = selectedSpan.id === span.id;

            return (
              <button
                key={span.id}
                type="button"
                onClick={() => setSelectedId(span.id)}
                className={`w-full text-left grid grid-cols-[110px_1fr_48px] sm:grid-cols-[150px_1fr_54px] items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-[4px] border transition-colors cursor-pointer ${
                  active
                    ? 'bg-white/15 border-[#D9C4A8]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="font-mono text-[10px] sm:text-[11.5px] text-white truncate">{span.label}</span>
                <div className="relative h-2.5 sm:h-3 bg-white/10 rounded-[2px] overflow-hidden">
                  <div
                    style={{left: `${leftPct}%`, width: `${widthPct}%`}}
                    className="absolute inset-y-0 rounded-[2px] bg-[#D9C4A8]"
                  />
                </div>
                <span className="font-mono text-[10px] sm:text-[11px] tabular-nums text-right text-white/75">
                  {span.end - span.start}ms
                </span>
              </button>
            );
          })}
        </div>

        {/* Click-to-Inspect Side Panel */}
        <div className="lg:col-span-5 rounded-[6px] bg-[#06154D] border border-white/15 p-3 sm:p-4 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-mono text-[11px] sm:text-[12px] font-medium text-[#D9C4A8] truncate mr-2">
              {selectedSpan.label}
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] tabular-nums text-white/70 shrink-0">
              {selectedSpan.tokens} · {selectedSpan.cost}
            </span>
          </div>

          <div className="flex flex-col gap-2 font-mono text-[10px] sm:text-[11px]">
            <div>
              <span className="text-white/50 block mb-0.5">INPUT</span>
              <div className="rounded-[4px] bg-white/5 p-2 text-white/85 break-words">
                {selectedSpan.input}
              </div>
            </div>
            <div>
              <span className="text-white/50 block mb-0.5">OUTPUT</span>
              <div className="rounded-[4px] bg-white/5 p-2 text-emerald-200 break-words">
                {selectedSpan.output}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tracing: React.FC = () => {
  return <ProductPageTemplate data={PRODUCT_PAGES.tracing} demo={<TracingDemo />} />;
};

export default Tracing;