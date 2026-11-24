import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {ArrowUpRight} from 'lucide-react';
import {PageHeader} from '../components/PageHeader';
import {ArchitectureDiagram} from '../components/product/ArchitectureDiagram';
import {AudienceTabs} from '../components/product/AudienceTabs';
import {BeforeAfterSlider} from '../components/product/BeforeAfterSlider';
import {IntegrationGrid} from '../components/product/IntegrationGrid';
import {SecurityStrip} from '../components/product/SecurityStrip';
import {ProductIcon} from '../components/product/NavDropdown';
import {Button} from '../components/Button';
import {Footer} from '../components/Footer';
import {PRODUCT_NAV_ITEMS} from '../lib/productContent';
import {useInView} from '../hooks/useInView';
import {useReducedMotion} from '../hooks/useReducedMotion';

export const Product: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const {ref: cardsRef, inView: cardsInView} = useInView<HTMLElement>({
    threshold: 0.14,
    once: true,
  });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [tilt, setTilt] = useState({rx: 0, ry: 0});

  return (
    <main className="pb-4">
      <PageHeader
        tag="Product"
        lines={[
          <>Everything Your Agents</>,
          <>
            <span className="headline-serif-accent">Leave Behind</span>
          </>,
        ]}
        subtitle="Traces, evals, cost, and alerts in one place."
      />

      {/* The platform in one picture */}
      <ArchitectureDiagram />

      {/* 6 Feature Cards linking to Sub-pages */}
      <section
        ref={cardsRef}
        className="mx-3 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10"
      >
        <div className="max-w-[1360px] mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-2 mb-5 sm:mb-8">
            <h2 className="headline-display text-[30px] sm:text-[44px] leading-[1.02] text-[#0B0B0B]">
              Six modules, <span className="headline-serif-accent">one</span> trace store
            </h2>
            <span className="font-mono text-[11px] sm:text-[12px] text-[#0B0B0B]/60">
              
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {PRODUCT_NAV_ITEMS.map((item, idx) => {
              const isHovered = hoveredIdx === idx;
              return (
                <motion.div
                  key={item.id}
                  initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                  animate={cardsInView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                  transition={{duration: 0.5, delay: idx * 0.06}}
                >
                  <Link
                    to={item.to}
                    onMouseMove={(e) => {
                      if (reducedMotion || window.innerWidth < 768) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const nx = (e.clientX - rect.left) / rect.width - 0.5;
                      const ny = (e.clientY - rect.top) / rect.height - 0.5;
                      setHoveredIdx(idx);
                      setTilt({
                        rx: Number((-ny * 6).toFixed(2)),
                        ry: Number((nx * 6).toFixed(2)),
                      });
                    }}
                    onMouseLeave={() => {
                      setHoveredIdx(null);
                      setTilt({rx: 0, ry: 0});
                    }}
                    style={{
                      transform:
                        isHovered && !reducedMotion
                          ? `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
                          : undefined,
                      transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className="group h-full bg-white rounded-[8px] border border-[#0B0B0B]/12 hover:border-[#0B2FA8] p-4 sm:p-6 flex flex-col justify-between gap-4 sm:gap-6 transition-colors will-change-transform"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-[4px] bg-[#0B2FA8] text-white">
                          <ProductIcon id={item.id} className="w-5 h-5" />
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-[#0B0B0B]/40 group-hover:text-[#0B2FA8] group-hover:rotate-45 transition-all" />
                      </div>
                      <h3 className="mt-3 sm:mt-5 text-[20px] sm:text-[22px] font-medium tracking-[-0.02em] text-[#0B0B0B]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[14px] leading-[1.55] text-[#0B0B0B]/70">
                        {item.description}
                      </p>
                    </div>

                    <span className="font-mono text-[12px] text-[#0B2FA8] font-medium">
                      Explore {item.title} →
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <AudienceTabs />

      {/* Before & After split slider */}
      <BeforeAfterSlider />

      {/* Integrations preview & Security strip */}
      <IntegrationGrid />
      <SecurityStrip />

      {/* Final CTA Band */}
      <section className="mx-3 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-14 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto rounded-[8px] bg-[#D9C4A8] p-8 sm:p-12 flex flex-wrap items-center justify-between gap-6">
          <h2 className="headline-display text-[34px] sm:text-[46px] text-[#0B0B0B] max-w-[620px]">
            Ready to see your agents <span className="headline-serif-accent">clearly</span>?
          </h2>
          <Button label="Request A Demo" variant="primary" to="/demo" />
        </div>
      </section>

      <Footer />
    </main>
  );
};
