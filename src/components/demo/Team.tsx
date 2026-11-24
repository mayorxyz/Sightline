import React from 'react';
import {motion} from 'framer-motion';
import {DEMO_TEAM} from '../../lib/demoContent';
import {SectionTag} from '../SectionTag';
import {useReducedMotion} from '../../hooks/useReducedMotion';

export const Team: React.FC = () => {
  const reducedMotion = useReducedMotion();

  return (
    <section className="mx-3 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1360px] mx-auto">
        <SectionTag label="Your Hosts" />
        <h2 className="mt-4 headline-display text-3xl sm:text-4xl lg:text-[48px] text-[#0B0B0B] mb-8 sm:mb-10">
          Who you&rsquo;ll <span className="headline-serif-accent">meet</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {DEMO_TEAM.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 24}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, amount: 0.2}}
              transition={{
                duration: reducedMotion ? 0 : 0.55,
                delay: reducedMotion ? 0 : idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rounded-[8px] bg-white border border-[#0B0B0B]/12 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4"
            >
              <div className="flex items-center gap-3 sm:gap-3.5">
                <span
                  className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-[4px] font-mono text-sm sm:text-[15px] font-semibold tracking-tight shrink-0 ${member.accent}`}
                >
                  {member.initials}
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-medium tracking-[-0.02em] text-[#0B0B0B]">
                    {member.name}
                  </h3>
                  <span className="font-mono text-xs sm:text-[12px] text-[#0B2FA8]">{member.role}</span>
                </div>
              </div>
              <p className="text-sm sm:text-[14px] leading-relaxed text-[#0B0B0B]/70">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
