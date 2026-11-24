import React, {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {Flag, Play, X, Check} from 'lucide-react';
import {SandboxTraceRun} from '../../lib/demoContent';
import {TraceWaterfall} from '../features/TraceWaterfall';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface TracePanelProps {
  run: SandboxTraceRun;
  isFlagged: boolean;
  onClose: () => void;
  onFlagBad: (run: SandboxTraceRun) => void;
}

export const TracePanel: React.FC<TracePanelProps> = ({
  run,
  isFlagged,
  onClose,
  onFlagBad,
}) => {
  const reducedMotion = useReducedMotion();
  const [replayStep, setReplayStep] = useState<number>(-1);
  const [replaying, setReplaying] = useState(false);

  useEffect(() => {
    setReplayStep(-1);
    setReplaying(false);
  }, [run.id]);

  useEffect(() => {
    if (!replaying) return;
    if (reducedMotion) {
      setReplayStep(run.spans.length - 1);
      setReplaying(false);
      return;
    }

    const timer = setInterval(() => {
      setReplayStep((prev) => {
        if (prev >= run.spans.length - 1) {
          setReplaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 550);

    return () => clearInterval(timer);
  }, [replaying, reducedMotion, run.spans.length]);

  const startReplay = () => {
    setReplayStep(0);
    setReplaying(true);
  };

  return (
    <motion.aside
      initial={reducedMotion ? {opacity: 1, x: 0} : {opacity: 0, x: 18}}
      animate={{opacity: 1, x: 0}}
      exit={reducedMotion ? {opacity: 0} : {opacity: 0, x: 18}}
      transition={{duration: reducedMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1]}}
      aria-label={`Trace inspector for ${run.id}`}
      className="rounded-[6px] bg-[#06154D] border border-white/20 p-4 sm:p-5 text-white flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/15">
        <div>
          <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[11px] text-[#D9C4A8]">
            <span>{run.id}</span>
            <span>·</span>
            <span>{run.model}</span>
            <span>·</span>
            <span>{run.timestamp}</span>
          </div>
          <h3 className="mt-1 text-lg sm:text-xl font-medium tracking-[-0.02em] text-white">
            {run.agent}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close trace panel"
          className="w-8 h-8 inline-flex items-center justify-center rounded-[3px] bg-white/10 hover:bg-white/20 text-white cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="h-[180px] sm:h-[225px]">
        <TraceWaterfall active={true} />
      </div>

      <div className="rounded-[4px] bg-white/5 border border-white/10 p-3 sm:p-3.5">
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
          <span className="font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.06em] text-[#D9C4A8]">
            Execution Replay
          </span>
          <button
            type="button"
            onClick={startReplay}
            className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-[2px] bg-[#0B2FA8] hover:bg-[#1940C7] text-white font-mono text-[9px] sm:text-[11px] cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{replaying ? 'Replaying...' : 'Replay'}</span>
          </button>
        </div>

        <div className="flex flex-col gap-1.5 font-mono text-[10px] sm:text-[11.5px] tabular-nums">
          {run.spans.map((sp, idx) => {
            const active = replayStep === idx;
            const passed = replayStep > idx;
            return (
              <div
                key={sp.name + idx}
                className={`flex items-center justify-between px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-[3px] border transition-colors ${
                  active
                    ? 'bg-[#0B2FA8]/80 border-[#D9C4A8] text-white'
                    : passed
                      ? 'bg-emerald-500/10 border-emerald-400/30 text-white/90'
                      : 'bg-white/[0.03] border-white/10 text-white/70'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      sp.status === 'fail'
                        ? 'bg-red-400'
                        : sp.status === 'retry'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                    }`}
                  />
                  <span className="truncate">{sp.name}</span>
                </span>
                <span className="text-white/60 shrink-0 ml-2">
                  {sp.tokens}t · {sp.durationMs}ms
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 text-xs sm:text-[12px]">
        <div className="rounded-[4px] bg-white/[0.04] border border-white/10 p-2.5 sm:p-3">
          <span className="block font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.06em] text-white/50 mb-1">
            Prompt
          </span>
          <p className="text-white/90 leading-relaxed sm:leading-[1.5] line-clamp-3">{run.prompt}</p>
        </div>
        <div className="rounded-[4px] bg-white/[0.04] border border-white/10 p-2.5 sm:p-3">
          <span className="block font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.06em] text-white/50 mb-1">
            Response
          </span>
          <p className="text-[#D9C4A8] leading-relaxed sm:leading-[1.5] line-clamp-3">{run.response}</p>
        </div>
      </div>

      <button
        type="button"
        disabled={isFlagged}
        onClick={() => onFlagBad(run)}
        className={`inline-flex items-center justify-center gap-2 rounded-[2px] py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-[13px] font-medium transition-colors cursor-pointer w-full sm:w-auto ${
          isFlagged
            ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 cursor-default'
            : 'bg-[#D9C4A8] hover:bg-white text-[#0A1F6B]'
        }`}
      >
        {isFlagged ? (
          <>
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Added to Evals dataset</span>
          </>
        ) : (
          <>
            <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Flag as bad (add to Evals)</span>
          </>
        )}
      </button>
    </motion.aside>
  );
};