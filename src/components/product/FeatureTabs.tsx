import React, {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Check} from 'lucide-react';
import {PRODUCT_TABS, ProductTabItem} from '../../lib/mockData';
import {TraceWaterfall} from '../features/TraceWaterfall';
import {EvalTable} from '../features/EvalTable';
import {CostChart} from '../features/CostChart';
import {AlertFeed} from '../features/AlertFeed';
import {useInView} from '../../hooks/useInView';
import {useReducedMotion} from '../../hooks/useReducedMotion';

export const FeatureTabs: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const {ref, inView} = useInView<HTMLElement>({threshold: 0.15, once: true});
  const [activeId, setActiveId] = useState<ProductTabItem['id']>('tracing');

  const activeTab = PRODUCT_TABS.find((t) => t.id === activeId) ?? PRODUCT_TABS[0];

  const renderPanel = (id: ProductTabItem['id']) => {
    switch (id) {
      case 'tracing':
        return (
          <div className="bg-[#D9C4A8] rounded-[6px] p-3 sm:p-5 min-h-[280px] sm:min-h-[320px]">
            <TraceWaterfall active={inView} />
          </div>
        );
      case 'evals':
        return (
          <div className="bg-[#0A1F6B] rounded-[6px] p-3 sm:p-5 min-h-[280px] sm:min-h-[320px]">
            <EvalTable active={inView} />
          </div>
        );
      case 'cost':
        return (
          <div className="bg-[#0B2FA8] rounded-[6px] p-3 sm:p-5 min-h-[280px] sm:min-h-[320px]">
            <CostChart active={inView} />
          </div>
        );
      case 'alerts':
        return (
          <div className="bg-white rounded-[6px] border border-[#0B0B0B]/12 p-3 sm:p-5 min-h-[280px] sm:min-h-[320px]">
            <AlertFeed active={inView} />
          </div>
        );
    }
  };

  return (
    <section
      ref={ref}
      className="mx-2 sm:mx-5 mt-6 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10"
    >
      <motion.div
        initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 24}}
        animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 24}}
        transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
        className="max-w-[1360px] mx-auto"
      >
        {/* Sliding Tab Bar */}
        <div
          role="tablist"
          aria-label="Product capabilities"
          className="inline-flex flex-wrap items-center gap-1 p-1 rounded-[4px] bg-white/75 border border-[#0B0B0B]/12 mb-6 sm:mb-10"
        >
          {PRODUCT_TABS.map((tab) => {
            const isActive = tab.id === activeId;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(tab.id)}
                className={`relative px-3 sm:px-4 py-1.5 sm:py-2 text-[12px] sm:text-[14px] font-medium rounded-[2px] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive ? 'text-white' : 'text-[#0B0B0B]/70 hover:text-[#0B0B0B]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="product-feature-tab"
                    transition={
                      reducedMotion
                        ? {duration: 0}
                        : {type: 'spring', stiffness: 420, damping: 32}
                    }
                    className="absolute inset-0 bg-[#0B2FA8] rounded-[2px]"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Crossfading 2-Column Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.id}
            initial={reducedMotion ? {opacity: 1} : {opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={reducedMotion ? {opacity: 1} : {opacity: 0, y: -8}}
            transition={{duration: reducedMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1]}}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start"
          >
            {/* Left Copy */}
            <div className="lg:col-span-5">
              <h2 className="headline-display text-[26px] sm:text-[40px] leading-tight text-[#0B0B0B]">
                {activeTab.heading}
              </h2>
              <p className="mt-3 text-[14px] sm:text-[16px] leading-[1.6] text-[#0B0B0B]/75">
                {activeTab.description}
              </p>

              <ul className="mt-5 flex flex-col gap-2.5">
                {activeTab.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5 text-[13px] sm:text-[15px] text-[#0B0B0B]">
                    <span className="mt-0.5 inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-[2px] bg-[#0B2FA8] text-white shrink-0">
                      <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" strokeWidth={2.4} />
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Mock UI Panel */}
            <div className="lg:col-span-7">{renderPanel(activeTab.id)}</div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
};