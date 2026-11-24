import React from 'react';
import {motion} from 'framer-motion';
import {RevealText} from '../components/RevealText';
import {Button} from '../components/Button';
import {useReducedMotion} from '../hooks/useReducedMotion';

export const HeadlineSection: React.FC = () => {
  const reducedMotion = useReducedMotion();

  const scrollToWhy = () => {
    const target = document.getElementById('why-Sightline');
    if (target) {
      target.scrollIntoView({behavior: reducedMotion ? 'auto' : 'smooth'});
    }
  };

  return (
    <section className="px-3 sm:px-6 py-7 sm:py-16">
      <div className="w-full max-w-[1360px] mx-auto min-w-0">
        <RevealText
          as="h1"
          delayBase={0.12}
          className="text-[30px] leading-[1.08] sm:text-[64px] lg:text-[78px] text-[#0B0B0B] max-w-[900px]"
          lines={[
            <>
              The <span className="headline-serif-accent">observability</span> layer
            </>,
            <>for modern AI agents.</>,
          ]}
        />

        <div className="mt-5 sm:mt-10 flex flex-wrap items-center gap-2 sm:gap-4">
          <motion.div
            initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{
              duration: reducedMotion ? 0 : 0.55,
              delay: reducedMotion ? 0 : 0.34,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="shrink-0"
          >
            <Button label="Request A Demo" variant="primary" to="/demo" />
          </motion.div>

          <motion.div
            initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{
              duration: reducedMotion ? 0 : 0.55,
              delay: reducedMotion ? 0 : 0.42,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="shrink-0"
          >
            <Button
              label="Watch It In Action"
              variant="secondary"
              onClick={scrollToWhy}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};