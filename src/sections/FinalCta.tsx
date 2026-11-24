import React from 'react';
import {motion} from 'framer-motion';
import {HeroCanvas} from '../components/HeroCanvas';
import {RevealText} from '../components/RevealText';
import {Button} from '../components/Button';
import {useInView} from '../hooks/useInView';
import {useReducedMotion} from '../hooks/useReducedMotion';

const FinalCta: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const {ref, inView} = useInView<HTMLElement>({threshold: 0.06, once: true});

  return (
    <section ref={ref} className="px-2 sm:px-5 mb-3 sm:mb-6">
      <motion.div
        initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
        animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
        transition={{duration: 0.55, ease: [0.16, 1, 0.3, 1]}}
        className="relative w-full min-h-[250px] sm:min-h-[420px] rounded-[14px] sm:rounded-[24px] overflow-hidden bg-[#0A1F6B] flex items-center justify-center p-4 sm:p-14 text-center"
      >
        {/* Reduced-particle generative canvas background */}
        <div className="absolute inset-0">
          <HeroCanvas density={0.35} />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#0A1F6B]/60 backdrop-blur-[1px]"
          />
        </div>

        <div className="relative z-10 w-full min-w-0 max-w-[820px] mx-auto flex flex-col items-center">
          <RevealText
            as="h2"
            visible={inView}
            delayBase={0.08}
            className="text-[26px] leading-[1.1] sm:text-[58px] lg:text-[72px] text-white"
            lines={[
              <>Ready To See Your Agents</>,
              <>
                <span className="headline-serif-accent text-[#D9C4A8]">Clearly</span>?
              </>,
            ]}
          />

          <motion.div
            initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            transition={{duration: 0.55, delay: reducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1]}}
            className="mt-5 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4"
          >
            <Button label="Request A Demo" variant="sand" to="/demo" />
            <Button label="View Pricing" variant="secondary" to="/pricing" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default FinalCta;