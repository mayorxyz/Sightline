import React from 'react';
import {motion} from 'framer-motion';
import {HeroCanvas} from './HeroCanvas';
import {SectionTag} from './SectionTag';
import {RevealText} from './RevealText';
import {useReducedMotion} from '../hooks/useReducedMotion';

interface PageHeaderProps {
  tag: string;
  lines: React.ReactNode[];
  subtitle: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({tag, lines, subtitle}) => {
  const reducedMotion = useReducedMotion();

  return (
    <section className="p-3 sm:p-4 pb-0">
      <div className="relative w-full min-h-[240px] rounded-[24px] overflow-hidden bg-[#0A1F6B]">
        {/* Compact 240px+ HeroCanvas strip at 30% particle density */}
        <div className="absolute inset-0">
          <HeroCanvas density={0.3} />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#E9E8E6]/95 via-[#E9E8E6]/88 to-[#D9C4A8]/65 backdrop-blur-[1px]"
          />
        </div>

        {/* Header Copy */}
        <div className="relative z-10 max-w-[1360px] mx-auto pt-24 pb-10 px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.45, ease: [0.16, 1, 0.3, 1]}}
          >
            <SectionTag label={tag} />
          </motion.div>

          <RevealText
            as="h1"
            delayBase={0.08}
            className="mt-5 text-[42px] sm:text-[58px] lg:text-[72px] text-[#0B0B0B] max-w-[920px]"
            lines={lines}
          />

          <motion.p
            initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 14}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.55, delay: reducedMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1]}}
            className="mt-4 text-[16px] sm:text-[17px] leading-[1.6] text-[#0B0B0B]/70 max-w-[560px]"
          >
            {subtitle}
          </motion.p>
        </div>
      </div>
    </section>
  );
};
