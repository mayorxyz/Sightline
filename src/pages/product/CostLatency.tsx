import React, {useMemo, useState} from 'react';
import {ProductPageTemplate} from '../../components/product/ProductPageTemplate';
import {PRODUCT_PAGES} from '../../lib/productContent';

type TimeRange = '1h' | '24h' | '7d';
type GroupBy = 'model' | 'agent';

const SERIES_BY_RANGE: Record<TimeRange, {cost: number[]; latency: number[]; projectedMonthly: string}> = {
  '1h': {
    cost: [41, 42, 40, 43, 44, 42, 41, 39, 42, 43, 41, 42],
    latency: [1.8, 1.84, 1.79, 1.88, 1.91, 1.84, 1.82, 1.77, 1.83, 1.86, 1.81, 1.84],
    projectedMonthly: '$3,140',
  },
  '24h': {
    cost: [45, 44, 43, 46, 44, 42, 41, 40, 42, 41, 40, 42],
    latency: [1.96, 1.92, 1.89, 1.94, 1.88, 1.85, 1.82, 1.8, 1.84, 1.83, 1.81, 1.84],
    projectedMonthly: '$2,980',
  },
  '7d': {
    cost: [49, 48, 47, 45, 44, 43, 42, 41, 42, 40, 41, 42],
    latency: [2.12, 2.05, 1.98, 1.94, 1.91, 1.88, 1.86, 1.84, 1.85, 1.82, 1.83, 1.84],
    projectedMonthly: '$2,890',
  },
};

const GROUPS: Record<GroupBy, {name: string; share: number; spend: string}[]> = {
  model: [
    {name: 'claude-sonnet', share: 44, spend: '$1,310'},
    {name: 'gpt-4.1', share: 38, spend: '$1,132'},
    {name: 'gemini-2.5', share: 18, spend: '$538'},
  ],
  agent: [
    {name: 'Support-Triage', share: 48, spend: '$1,430'},
    {name: 'Code-Reviewer', share: 31, spend: '$924'},
    {name: 'Refund-Resolver', share: 21, spend: '$626'},
  ],
};

const CostLatencyDemo: React.FC = () => {
  const [range, setRange] = useState<TimeRange>('24h');
  const [groupBy, setGroupBy] = useState<GroupBy>('model');

  const activeData = SERIES_BY_RANGE[range];
  const groups = GROUPS[groupBy];

  const {costPath, latencyPath} = useMemo(() => {
    const w = 520;
    const h = 130;
    const toPath = (vals: number[], min: number, max: number) =>
      vals
        .map((v, i) => {
          const x = 10 + (i / (vals.length - 1)) * (w - 20);
          const y = h - 12 - ((v - min) / (max - min)) * (h - 24);
          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(' ');
    return {
      costPath: toPath(activeData.cost, 36, 52),
      latencyPath: toPath(activeData.latency, 1.7, 2.2),
    };
  }, [activeData]);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-white/15">
        <div className="flex items-center gap-1.5">
          {(['1h', '24h', '7d'] as TimeRange[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`px-2.5 sm:px-3 py-1 rounded-[3px] font-mono text-[10px] sm:text-[11.5px] cursor-pointer ${
                range === r
                  ? 'bg-[#D9C4A8] text-[#0A1F6B] font-semibold'
                  : 'bg-white/10 text-white/75 hover:bg-white/20'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-[3px] bg-[#06154D] border border-white/15 p-0.5">
            {(['model', 'agent'] as GroupBy[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroupBy(g)}
                className={`px-2 sm:px-2.5 py-1 rounded-[2px] font-mono text-[10px] sm:text-[11px] capitalize cursor-pointer ${
                  groupBy === g ? 'bg-[#0B2FA8] text-white font-semibold' : 'text-white/65'
                }`}
              >
                By {g}
              </button>
            ))}
          </div>

          <div className="px-2.5 sm:px-3 py-1 rounded-[3px] bg-white/10 border border-white/15 font-mono text-[10px] sm:text-[11.5px] tabular-nums">
            <span className="text-white/65 hidden sm:inline">Projected monthly: </span>
            <span className="text-[#D9C4A8] font-semibold">{activeData.projectedMonthly}</span>
          </div>
        </div>
      </div>

      <div className="rounded-[6px] bg-[#06154D] border border-white/15 p-3 sm:p-4">
        <svg viewBox="0 0 520 130" className="w-full h-[120px] sm:h-[140px] overflow-visible">
          {[28, 65, 102].map((y) => (
            <line
              key={y}
              x1="10"
              y1={y}
              x2="510"
              y2={y}
              stroke="rgba(255,255,255,0.1)"
              strokeDasharray="3 3"
            />
          ))}
          <path d={costPath} fill="none" stroke="#D9C4A8" strokeWidth="2.2" strokeLinecap="round" />
          <path d={latencyPath} fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {groups.map((item) => (
          <div
            key={item.name}
            className="rounded-[4px] bg-white/8 border border-white/12 px-3 sm:px-3.5 py-2 sm:py-2.5 flex items-center justify-between font-mono text-[11px] sm:text-[12px] tabular-nums"
          >
            <span className="text-white truncate mr-2">{item.name}</span>
            <span className="text-[#D9C4A8] shrink-0">
              {item.share}% · {item.spend}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CostLatency: React.FC = () => {
  return <ProductPageTemplate data={PRODUCT_PAGES.cost} demo={<CostLatencyDemo />} />;
};

export default CostLatency;