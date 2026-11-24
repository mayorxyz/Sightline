import React, {useEffect, useState} from 'react';
import {AnimatePresence, motion, PanInfo} from 'framer-motion';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  accent: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: 'We found a hallucination loop in 20 minutes.',
    name: 'Amara O.',
    role: 'Head of AI',
    company: 'Lumen Labs',
    initials: 'AO',
    accent: '#0B2FA8',
  },
  {
    quote: 'Cost per run dropped 31% after one week of traces.',
    name: 'Daniel K.',
    role: 'CTO',
    company: 'Northwind',
    initials: 'DK',
    accent: '#D9731A',
  },
  {
    quote: 'Alerts caught a rate limit spiral before customers did.',
    name: 'Priya S.',
    role: 'Platform Lead',
    company: 'Kestrel',
    initials: 'PS',
    accent: '#2E8B57',
  },
  {
    quote: 'Evals finally gave us a release gate we trust.',
    name: 'Tunde A.',
    role: 'ML Engineer',
    company: 'Halcyon',
    initials: 'TA',
    accent: '#7C3AED',
  },
];

export const TestimonialSlider: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);

  const paginate = (nextDir: 1 | -1) => {
    setDirection(nextDir);
    setIndex((prev) => (prev + nextDir + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const goTo = (nextIdx: number) => {
    setDirection(nextIdx >= index ? 1 : -1);
    setIndex(nextIdx);
  };

  useEffect(() => {
    if (reducedMotion || paused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused, reducedMotion]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -50) {
      paginate(1);
    } else if (info.offset.x > 50) {
      paginate(-1);
    }
  };

  const current = TESTIMONIALS[index];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative"
    >
      <div className="overflow-hidden min-h-[200px] sm:min-h-[240px] flex items-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.name}
            custom={direction}
            drag={reducedMotion ? false : 'x'}
            dragConstraints={{left: 0, right: 0}}
            dragElastic={0.18}
            onDragEnd={handleDragEnd}
            initial={
              reducedMotion ? {opacity: 1, x: 0} : {opacity: 0, x: direction * 20}
            }
            animate={{opacity: 1, x: 0}}
            exit={
              reducedMotion ? {opacity: 0} : {opacity: 0, x: direction * -20}
            }
            transition={{duration: reducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1]}}
            className="w-full cursor-grab active:cursor-grabbing select-none"
          >
            <blockquote className="text-xl sm:text-3xl lg:text-[44px] font-medium tracking-[-0.03em] leading-[1.15] sm:leading-[1.1] text-white max-w-[920px]">
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            <div className="mt-6 sm:mt-8 flex items-center gap-3 sm:gap-3.5">
              <span
                style={{backgroundColor: current.accent}}
                className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-xs sm:text-[13px] font-semibold text-white border border-white/30 shrink-0"
              >
                {current.initials}
              </span>
              <div>
                <div className="text-sm sm:text-[15px] font-medium text-white">{current.name}</div>
                <div className="text-xs sm:text-[13px] text-[#D9C4A8]">
                  {current.role} · {current.company}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/15 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2" role="tablist" aria-label="Testimonials">
          {TESTIMONIALS.map((t, i) => {
            const active = i === index;
            return (
              <button
                key={t.name}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`View quote from ${t.name}`}
                onClick={() => goTo(i)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-200 cursor-pointer ${
                  active ? 'w-6 sm:w-7 bg-[#D9C4A8]' : 'w-1.5 sm:w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => paginate(-1)}
            aria-label="Previous testimonial"
            className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-[2px] bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            aria-label="Next testimonial"
            className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-[2px] bg-[#D9C4A8] hover:bg-white text-[#0A1F6B] transition-colors cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};