import React, {useEffect, useRef, useState} from 'react';
import {Check, ChevronDown, Copy} from 'lucide-react';
import {ROI_ASSUMPTIONS, RoiInputs} from '../../../lib/pricingContent';
import {Button} from '../../../components/Button';
import {useReducedMotion} from '../../../hooks/useReducedMotion';

function useAnimatedValue(target: number, reducedMotion: boolean) {
  const [display, setDisplay] = useState<number>(target);
  const prevRef = useRef<number>(target);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(target);
      prevRef.current = target;
      return;
    }

    const from = prevRef.current;
    const start = performance.now();
    const duration = 340;
    let rafId = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (target - from) * eased);
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        prevRef.current = target;
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, reducedMotion]);

  return display;
}

interface RoiResultsProps {
  inputs: RoiInputs;
}

export const RoiResults: React.FC<RoiResultsProps> = ({inputs}) => {
  const reducedMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [showFormulas, setShowFormulas] = useState(false);

  // Formulas per spec
  const hoursSavedPerMonth = inputs.engineers * inputs.debugHoursPerWeek * 4.33 * 0.6;
  const engSavings = hoursSavedPerMonth * inputs.hourlyCost;
  const llmSavings = inputs.monthlyLlmSpend * 0.18;
  const incidentSavings = inputs.incidentsPerMonth * inputs.costPerIncident * 0.5;
  const totalMonthlySavings = engSavings + llmSavings + incidentSavings;
  const annualSavings = totalMonthlySavings * 12;
  const teamPlanCost = Math.max(1, inputs.engineers) * 49;
  const paybackMultiple = totalMonthlySavings / teamPlanCost;

  const animHours = useAnimatedValue(hoursSavedPerMonth, reducedMotion);
  const animLlm = useAnimatedValue(llmSavings, reducedMotion);
  const animIncident = useAnimatedValue(incidentSavings, reducedMotion);
  const animMonthly = useAnimatedValue(totalMonthlySavings, reducedMotion);
  const animAnnual = useAnimatedValue(annualSavings, reducedMotion);

  const safeTotal = Math.max(1, totalMonthlySavings);
  const engPct = (engSavings / safeTotal) * 100;
  const llmPct = (llmSavings / safeTotal) * 100;
  const incPct = (incidentSavings / safeTotal) * 100;

  const handleCopy = () => {
    const summary = [
      'Sightline ROI Estimate',
      `Engineers: ${inputs.engineers} | Debug hrs/wk: ${inputs.debugHoursPerWeek} | LLM spend: $${inputs.monthlyLlmSpend.toLocaleString()}/mo`,
      `Debugging hours saved / month: ${Math.round(hoursSavedPerMonth)} hrs ($${Math.round(engSavings).toLocaleString()})`,
      `LLM spend saved / month: $${Math.round(llmSavings).toLocaleString()}`,
      `Incident cost avoided / month: $${Math.round(incidentSavings).toLocaleString()}`,
      `Total monthly savings: $${Math.round(totalMonthlySavings).toLocaleString()}`,
      `Estimated annual savings: $${Math.round(annualSavings).toLocaleString()}`,
      `Payback vs Team plan ($${teamPlanCost}/mo): ${paybackMultiple.toFixed(1)}x ROI`,
      'Note: Estimates only, not guarantees.',
    ].join('\n');

    navigator.clipboard?.writeText(summary).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      aria-live="polite"
      className="w-full min-w-0 rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] text-white p-3.5 sm:p-8 flex flex-col justify-between gap-4 sm:gap-6"
    >
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-white/15 min-w-0">
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#D9C4A8] shrink-0">
            Estimated Impact
          </span>
          <span className="font-mono text-[10px] sm:text-[11px] text-white/60 truncate">
            Estimates, not guarantees
          </span>
        </div>

        {/* Primary Total */}
        <div className="mt-3.5 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
          <div className="min-w-0 rounded-[5px] sm:rounded-[6px] bg-white/8 border border-white/15 p-3 sm:p-4">
            <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.06em] text-[#D9C4A8] truncate">
              Total monthly savings
            </span>
            <span className="mt-1 block font-mono text-[24px] sm:text-[38px] font-medium tracking-[-0.03em] leading-none tabular-nums truncate">
              ${Math.round(animMonthly).toLocaleString()}
            </span>
          </div>

          <div className="min-w-0 rounded-[5px] sm:rounded-[6px] bg-white/8 border border-white/15 p-3 sm:p-4">
            <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.06em] text-[#D9C4A8] truncate">
              Annual savings
            </span>
            <span className="mt-1 block font-mono text-[24px] sm:text-[38px] font-medium tracking-[-0.03em] leading-none tabular-nums text-[#D9C4A8] truncate">
              ${Math.round(animAnnual).toLocaleString()}
            </span>
          </div>
        </div>

        {/* 3 Breakdown Metrics + Payback */}
        <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3">
          <div className="min-w-0 rounded-[4px] bg-[#06154D] border border-white/10 p-2.5 sm:p-3.5">
            <span className="block font-mono text-[9.5px] sm:text-[10.5px] text-white/60 truncate">
              Debug hrs saved / mo
            </span>
            <span className="mt-1 block font-mono text-[16px] sm:text-[20px] font-medium leading-tight tabular-nums truncate">
              {Math.round(animHours)} hrs
            </span>
          </div>

          <div className="min-w-0 rounded-[4px] bg-[#06154D] border border-white/10 p-2.5 sm:p-3.5">
            <span className="block font-mono text-[9.5px] sm:text-[10.5px] text-white/60 truncate">
              LLM spend saved / mo
            </span>
            <span className="mt-1 block font-mono text-[16px] sm:text-[20px] font-medium leading-tight tabular-nums truncate">
              ${Math.round(animLlm).toLocaleString()}
            </span>
          </div>

          <div className="min-w-0 rounded-[4px] bg-[#06154D] border border-white/10 p-2.5 sm:p-3.5">
            <span className="block font-mono text-[9.5px] sm:text-[10.5px] text-white/60 truncate">
              Incident cost avoided
            </span>
            <span className="mt-1 block font-mono text-[16px] sm:text-[20px] font-medium leading-tight tabular-nums truncate">
              ${Math.round(animIncident).toLocaleString()}
            </span>
          </div>

          <div className="min-w-0 rounded-[4px] bg-[#06154D] border border-white/10 p-2.5 sm:p-3.5">
            <span className="block font-mono text-[9.5px] sm:text-[10.5px] text-white/60 truncate">
              Payback vs Team plan
            </span>
            <span className="mt-1 block font-mono text-[16px] sm:text-[20px] font-medium leading-tight tabular-nums text-[#86EFAC] truncate">
              {paybackMultiple.toFixed(1)}x ROI
            </span>
          </div>
        </div>

        {/* Stacked Bar Chart of 3 Savings */}
        <div className="mt-4 sm:mt-5 min-w-0">
          <div className="flex items-center justify-between gap-2 font-mono text-[10px] sm:text-[10.5px] text-white/70 mb-1.5">
            <span>Savings composition</span>
            <span className="tabular-nums shrink-0">
              ${Math.round(totalMonthlySavings).toLocaleString()} / mo
            </span>
          </div>
          <div className="h-3 sm:h-3.5 w-full rounded-[3px] overflow-hidden flex bg-white/10">
            <div style={{width: `${engPct}%`}} className="bg-[#2958FF] transition-all duration-300" />
            <div style={{width: `${llmPct}%`}} className="bg-[#D9C4A8] transition-all duration-300" />
            <div style={{width: `${incPct}%`}} className="bg-white transition-all duration-300" />
          </div>
          <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-4 font-mono text-[10px] sm:text-[11px] text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2958FF] shrink-0" />
              Engineering ({Math.round(engPct)}%)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D9C4A8] shrink-0" />
              LLM Spend ({Math.round(llmPct)}%)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white shrink-0" />
              Incidents ({Math.round(incPct)}%)
            </span>
          </div>
        </div>

        {/* Collapsible Formulas */}
        <div className="mt-4 sm:mt-5 border-t border-white/15 pt-3 sm:pt-4 min-w-0">
          <button
            type="button"
            onClick={() => setShowFormulas((s) => !s)}
            aria-expanded={showFormulas}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-[11.5px] text-[#D9C4A8] hover:text-white cursor-pointer"
          >
            <span>How we calculate</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform shrink-0 ${
                showFormulas ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showFormulas && (
            <ul className="mt-2.5 sm:mt-3 flex flex-col gap-2 text-[11.5px] sm:text-[12px] text-white/75 bg-[#06154D] rounded-[4px] border border-white/10 p-2.5 sm:p-3.5">
              {ROI_ASSUMPTIONS.map((a) => (
                <li key={a.label} className="min-w-0">
                  <span className="block font-medium text-white leading-snug">{a.label}</span>
                  <span className="font-mono text-[10.5px] sm:text-[11px] text-white/60 break-words">
                    {a.formula}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[2px] border border-white/25 bg-white/10 hover:bg-white/20 text-white text-[12.5px] sm:text-[13px] font-medium px-3.5 sm:px-4 py-2.5 sm:py-3 transition-colors cursor-pointer whitespace-nowrap"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D9C4A8] shrink-0" />
          ) : (
            <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          )}
          <span>{copied ? 'Results copied' : 'Copy my results'}</span>
        </button>

        <div className="w-full sm:w-auto [&>*]:w-full sm:[&>*]:w-auto">
          <Button label="Book a Demo" variant="sand" to="/demo" />
        </div>
      </div>
    </div>
  );
};