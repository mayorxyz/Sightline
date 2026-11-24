import React, {useEffect, useRef, useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {motion} from 'framer-motion';
import {SectionTag} from '../components/SectionTag';
import {RevealText} from '../components/RevealText';
import {useInView} from '../hooks/useInView';
import {useReducedMotion} from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const CODE_LINE = 'oiq.trace(agent.run)';

const HowItWorks: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const {ref: sectionRef, inView} = useInView<HTMLElement>({threshold: 0.06, once: true});
  const trackWrapperRef = useRef<HTMLDivElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState<number>(reducedMotion ? 1 : 0);
  const [typedChars, setTypedChars] = useState<number>(
    reducedMotion ? CODE_LINE.length : 0
  );
  const [evalScore, setEvalScore] = useState<number>(reducedMotion ? 94 : 82);

  // GSAP ScrollTrigger scrub filling the 2px cobalt connecting line behind cards
  useEffect(() => {
    if (reducedMotion) {
      setScrollProgress(1);
      return;
    }
    if (!trackWrapperRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: trackWrapperRef.current,
        start: 'top 82%',
        end: 'top 30%',
        scrub: 0.4,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, trackWrapperRef);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [reducedMotion]);

  // Step 1 typing code line + Step 3 ring chart ticking 82% -> 94%
  useEffect(() => {
    if (reducedMotion) {
      setTypedChars(CODE_LINE.length);
      setEvalScore(94);
      return;
    }
    if (!inView) return;

    let charIdx = 0;
    const typeTimer = setInterval(() => {
      charIdx += 1;
      setTypedChars(charIdx);
      if (charIdx >= CODE_LINE.length) clearInterval(typeTimer);
    }, 55);

    let score = 82;
    const scoreTimer = setInterval(() => {
      score += 1;
      setEvalScore(score);
      if (score >= 94) clearInterval(scoreTimer);
    }, 85);

    return () => {
      clearInterval(typeTimer);
      clearInterval(scoreTimer);
    };
  }, [inView, reducedMotion]);

  const stepActive = [
    reducedMotion || scrollProgress >= 0.05 || inView,
    reducedMotion || scrollProgress >= 0.45,
    reducedMotion || scrollProgress >= 0.85,
  ];

  const ringR = 18;
  const ringC = 2 * Math.PI * ringR;
  const ringOffset = ringC * (1 - evalScore / 100);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="mx-1.5 sm:mx-5 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10"
    >
      <div className="w-full max-w-[1360px] mx-auto min-w-0">
        <motion.div
          initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
          animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
          transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
        >
          <SectionTag label="How It Works" />
        </motion.div>

        <RevealText
          as="h2"
          visible={inView}
          delayBase={0.1}
          className="mt-3 sm:mt-6 text-[26px] leading-[1.12] sm:text-[58px] lg:text-[72px] text-[#0B0B0B] max-w-[920px]"
          lines={[
            <>
              From Install To <span className="headline-serif-accent">Insight</span>
            </>,
            <>In Minutes</>,
          ]}
        />

        {/* 3 Sand Step Cards + 2px Cobalt Connecting Line */}
        <div ref={trackWrapperRef} className="relative mt-6 sm:mt-12">
          {/* Connecting Line Behind Cards (Desktop Horizontal) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-11 left-[10%] right-[10%] h-[2px] bg-[#0B0B0B]/15 z-0"
          >
            <div
              style={{
                transform: `scaleX(${scrollProgress})`,
                transformOrigin: 'left center',
              }}
              className="h-full w-full bg-[#0B2FA8] will-change-transform"
            />
          </div>

          {/* Connecting Line Behind Cards (Mobile Vertical) */}
          <div
            aria-hidden="true"
            className="md:hidden absolute left-[27px] top-6 bottom-6 w-[2px] bg-[#0B0B0B]/15 z-0"
          >
            <div
              style={{
                transform: `scaleY(${scrollProgress})`,
                transformOrigin: 'top center',
              }}
              className="h-full w-full bg-[#0B2FA8] will-change-transform"
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 items-stretch gap-3 sm:gap-6">
            {/* Step 01: Instrument */}
            <motion.div
              initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
              animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
              transition={{duration: 0.55, delay: reducedMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1]}}
              className="w-full min-w-0 bg-[#D9C4A8] rounded-[6px] sm:rounded-[8px] p-3.5 sm:p-6 flex flex-col justify-between gap-3.5 sm:gap-6"
            >
              <div>
                <div className="flex items-center gap-2.5 sm:block">
                  <span
                    className={`shrink-0 inline-flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-full font-mono text-[11px] sm:text-[13px] font-semibold tabular-nums transition-colors duration-300 ${
                      stepActive[0]
                        ? 'bg-[#0B2FA8] text-white'
                        : 'bg-white text-[#0B0B0B] border border-[#0B0B0B]/20'
                    }`}
                  >
                    01
                  </span>
                  <h3 className="sm:mt-5 text-[18px] sm:text-[24px] font-medium tracking-[-0.03em] text-[#0B0B0B] leading-tight">
                    01 Instrument
                  </h3>
                </div>
                <p className="mt-2 text-[13px] sm:text-[15px] leading-[1.48] sm:leading-[1.5] text-[#0B0B0B]/75">
                  Add the SDK, wrap your agent run, and ship telemetry with zero latency overhead.
                </p>
              </div>

              {/* Mini Mock: Typing Code Line */}
              <div className="rounded-[5px] sm:rounded-[6px] bg-[#0A1F6B] text-white px-3 sm:px-4 py-2.5 sm:py-3.5 font-mono text-[11px] sm:text-[12.5px] flex items-center gap-1.5 sm:gap-2 overflow-hidden">
                <span className="text-[#D9C4A8] shrink-0">$</span>
                <span className="truncate">{CODE_LINE.slice(0, typedChars)}</span>
                {!reducedMotion && typedChars < CODE_LINE.length && (
                  <span className="shrink-0 w-1.5 h-3.5 sm:h-4 bg-[#D9C4A8] animate-pulse" />
                )}
              </div>
            </motion.div>

            {/* Step 02: Observe */}
            <motion.div
              initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
              animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
              transition={{duration: 0.55, delay: reducedMotion ? 0 : 0.16, ease: [0.16, 1, 0.3, 1]}}
              className="w-full min-w-0 bg-[#D9C4A8] rounded-[6px] sm:rounded-[8px] p-3.5 sm:p-6 flex flex-col justify-between gap-3.5 sm:gap-6"
            >
              <div>
                <div className="flex items-center gap-2.5 sm:block">
                  <span
                    className={`shrink-0 inline-flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-full font-mono text-[11px] sm:text-[13px] font-semibold tabular-nums transition-colors duration-300 ${
                      stepActive[1]
                        ? 'bg-[#0B2FA8] text-white'
                        : 'bg-white text-[#0B0B0B] border border-[#0B0B0B]/20'
                    }`}
                  >
                    02
                  </span>
                  <h3 className="sm:mt-5 text-[18px] sm:text-[24px] font-medium tracking-[-0.03em] text-[#0B0B0B] leading-tight">
                    02 Observe
                  </h3>
                </div>
                <p className="mt-2 text-[13px] sm:text-[15px] leading-[1.48] sm:leading-[1.5] text-[#0B0B0B]/75">
                  Traces, cost, and latency stream in live across every model and tool boundary.
                </p>
              </div>

              {/* Mini Mock: Pulsing Trace Graph */}
              <div className="rounded-[5px] sm:rounded-[6px] bg-white px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-2 border border-[#0B0B0B]/10">
                {['Input', 'Tool', 'LLM'].map((label, idx) => (
                  <React.Fragment key={label}>
                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                      <span
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#0B2FA8] ${
                          reducedMotion ? '' : 'animate-pulse'
                        }`}
                      />
                      <span className="font-mono text-[10px] sm:text-[11px] font-medium text-[#0B0B0B]">
                        {label}
                      </span>
                    </div>
                    {idx < 2 && <span className="flex-1 min-w-[12px] h-[1.5px] bg-[#0B2FA8]/30" />}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>

            {/* Step 03: Improve */}
            <motion.div
              initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
              animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
              transition={{duration: 0.55, delay: reducedMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1]}}
              className="w-full min-w-0 bg-[#D9C4A8] rounded-[6px] sm:rounded-[8px] p-3.5 sm:p-6 flex flex-col justify-between gap-3.5 sm:gap-6"
            >
              <div>
                <div className="flex items-center gap-2.5 sm:block">
                  <span
                    className={`shrink-0 inline-flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-full font-mono text-[11px] sm:text-[13px] font-semibold tabular-nums transition-colors duration-300 ${
                      stepActive[2]
                        ? 'bg-[#0B2FA8] text-white'
                        : 'bg-white text-[#0B0B0B] border border-[#0B0B0B]/20'
                    }`}
                  >
                    03
                  </span>
                  <h3 className="sm:mt-5 text-[18px] sm:text-[24px] font-medium tracking-[-0.03em] text-[#0B0B0B] leading-tight">
                    03 Improve
                  </h3>
                </div>
                <p className="mt-2 text-[13px] sm:text-[15px] leading-[1.48] sm:leading-[1.5] text-[#0B0B0B]/75">
                  Evals and alerts catch regressions before users do, raising production quality.
                </p>
              </div>

              {/* Mini Mock: Ring Chart ticking 82% -> 94% */}
              <div className="rounded-[5px] sm:rounded-[6px] bg-white px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 border border-[#0B0B0B]/10">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <svg
                    viewBox="0 0 44 44"
                    className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 -rotate-90"
                    aria-hidden="true"
                  >
                    <circle
                      cx="22"
                      cy="22"
                      r={ringR}
                      fill="none"
                      stroke="rgba(11,11,11,0.12)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="22"
                      cy="22"
                      r={ringR}
                      fill="none"
                      stroke="#0B2FA8"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={ringC}
                      strokeDashoffset={ringOffset}
                      className="transition-[stroke-dashoffset] duration-150"
                    />
                  </svg>
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] sm:text-[11px] text-[#0B0B0B]/55 truncate">
                      eval pass rate
                    </div>
                    <div className="font-mono text-[14px] sm:text-[16px] font-semibold tabular-nums text-[#0B0B0B] leading-tight">
                      {evalScore}%
                    </div>
                  </div>
                </div>
                <span className="font-mono text-[10.5px] sm:text-[11px] text-[#15803D] font-medium shrink-0">
                  +12%
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;