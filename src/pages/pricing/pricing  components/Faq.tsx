import React, {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Plus} from 'lucide-react';
import {FaqItem} from '../../../lib/mockData';
import {useReducedMotion} from '../../../hooks/useReducedMotion';

interface FaqProps {
  items: FaqItem[];
  title?: React.ReactNode;
  headerExtra?: React.ReactNode;
}

export const Faq: React.FC<FaqProps> = ({items, title, headerExtra}) => {
  const reducedMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    setOpenIndex(items.length > 0 ? 0 : null);
  }, [items]);

  return (
    <section className="mx-1.5 sm:mx-5 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1360px] mx-auto min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-start">
        <div className="lg:col-span-4 w-full min-w-0">
          {title ?? (
            <h2 className="headline-display text-[24px] leading-[1.12] sm:text-[44px] text-[#0B0B0B]">
              Common <span className="headline-serif-accent">questions</span>
            </h2>
          )}
          {headerExtra && <div className="mt-3 sm:mt-5 min-w-0">{headerExtra}</div>}
        </div>

        <div className="lg:col-span-8 w-full min-w-0 flex flex-col divide-y divide-[#0B0B0B]/15 border-y border-[#0B0B0B]/15">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.question} className="py-2.5 sm:py-4">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-3 sm:gap-4 text-left py-1 sm:py-1.5 cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#0B2FA8] min-w-0"
                >
                  <span className="text-[15px] sm:text-[19px] font-medium tracking-[-0.02em] leading-snug text-[#0B0B0B] group-hover:text-[#0B2FA8] transition-colors min-w-0">
                    {item.question}
                  </span>
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-[2px] border border-[#0B0B0B]/15 transition-transform duration-200 shrink-0 ${
                      isOpen
                        ? 'rotate-45 bg-[#0B2FA8] text-white border-[#0B2FA8]'
                        : 'bg-white text-[#0B0B0B]'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reducedMotion ? {opacity: 1, height: 'auto'} : {opacity: 0, height: 0}}
                      animate={{opacity: 1, height: 'auto'}}
                      exit={reducedMotion ? {opacity: 0} : {opacity: 0, height: 0}}
                      transition={{duration: reducedMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1]}}
                      className="overflow-hidden"
                    >
                      <p className="pt-1.5 sm:pt-2 pb-1 text-[13.5px] sm:text-[15px] leading-[1.52] sm:leading-[1.6] text-[#0B0B0B]/70 max-w-[640px]">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};