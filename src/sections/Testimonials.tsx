import React from 'react';
import {motion} from 'framer-motion';
import {SectionTag} from '../components/SectionTag';
import {RevealText} from '../components/RevealText';
import {TestimonialSlider} from '../components/testimonials/TestimonialSlider';
import {StatChip} from '../components/StatChip';
import {useInView} from '../hooks/useInView';
import {useReducedMotion} from '../hooks/useReducedMotion';

const Testimonials: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const {ref, inView} = useInView<HTMLElement>({threshold: 0.06, once: true});

  return (
    <section
      ref={ref}
      id="customers"
      className="mx-1.5 sm:mx-5 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10"
    >
      <div className="w-full max-w-[1360px] mx-auto min-w-0">
        <motion.div
          initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
          animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
          transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
        >
          <SectionTag label="Customers" />
        </motion.div>

        <RevealText
          as="h2"
          visible={inView}
          delayBase={0.1}
          className="mt-3 sm:mt-6 text-[26px] leading-[1.12] sm:text-[58px] lg:text-[72px] text-[#0B0B0B] max-w-[920px]"
          lines={[
            <>Teams That See Clearly</>,
            <>
              <span className="headline-serif-accent">Ship Faster</span>
            </>,
          ]}
        />

        {/* Navy Testimonial Slider Panel */}
        <motion.div
          initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
          animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
          transition={{duration: 0.55, delay: reducedMotion ? 0 : 0.16, ease: [0.16, 1, 0.3, 1]}}
          className="mt-5 sm:mt-10 w-full overflow-hidden rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] p-3.5 sm:p-10 lg:p-14 shadow-[0_14px_34px_rgba(10,31,107,0.18)] sm:shadow-[0_20px_50px_rgba(10,31,107,0.18)]"
        >
          <div className="w-full min-w-0">
            <TestimonialSlider />
          </div>

          {/* 3 Stat Chips Below */}
          <div className="mt-5 sm:mt-8 flex flex-wrap items-stretch gap-2 sm:gap-3">
            <StatChip
              target={2.3}
              decimals={1}
              suffix="M"
              label="traces/day"
              active={inView}
              delayMs={120}
            />
            <StatChip
              target={31}
              decimals={0}
              suffix="%"
              label="avg cost reduction"
              active={inView}
              delayMs={200}
            />
            <StatChip
              target={4}
              decimals={0}
              suffix="x"
              label="faster debugging"
              active={inView}
              delayMs={280}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;