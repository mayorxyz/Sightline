import React, {useEffect, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Bell} from 'lucide-react';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface AlertItem {
  id: string;
  title: string;
  time: string;
  severity: 'critical' | 'warning' | 'resolved';
}

const ALERTS: AlertItem[] = [
  {
    id: 'a1',
    title: 'Hallucination rate > 2% on Refund-Resolver',
    time: '2m ago',
    severity: 'critical',
  },
  {
    id: 'a2',
    title: 'Latency p95 > 3s on Code-Reviewer',
    time: '14m ago',
    severity: 'warning',
  },
  {
    id: 'a3',
    title: 'Rate limit retries spiking on Lead-Enricher',
    time: '31m ago',
    severity: 'warning',
  },
  {
    id: 'a4',
    title: 'Eval regression resolved on Support-Triage',
    time: '1h ago',
    severity: 'resolved',
  },
];

type ChannelKey = 'Slack' | 'Email' | 'PagerDuty';

interface AlertFeedProps {
  active: boolean;
}

export const AlertFeed: React.FC<AlertFeedProps> = ({active}) => {
  const reducedMotion = useReducedMotion();
  const [cycle, setCycle] = useState(0);
  const [bellRing, setBellRing] = useState(false);
  const [channels, setChannels] = useState<Record<ChannelKey, boolean>>({
    Slack: true,
    Email: true,
    PagerDuty: false,
  });

  // Ring bell on initial critical alert arrival & loop every 10s
  useEffect(() => {
    if (reducedMotion || !active) return;

    setBellRing(true);
    const stopRing = setTimeout(() => setBellRing(false), 750);

    const loop = setInterval(() => {
      setCycle((c) => c + 1);
      setBellRing(true);
      setTimeout(() => setBellRing(false), 750);
    }, 10000);

    return () => {
      clearTimeout(stopRing);
      clearInterval(loop);
    };
  }, [active, reducedMotion]);

  const toggleChannel = (key: ChannelKey) => {
    setChannels((prev) => ({...prev, [key]: !prev[key]}));
  };

  return (
    <div className="h-full flex flex-col justify-between bg-[#F6F5F3] rounded-[6px] border border-[#0B0B0B]/12 p-3.5 text-[#0B0B0B]">
      {/* Header: Bell Ring + Channel Toggle Switches */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#0B0B0B]/10">
        <div className="flex items-center gap-2">
          <motion.div
            animate={
              bellRing && !reducedMotion
                ? {rotate: [0, -18, 16, -12, 10, -4, 0]}
                : {rotate: 0}
            }
            transition={{duration: 0.65, ease: 'easeInOut'}}
            className="w-6 h-6 rounded-[3px] bg-[#0B2FA8] text-white flex items-center justify-center"
          >
            <Bell className="w-3.5 h-3.5" strokeWidth={2} />
          </motion.div>
          <span className="text-[11px] font-mono font-medium text-[#0B0B0B]/75">
            live alerts
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {(['Slack', 'Email', 'PagerDuty'] as ChannelKey[]).map((ch) => {
            const on = channels[ch];
            return (
              <button
                key={ch}
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => toggleChannel(ch)}
                className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#0B0B0B]/80 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0B2FA8]"
              >
                <span>{ch}</span>
                <span
                  className={`relative inline-flex items-center w-6 h-3.5 rounded-full transition-colors duration-200 ${
                    on ? 'bg-[#0B2FA8]' : 'bg-[#0B0B0B]/20'
                  }`}
                >
                  <motion.span
                    layout
                    transition={{type: 'spring', stiffness: 520, damping: 32}}
                    className={`w-2.5 h-2.5 rounded-full bg-white shadow-sm ${
                      on ? 'ml-3' : 'ml-0.5'
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Alert Items */}
      <div className="flex flex-col gap-1.5 my-auto pt-2 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={cycle} className="flex flex-col gap-1.5">
            {ALERTS.map((item, idx) => {
              const dotClass =
                item.severity === 'critical'
                  ? 'bg-[#DC2626]'
                  : item.severity === 'warning'
                    ? 'bg-[#D9731A]'
                    : 'bg-[#16A34A]';

              const badgeClass =
                item.severity === 'critical'
                  ? 'text-[#DC2626] bg-red-50 border-red-200'
                  : item.severity === 'warning'
                    ? 'text-[#B45309] bg-amber-50 border-amber-200'
                    : 'text-[#15803D] bg-emerald-50 border-emerald-200';

              return (
                <motion.div
                  key={item.id}
                  initial={reducedMotion ? {opacity: 1, x: 0} : {opacity: 0, x: 28}}
                  animate={active || reducedMotion ? {opacity: 1, x: 0} : {opacity: 0, x: 28}}
                  transition={{
                    duration: reducedMotion ? 0 : 0.42,
                    delay: reducedMotion ? 0 : idx * 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-center justify-between gap-2 bg-white rounded-[4px] border border-[#0B0B0B]/10 px-2.5 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} />
                    <span className="text-[11px] font-medium text-[#0B0B0B] truncate">
                      {item.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[10px] tabular-nums text-[#0B0B0B]/50">
                      {item.time}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded-[2px] border font-mono text-[9.5px] font-medium ${badgeClass}`}
                    >
                      {item.severity}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
