import React, {useEffect, useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {DEMO_EXPECT_STEPS} from '../../lib/mockData';
import {useReducedMotion} from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const Steps: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion || !containerRef.current || !lineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        {scaleX: 0},
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'top 35%',
            scrub: 0.4,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={containerRef}
      className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10"
    >
      <div className="max-w-[1360px] mx-auto">
        <h2 className="headline-display text-[28px] sm:text-[44px] leading-[1.02] text-[#0B0B0B] mb-5 sm:mb-10">
          What to <span className="headline-serif-accent">expect</span>
        </h2>

        <div className="relative">
          {/* Scroll-linked Connecting Line (Desktop) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-5 left-0 right-0 h-[1.5px] bg-[#0B0B0B]/12"
          >
            <div
              ref={lineRef}
              style={{transformOrigin: 'left center'}}
              className="h-full w-full bg-[#0B2FA8]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 relative z-10">
            {DEMO_EXPECT_STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-[6px] border border-[#0B0B0B]/12 p-4 sm:p-6 flex flex-col gap-2.5 sm:gap-3"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-[4px] bg-[#0B2FA8] text-white font-mono text-[13px] font-medium tabular-nums">
                  {item.step}
                </span>
                <h3 className="text-[20px] font-medium tracking-[-0.02em] text-[#0B0B0B]">
                  {item.title}
                </h3>
                <p className="text-[14px] leading-[1.55] text-[#0B0B0B]/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
