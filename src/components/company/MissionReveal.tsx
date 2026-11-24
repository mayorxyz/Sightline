import React from 'react';
import {motion} from 'framer-motion';
import {ABOUT_MISSION} from '../../lib/companyContent';
import {useInView} from '../../hooks/useInView';
import {useReducedMotion} from '../../hooks/useReducedMotion';

export const MissionReveal: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const {ref, inView} = useInView<HTMLElement>({threshold: 0.06, once: true});
  const words = ABOUT_MISSION.split(' ');

  return (
    <section
      ref={ref}
      className="mx-1.5 sm:mx-5 mt-3 sm:mt-6 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10"
    >
      <div className="w-full max-w-[1360px] mx-auto min-w-0 rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] text-white p-4 sm:p-12 lg:p-16">
        <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#D9C4A8] mb-2.5 sm:mb-5">
          Our Mission
        </span>
        <p className="min-w-0 break-words text-[20px] sm:text-[40px] lg:text-[48px] font-medium tracking-[-0.03em] leading-[1.2] sm:leading-[1.15] max-w-[1040px]">
          {words.map((word, idx) => (
            <motion.span
              key={`${word}-${idx}`}
              initial={reducedMotion ? {opacity: 1} : {opacity: 0.16}}
              animate={inView || reducedMotion ? {opacity: 1} : {opacity: 0.16}}
              transition={{
                duration: reducedMotion ? 0 : 0.35,
                delay: reducedMotion ? 0 : idx * 0.03,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block max-w-full mr-[0.26em]"
            >
              {word}
            </motion.span>
          ))}
        </p>
      </div>
    </section>
  );
};