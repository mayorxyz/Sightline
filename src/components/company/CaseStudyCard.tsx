import React from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {ArrowUpRight} from 'lucide-react';
import {CaseStudy} from '../../lib/companyContent';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface CaseStudyCardProps {
  study: CaseStudy;
  index: number;
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({study, index}) => {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      layout={!reducedMotion}
      initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 14}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, amount: 0.1}}
      transition={{
        duration: reducedMotion ? 0 : 0.4,
        delay: reducedMotion ? 0 : index * 0.05,
      }}
      className="h-full w-full min-w-0"
    >
      <Link
        to={`/customers/${study.slug}`}
        className="group h-full w-full min-w-0 rounded-[6px] sm:rounded-[8px] bg-white border border-[#0B0B0B]/15 hover:border-[#0B2FA8] p-3.5 sm:p-6 flex flex-col justify-between gap-3.5 sm:gap-6 transition-colors"
      >
        <div className="min-w-0">
          <div className="flex items-start sm:items-center justify-between gap-2 mb-2.5 sm:mb-4 min-w-0">
            <span className="text-[15px] sm:text-[18px] font-semibold tracking-[-0.03em] leading-snug text-[#0B0B0B] truncate">
              {study.company}
            </span>
            <span className="shrink-0 px-1.5 sm:px-2 py-0.5 rounded-[2px] bg-[#D9C4A8]/55 text-[#0A1F6B] font-mono text-[9.5px] sm:text-[10.5px] uppercase whitespace-nowrap">
              {study.industry}
            </span>
          </div>

          <div className="font-mono text-[18px] sm:text-[22px] font-medium text-[#0B2FA8] tracking-[-0.02em] leading-tight mb-1.5 sm:mb-2 tabular-nums">
            {study.headlineMetric}
          </div>

          <p className="text-[12.5px] sm:text-[14px] leading-[1.48] sm:leading-[1.6] text-[#0B0B0B]/70">
            {study.summary}
          </p>
        </div>

        <div className="pt-2.5 sm:pt-4 border-t border-[#0B0B0B]/10 flex items-center justify-between gap-2 font-mono text-[11px] sm:text-[12px] text-[#0B2FA8]">
          <span>Read case study</span>
          <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
};