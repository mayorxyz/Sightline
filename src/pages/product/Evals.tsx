import React, {useState} from 'react';
import {ProductPageTemplate} from '../../components/product/ProductPageTemplate';
import {PRODUCT_PAGES} from '../../lib/productContent';

interface DatasetCase {
  id: string;
  snippet: string;
  scoreA: number;
  scoreB: number;
}

const DATASETS: Record<string, DatasetCase[]> = {
  'Support Groundedness': [
    {id: 'refund_policy_012', snippet: 'Order #4812 past 30d', scoreA: 0.91, scoreB: 0.96},
    {id: 'tone_check_044', snippet: 'Escalate billing case', scoreA: 0.87, scoreB: 0.91},
    {id: 'hallucination_007', snippet: 'Verify warranty term', scoreA: 0.42, scoreB: 0.84},
    {id: 'tool_choice_019', snippet: 'Fetch invoice PDF', scoreA: 0.85, scoreB: 0.88},
    {id: 'pii_leak_003', snippet: 'Redact SSN summary', scoreA: 0.98, scoreB: 0.99},
  ],
  'Refund Policy': [
    {id: 'window_check_01', snippet: '29-day partial return', scoreA: 0.88, scoreB: 0.94},
    {id: 'intl_shipping_08', snippet: 'Customs duty exclusion', scoreA: 0.72, scoreB: 0.86},
    {id: 'gift_card_014', snippet: 'Store credit fallback', scoreA: 0.93, scoreB: 0.97},
    {id: 'expired_promo_02', snippet: 'Holiday bundle rule', scoreA: 0.61, scoreB: 0.79},
    {id: 'chargeback_09', snippet: 'Dispute escalation flow', scoreA: 0.9, scoreB: 0.92},
  ],
  'Code Safety': [
    {id: 'sql_injection_04', snippet: 'Parameterized query gen', scoreA: 0.95, scoreB: 0.99},
    {id: 'secret_scan_11', snippet: 'Avoid logging bearer', scoreA: 0.89, scoreB: 0.95},
    {id: 'shell_escape_03', snippet: 'Sanitize CLI path arg', scoreA: 0.66, scoreB: 0.82},
    {id: 'xss_binding_07', snippet: 'React safe text bind', scoreA: 0.97, scoreB: 0.98},
    {id: 'auth_check_15', snippet: 'Server role guard', scoreA: 0.81, scoreB: 0.91},
  ],
};

const EvalsDemo: React.FC = () => {
  const datasetNames = Object.keys(DATASETS);
  const [dataset, setDataset] = useState(datasetNames[0]);
  const [threshold, setThreshold] = useState(0.8);
  const [version, setVersion] = useState<'A' | 'B'>('B');

  const rows = DATASETS[dataset];
  const passedCount = rows.filter((r) => (version === 'A' ? r.scoreA : r.scoreB) >= threshold).length;
  const passRate = ((passedCount / rows.length) * 100).toFixed(1);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* Control Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-white/15">
        <div className="flex flex-wrap items-center gap-1.5">
          {datasetNames.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setDataset(name)}
              className={`px-2.5 sm:px-3 py-1 rounded-[3px] font-mono text-[10px] sm:text-[11.5px] transition-colors cursor-pointer ${
                dataset === name
                  ? 'bg-[#D9C4A8] text-[#0A1F6B] font-semibold'
                  : 'bg-white/10 text-white/75 hover:bg-white/20'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <label className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11.5px] tabular-nums">
            <span className="text-white/70 hidden sm:inline">Threshold:</span>
            <span className="text-white/70">{threshold.toFixed(2)}</span>
            <input
              type="range"
              min={0.5}
              max={0.95}
              step={0.05}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-20 sm:w-24 accent-[#D9C4A8] cursor-pointer"
            />
          </label>

          <div className="inline-flex rounded-[3px] bg-[#06154D] border border-white/15 p-0.5">
            {(['A', 'B'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVersion(v)}
                className={`px-2 sm:px-2.5 py-1 rounded-[2px] font-mono text-[10px] sm:text-[11px] cursor-pointer ${
                  version === v ? 'bg-[#0B2FA8] text-white font-semibold' : 'text-white/65'
                }`}
              >
                Prompt {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Recomputed Pass Rate Banner */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-[4px] bg-[#06154D] border border-white/15 font-mono text-[10px] sm:text-[12px] tabular-nums">
        <span className="text-white/75 truncate mr-2">
          Evaluating {dataset} · Prompt {version}
        </span>
        <span className="text-[#D9C4A8] font-semibold shrink-0">
          Pass rate: {passRate}% ({passedCount}/{rows.length})
        </span>
      </div>

      {/* Eval Table */}
      <div className="flex flex-col gap-1.5">
        {rows.map((row) => {
          const score = version === 'A' ? row.scoreA : row.scoreB;
          const pass = score >= threshold;
          const delta = Number((row.scoreB - row.scoreA).toFixed(2));
          return (
            <div
              key={row.id}
              className={`grid grid-cols-[1.2fr_1.2fr_50px_48px_40px] sm:grid-cols-[1.2fr_1.2fr_60px_54px_46px] items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-[4px] border font-mono text-[10px] sm:text-[11.5px] tabular-nums ${
                pass ? 'bg-white/5 border-white/10' : 'bg-red-500/15 border-red-400/40'
              }`}
            >
              <span className="text-white truncate">{row.id}</span>
              <span className="text-white/65 font-sans text-[11px] sm:text-[12px] truncate">{row.snippet}</span>
              <span className="text-right text-white">{score.toFixed(2)}</span>
              <span className="text-right text-[#D9C4A8]">
                {delta >= 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)}
              </span>
              <span className={`text-right font-semibold ${pass ? 'text-emerald-300' : 'text-red-300'}`}>
                {pass ? 'pass' : 'fail'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Evals: React.FC = () => {
  return <ProductPageTemplate data={PRODUCT_PAGES.evals} demo={<EvalsDemo />} />;
};

export default Evals;