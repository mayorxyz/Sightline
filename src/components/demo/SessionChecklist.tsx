import React from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Check} from 'lucide-react';
import {DemoGoal, GOAL_CHECKLIST_MAP} from '../../lib/demoContent';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface SessionChecklistProps {
  goals: DemoGoal[];
}

export const SessionChecklist: React.FC<SessionChecklistProps> = ({goals}) => {
  const reducedMotion = useReducedMotion();
  const activeGoals: DemoGoal[] = goals.length > 0 ? goals : ['Debugging', 'Evals'];

  return (
    <div className="rounded-[6px] bg-[#06154D] border border-white/15 p-3 sm:p-5 text-white">
      <div className="flex items-center justify-between pb-2 sm:pb-3 mb-2 sm:mb-3 border-b border-white/10">
        <span className="font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.08em] text-[#D9C4A8]">
          Your session will cover
        </span>
        <span className="font-mono text-[9px] sm:text-[11px] text-white/55 tabular-nums">
          {activeGoals.length} topic{activeGoals.length === 1 ? '' : 's'}
        </span>
      </div>

      <ul className="flex flex-col gap-2 sm:gap-2.5">
        <AnimatePresence initial={false}>
          {activeGoals.map((goal) => {
            const info = GOAL_CHECKLIST_MAP[goal];
            return (
              <motion.li
                key={goal}
                initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 8}}
                animate={{opacity: 1, y: 0}}
                exit={reducedMotion ? {opacity: 0} : {opacity: 0, y: -6}}
                transition={{duration: reducedMotion ? 0 : 0.22}}
                className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-[13px]"
              >
                <span className="mt-0.5 inline-flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[2px] bg-[#D9C4A8] text-[#0A1F6B] shrink-0">
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2.5} />
                </span>
                <div>
                  <span className="font-medium text-white block">{info.title}</span>
                  <span className="text-[10px] sm:text-[12px] text-white/65 leading-relaxed">{info.detail}</span>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
};