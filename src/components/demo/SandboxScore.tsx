import React, {useEffect, useRef, useState} from 'react';
import {Check, ChevronDown, Sparkles} from 'lucide-react';
import {AnimatePresence, motion} from 'framer-motion';
import {SANDBOX_SCORE_LABELS, SandboxActionId} from '../../lib/demoContent';
import {Button} from '../Button';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface SandboxScoreChipProps {
  completed: SandboxActionId[];
}

export const SandboxScoreChip: React.FC<SandboxScoreChipProps> = ({completed}) => {
  const [open, setOpen] = useState(false);
  const count = completed.length;
  const ref = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [ref]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-[3px] font-mono text-[10px] sm:text-[11px] tabular-nums border transition-colors cursor-pointer ${
          count === 6
            ? 'bg-[#D9C4A8] text-[#0A1F6B] border-[#D9C4A8] font-semibold'
            : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
        }`}
      >
        <span>Sandbox score {count}/6</span>
        <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          ref={wrapperRef}
          className="fixed right-2 top-[68px] w-[220px] max-w-[calc(100vw-16px)] rounded-[6px] bg-[#06154D] border border-white/25 p-3 shadow-2xl z-50 sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-[250px]"
        >
          <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.08em] text-[#D9C4A8] mb-2">
            Exploration checklist
          </div>
          <ul className="flex flex-col gap-1.5">
            {SANDBOX_SCORE_LABELS.map((item) => {
              const done = completed.includes(item.id);
              return (
                <li
                  key={item.id}
                  className={`flex items-center gap-2 text-[11px] sm:text-[12px] ${
                    done ? 'text-white' : 'text-white/55'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[2px] inline-flex items-center justify-center shrink-0 ${
                      done ? 'bg-[#D9C4A8] text-[#0A1F6B]' : 'bg-white/10 text-transparent'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2.5} />
                  </span>
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

interface SandboxScoreBannerProps {
  completedCount: number;
}

export const SandboxScoreBanner: React.FC<SandboxScoreBannerProps> = ({completedCount}) => {
  const reducedMotion = useReducedMotion();
  if (completedCount < 6) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 16}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: reducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1]}}
        className="mt-6 rounded-[8px] bg-[#D9C4A8] text-[#0B0B0B] border border-white/20 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-[3px] bg-[#0B2FA8] text-white shrink-0">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </span>
          <div>
            <h3 className="text-lg sm:text-xl lg:text-[22px] font-medium tracking-[-0.02em] leading-[1.15]">
              You explored 6/6. Ready to try it on real data?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#0B0B0B]/75">
              Connect your Python or TypeScript SDK in 5 minutes or pair live with an engineer.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
          <Button label="Book a Demo" variant="primary" to="/demo" />
          <Button label="Start Free" variant="secondary" to="/pricing" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};