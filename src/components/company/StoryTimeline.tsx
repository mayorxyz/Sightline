import React, {useEffect, useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {motion} from 'framer-motion';
import {STORY_MILESTONES} from '../../lib/companyContent';
import {SectionTag} from '../SectionTag';
import {useReducedMotion} from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const StoryTimeline: React.FC = () => {
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
            start: 'top 78%',
            end: 'top 35%',
            scrub: 0.4,
          },
        }
      );
    }, containerRef);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={containerRef}
      className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10"
    >
      <div className="max-w-[1360px] mx-auto">
        <SectionTag label="Our Story" />
        <h2 className="mt-3 sm:mt-4 headline-display text-[28px] sm:text-[48px] leading-tight text-[#0B0B0B] mb-6 sm:mb-10">
          Four years from <span className="headline-serif-accent">outages</span> to scale
        </h2>

        <div className="relative">
          {/* Desktop Scroll-Linked Cobalt Line */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-5 left-0 right-0 h-[1.5px] bg-[#0B0B0B]/12"
          >
            <div
              ref={lineRef}
              style={{transformOrigin: 'left center'}}
              className="w-full h-full bg-[#0B2FA8]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative z-10">
            {STORY_MILESTONES.map((item, idx) => (
              <motion.div
                key={item.year}
                initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.2}}
                transition={{
                  duration: reducedMotion ? 0 : 0.45,
                  delay: reducedMotion ? 0 : idx * 0.08,
                }}
                className="rounded-[6px] sm:rounded-[8px] bg-white border border-[#0B0B0B]/15 p-5 sm:p-6 flex flex-col gap-3"
              >
                <span className="inline-flex items-center justify-center w-12 h-8 sm:w-14 sm:h-9 rounded-[3px] bg-[#0B2FA8] text-white font-mono text-[11px] sm:text-[12px] font-medium tabular-nums">
                  {item.year}
                </span>
                <h3 className="text-[18px] sm:text-[20px] font-medium tracking-[-0.02em] text-[#0B0B0B]">
                  {item.title}
                </h3>
                <p className="text-[13px] sm:text-[14px] leading-[1.55] text-[#0B0B0B]/70">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};