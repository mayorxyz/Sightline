import React, {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface EvalRow {
  id: string;
  snippet: string;
  score: number;
  status: 'pass' | 'fail';
}

const EVAL_ROWS: EvalRow[] = [
  {id: 'refund_policy_012', snippet: 'Order #4812 past 30d', score: 0.96, status: 'pass'},
  {id: 'tone_check_044', snippet: 'Escalate billing case', score: 0.91, status: 'pass'},
  {id: 'hallucination_007', snippet: 'Verify warranty term', score: 0.42, status: 'fail'},
  {id: 'tool_choice_019', snippet: 'Fetch invoice PDF', score: 0.88, status: 'pass'},
  {id: 'pii_leak_003', snippet: 'Redact SSN summary', score: 0.99, status: 'pass'},
];

interface EvalTableProps {
  active: boolean;
}

export const EvalTable: React.FC<EvalTableProps> = ({active}) => {
  const reducedMotion = useReducedMotion();
  const [scores, setScores] = useState<number[]>(() =>
    reducedMotion ? EVAL_ROWS.map((r) => r.score) : EVAL_ROWS.map(() => 0)
  );
  const [passRate, setPassRate] = useState<number>(reducedMotion ? 94.2 : 0);
  const [pulseFail, setPulseFail] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setScores(EVAL_ROWS.map((r) => r.score));
      setPassRate(94.2);
      return;
    }
    if (!active) return;

    let rafId = 0;
    const duration = 950;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setScores(EVAL_ROWS.map((r) => Number((r.score * eased).toFixed(2))));
      setPassRate(Number((94.2 * eased).toFixed(1)));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setScores(EVAL_ROWS.map((r) => r.score));
        setPassRate(94.2);
        setPulseFail(true);
      }
    };

    const delayTimer = setTimeout(() => {
      rafId = requestAnimationFrame(tick);
    }, 180);

    return () => {
      clearTimeout(delayTimer);
      cancelAnimationFrame(rafId);
    };
  }, [active, reducedMotion]);

  const ringRadius = 12;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset = ringCircumference * (1 - 0.942);

  return (
    <div className="h-full flex flex-col justify-between bg-[#06154D] rounded-[6px] border border-white/15 p-3.5 text-white">
      {/* Header with animated Ring Chart */}
      <div className="flex items-center justify-between pb-2 border-b border-white/15">
        <span className="text-[11px] font-mono text-white/70">eval_suite · 5 cases</span>
        <div className="flex items-center gap-2">
          <svg width="30" height="30" viewBox="0 0 30 30" className="-rotate-90" aria-hidden="true">
            <circle
              cx="15"
              cy="15"
              r={ringRadius}
              fill="none"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="3"
            />
            <motion.circle
              cx="15"
              cy="15"
              r={ringRadius}
              fill="none"
              stroke="#D9C4A8"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              initial={
                reducedMotion
                  ? {strokeDashoffset: ringDashOffset}
                  : {strokeDashoffset: ringCircumference}
              }
              animate={
                active || reducedMotion
                  ? {strokeDashoffset: ringDashOffset}
                  : {strokeDashoffset: ringCircumference}
              }
              transition={{duration: reducedMotion ? 0 : 0.95, ease: [0.16, 1, 0.3, 1]}}
            />
          </svg>
          <span className="text-[11px] font-mono font-medium tabular-nums text-[#D9C4A8]">
            Pass rate {passRate.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 5 Eval Rows */}
      <div className="flex flex-col gap-1.5 my-auto pt-2">
        {EVAL_ROWS.map((row, idx) => {
          const isFail = row.status === 'fail';
          return (
            <motion.div
              key={row.id}
              initial={reducedMotion ? {opacity: 1, x: 0} : {opacity: 0, x: 16}}
              animate={
                active || reducedMotion
                  ? {
                      opacity: 1,
                      x: 0,
                      backgroundColor:
                        isFail && pulseFail && !reducedMotion
                          ? [
                              'rgba(220,38,38,0.12)',
                              'rgba(220,38,38,0.34)',
                              'rgba(220,38,38,0.14)',
                            ]
                          : isFail
                            ? 'rgba(220,38,38,0.14)'
                            : 'rgba(255,255,255,0.05)',
                    }
                  : {opacity: 0, x: 16}
              }
              transition={{
                opacity: {duration: 0.35, delay: reducedMotion ? 0 : idx * 0.08},
                x: {duration: 0.38, delay: reducedMotion ? 0 : idx * 0.08, ease: [0.16, 1, 0.3, 1]},
                backgroundColor: {duration: 0.75, ease: 'easeInOut'},
              }}
              className={`grid grid-cols-[1.2fr_1fr_42px_40px] items-center gap-2 px-2.5 py-1.5 rounded-[4px] border ${
                isFail ? 'border-red-400/40' : 'border-white/10'
              }`}
            >
              <span className="font-mono text-[10.5px] text-white truncate">{row.id}</span>
              <span className="text-[10.5px] text-white/65 truncate">{row.snippet}</span>
              <span className="font-mono text-[11px] tabular-nums text-right text-white">
                {scores[idx].toFixed(2)}
              </span>
              <span
                className={`font-mono text-[10px] text-right font-medium ${
                  isFail ? 'text-red-300' : 'text-emerald-300'
                }`}
              >
                {row.status}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
