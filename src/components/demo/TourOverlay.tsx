import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {ArrowLeft, ArrowRight, X} from 'lucide-react';
import {TOUR_STEPS, TourStep} from '../../lib/demoContent';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface TourOverlayProps {
  open: boolean;
  stepIndex: number;
  onStepIndexChange: (nextIndex: number) => void;
  onClose: (markCompleted?: boolean) => void;
  onEnsureTab: (tab: NonNullable<TourStep['tab']>) => void;
}

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const TourOverlay: React.FC<TourOverlayProps> = ({
  open,
  stepIndex,
  onStepIndexChange,
  onClose,
  onEnsureTab,
}) => {
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [rect, setRect] = useState<SpotlightRect | null>(null);

  const currentStep = TOUR_STEPS[stepIndex] ?? TOUR_STEPS[0];

  const measureTarget = useCallback(() => {
    if (!open || !currentStep) return;
    const el = document.querySelector<HTMLElement>(`[data-tour="${currentStep.targetId}"]`);
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect({
      top: Math.max(8, r.top - 6),
      left: Math.max(8, r.left - 6),
      width: Math.min(window.innerWidth - 16, r.width + 12),
      height: Math.min(window.innerHeight - 16, r.height + 12),
    });
  }, [open, currentStep]);

  useEffect(() => {
    if (!open) return;
    if (currentStep?.tab) {
      onEnsureTab(currentStep.tab);
    }
    const t = setTimeout(measureTarget, 180);
    return () => clearTimeout(t);
  }, [open, currentStep, onEnsureTab, measureTarget]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener('resize', measureTarget);
    window.addEventListener('scroll', measureTarget, true);
    return () => {
      window.removeEventListener('resize', measureTarget);
      window.removeEventListener('scroll', measureTarget, true);
    };
  }, [open, measureTarget]);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const focusTimer = setTimeout(() => {
      const firstBtn = dialogRef.current?.querySelector<HTMLElement>('button');
      firstBtn?.focus();
    }, 30);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose(false);
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const isLast = stepIndex >= TOUR_STEPS.length - 1;
  const counterLabel = `${String(stepIndex + 1).padStart(2, '0')} / ${String(
    TOUR_STEPS.length
  ).padStart(2, '0')}`;

  const desktopTop = rect
    ? rect.top + rect.height + 180 < window.innerHeight
      ? rect.top + rect.height + 14
      : Math.max(24, rect.top - 190)
    : 120;
  const desktopLeft = rect
    ? Math.min(Math.max(20, rect.left), window.innerWidth - 360)
    : Math.max(20, window.innerWidth / 2 - 170);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-auto" role="presentation">
        {rect ? (
          <div
            aria-hidden="true"
            onClick={() => onClose(false)}
            style={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              boxShadow: '0 0 0 9999px rgba(6, 13, 44, 0.76)',
            }}
            className="fixed rounded-[8px] border-2 border-[#D9C4A8] pointer-events-auto transition-all duration-200"
          />
        ) : (
          <div
            aria-hidden="true"
            onClick={() => onClose(false)}
            className="fixed inset-0 bg-[#060D2C]/75"
          />
        )}

        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-step-title"
          initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          exit={reducedMotion ? {opacity: 0} : {opacity: 0, y: 8}}
          transition={{duration: reducedMotion ? 0 : 0.2}}
          style={
            typeof window !== 'undefined' && window.innerWidth >= 768
              ? {top: desktopTop, left: desktopLeft}
              : undefined
          }
          className="fixed bottom-12 sm:bottom-16 inset-x-3 md:inset-x-auto md:bottom-auto md:w-[340px] z-50 rounded-[8px] bg-white text-[#0B0B0B] border border-[#0B0B0B]/15 p-4 sm:p-5 shadow-2xl"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-[2px] bg-[#0B2FA8] text-white font-mono text-[9px] sm:text-[10.5px] tabular-nums">
              {counterLabel}
            </span>
            <button
              type="button"
              onClick={() => onClose(false)}
              aria-label="Close guided tour"
              className="w-7 h-7 inline-flex items-center justify-center rounded-[2px] text-[#0B0B0B]/60 hover:bg-[#0B0B0B]/8 hover:text-[#0B0B0B] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3
            id="tour-step-title"
            className="text-base sm:text-lg font-medium tracking-[-0.02em] text-[#0B0B0B]"
          >
            {currentStep.title}
          </h3>
          <p className="mt-1 sm:mt-1.5 text-xs sm:text-[13.5px] leading-relaxed sm:leading-[1.55] text-[#0B0B0B]/70">
            {currentStep.body}
          </p>

          <div className="mt-3 sm:mt-4 pt-3 border-t border-[#0B0B0B]/10 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.06em] text-[#0B0B0B]/55 hover:text-[#0B0B0B] cursor-pointer"
            >
              Skip tour
            </button>

            <div className="flex items-center gap-1.5">
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={() => onStepIndexChange(stepIndex - 1)}
                  className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-[2px] border border-[#0B0B0B]/20 text-[11px] sm:text-[12px] font-medium hover:bg-[#0B0B0B]/5 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Back</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (isLast) {
                    onClose(true);
                  } else {
                    onStepIndexChange(stepIndex + 1);
                  }
                }}
                className="inline-flex items-center gap-1 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-[2px] bg-[#0B2FA8] hover:bg-[#0A1F6B] text-white text-[11px] sm:text-[12px] font-medium cursor-pointer"
              >
                <span>{isLast ? 'Done' : 'Next'}</span>
                {!isLast && <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};