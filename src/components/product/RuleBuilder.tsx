import React, {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {BellRing, Play} from 'lucide-react';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface LiveAlertRow {
  id: string;
  rule: string;
  channel: string;
  time: string;
  severity: 'critical' | 'warning' | 'resolved';
}

const INITIAL_FEED: LiveAlertRow[] = [
  {
    id: 'r1',
    rule: 'Hallucination rate > 2% on Refund-Resolver',
    channel: 'PagerDuty',
    time: '2m ago',
    severity: 'critical',
  },
  {
    id: 'r2',
    rule: 'p95 latency > 3s on Code-Reviewer',
    channel: 'Slack',
    time: '14m ago',
    severity: 'warning',
  },
  {
    id: 'r3',
    rule: 'Eval score < 0.90 resolved on Support-Triage',
    channel: 'Email',
    time: '48m ago',
    severity: 'resolved',
  },
];

export const RuleBuilder: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [metric, setMetric] = useState('p95 latency');
  const [operator, setOperator] = useState('>');
  const [threshold, setThreshold] = useState('2.5s');
  const [channel, setChannel] = useState('Slack');
  const [feed, setFeed] = useState<LiveAlertRow[]>(INITIAL_FEED);
  const [bellShake, setBellShake] = useState(false);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const newRow: LiveAlertRow = {
      id: `sim-${Date.now()}`,
      rule: `${metric} ${operator} ${threshold} triggered on Support-Triage`,
      channel,
      time: 'just now',
      severity: metric.includes('Hallucination') || metric.includes('Error') ? 'critical' : 'warning',
    };
    setFeed((prev) => [newRow, ...prev.slice(0, 4)]);
    if (!reducedMotion) {
      setBellShake(true);
      setTimeout(() => setBellShake(false), 650);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
      {/* Rule Builder Controls */}
      <form
        onSubmit={handleSimulate}
        className="lg:col-span-5 rounded-[6px] bg-white/8 border border-white/15 p-4 sm:p-5 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-white/15">
          <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.08em] text-[#D9C4A8]">
            Rule Builder
          </span>
          <motion.span
            animate={bellShake && !reducedMotion ? {rotate: [0, -16, 16, -10, 8, 0]} : {rotate: 0}}
            transition={{duration: 0.55}}
            className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-[3px] bg-[#0B2FA8] text-white"
          >
            <BellRing className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </motion.span>
        </div>

        <div>
          <label className="block font-mono text-[10px] sm:text-[11px] text-white/70 mb-1">Metric</label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="w-full rounded-[4px] bg-[#06154D] border border-white/20 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[12px] sm:text-[13px] text-white focus:outline-none focus:border-[#D9C4A8]"
          >
            <option value="p95 latency">p95 latency</option>
            <option value="Error rate">Error rate</option>
            <option value="Cost per run">Cost per run</option>
            <option value="Eval score">Eval score</option>
            <option value="Hallucination flag">Hallucination flag</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-mono text-[10px] sm:text-[11px] text-white/70 mb-1">Operator</label>
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="w-full rounded-[4px] bg-[#06154D] border border-white/20 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[12px] sm:text-[13px] text-white focus:outline-none focus:border-[#D9C4A8]"
            >
              <option value=">">&gt; greater than</option>
              <option value="<">&lt; less than</option>
              <option value="==">== equals</option>
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] sm:text-[11px] text-white/70 mb-1">Threshold</label>
            <input
              type="text"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-full rounded-[4px] bg-[#06154D] border border-white/20 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[12px] sm:text-[13px] font-mono text-white focus:outline-none focus:border-[#D9C4A8]"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] sm:text-[11px] text-white/70 mb-1">Channel</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {['Slack', 'Email', 'PagerDuty', 'Webhook'].map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => setChannel(ch)}
                className={`px-2 py-1 sm:py-1.5 rounded-[3px] font-mono text-[10px] sm:text-[11px] border transition-colors cursor-pointer ${
                  channel === ch
                    ? 'bg-[#D9C4A8] text-[#0A1F6B] border-[#D9C4A8] font-semibold'
                    : 'bg-white/5 text-white/75 border-white/15 hover:bg-white/10'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-[2px] bg-[#D9C4A8] hover:bg-white text-[#0A1F6B] font-medium text-[12px] sm:text-[13px] py-2 sm:py-2.5 px-4 transition-colors cursor-pointer"
        >
          <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
          <span>Simulate Trigger</span>
        </button>
      </form>

      {/* Live Triggered Feed */}
      <div className="lg:col-span-7 rounded-[6px] bg-[#06154D] border border-white/15 p-4 sm:p-5">
        <div className="flex items-center justify-between pb-2 sm:pb-3 mb-2 sm:mb-3 border-b border-white/10">
          <span className="font-mono text-[11px] sm:text-[12px] text-[#D9C4A8] uppercase tracking-[0.08em]">
            Triggered Alert Stream
          </span>
          <span className="font-mono text-[10px] sm:text-[11px] text-white/60 tabular-nums">
            {feed.length} active events
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {feed.map((item) => {
              const dot =
                item.severity === 'critical'
                  ? 'bg-[#F87171]'
                  : item.severity === 'warning'
                    ? 'bg-[#FBBF24]'
                    : 'bg-[#4ADE80]';
              return (
                <motion.div
                  key={item.id}
                  initial={reducedMotion ? {opacity: 1} : {opacity: 0, x: 18}}
                  animate={{opacity: 1, x: 0}}
                  exit={{opacity: 0}}
                  transition={{duration: reducedMotion ? 0 : 0.28}}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-[4px] bg-white/6 border border-white/10 px-3 sm:px-3.5 py-2 sm:py-2.5"
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${dot}`} />
                    <span className="text-[12px] sm:text-[13px] text-white truncate">{item.rule}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-2.5 font-mono text-[10px] sm:text-[11px] tabular-nums shrink-0">
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-[2px] bg-[#0B2FA8] text-white">
                      {item.channel}
                    </span>
                    <span className="text-white/55">{item.time}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};