import React from 'react';
import {motion} from 'framer-motion';
import {ShieldCheck, EyeOff, KeyRound, Globe} from 'lucide-react';
import {SECURITY_ITEMS} from '../../lib/mockData';
import {useInView} from '../../hooks/useInView';
import {useReducedMotion} from '../../hooks/useReducedMotion';

const ICONS: Record<string, React.ReactNode> = {
  soc2: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.9} />,
  pii: <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.9} />,
  sso: <KeyRound className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.9} />,
  residency: <Globe className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.9} />,
};

export const SecurityStrip: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const {ref, inView} = useInView<HTMLElement>({threshold: 0.2, once: true});

  return (
    <section
      ref={ref}
      className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10"
    >
      <div className="max-w-[1360px] mx-auto">
        <div className="mb-6 sm:mb-8">
          <h2 className="headline-display text-[28px] sm:text-[46px] leading-tight text-[#0B0B0B]">
            Built for <span className="headline-serif-accent">enterprise</span> security
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SECURITY_ITEMS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
              animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
              transition={{
                duration: reducedMotion ? 0 : 0.5,
                delay: reducedMotion ? 0 : idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-white rounded-[6px] border border-[#0B0B0B]/12 p-4 sm:p-5 flex flex-col gap-3"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-[4px] bg-[#0B2FA8] text-white">
                {ICONS[item.id]}
              </span>
              <h3 className="text-[16px] sm:text-[18px] font-medium tracking-[-0.02em] text-[#0B0B0B]">
                {item.title}
              </h3>
              <p className="text-[13px] sm:text-[14px] leading-[1.5] text-[#0B0B0B]/70">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};