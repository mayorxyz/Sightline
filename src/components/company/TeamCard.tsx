import React from 'react';
import {motion} from 'framer-motion';
import {Linkedin, Twitter} from 'lucide-react';
import {TeamMember} from '../../lib/companyContent';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

export const TeamCard: React.FC<TeamCardProps> = ({member, index}) => {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, amount: 0.2}}
      transition={{
        duration: reducedMotion ? 0 : 0.45,
        delay: reducedMotion ? 0 : index * 0.06,
      }}
      className="group rounded-[6px] sm:rounded-[8px] bg-white border border-[#0B0B0B]/15 hover:border-[#0B2FA8] p-4 sm:p-5 flex flex-col justify-between gap-3 sm:gap-4 transition-colors"
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <span
            className={`inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-[4px] font-mono text-[12px] sm:text-[14px] font-semibold shrink-0 ${member.colorClass}`}
          >
            {member.initials}
          </span>

          {/* Non-functional hover link row */}
          <div
            aria-label={`${member.name} social profiles`}
            className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200"
          >
            <span
              title="LinkedIn (demo)"
              className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-[2px] bg-[#E9E8E6] text-[#0B0B0B]/70"
            >
              <Linkedin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </span>
            <span
              title="X (demo)"
              className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-[2px] bg-[#E9E8E6] text-[#0B0B0B]/70"
            >
              <Twitter className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </span>
          </div>
        </div>

        <h3 className="text-[16px] sm:text-[17px] font-medium tracking-[-0.02em] text-[#0B0B0B]">
          {member.name}
        </h3>
        <span className="block font-mono text-[10px] sm:text-[11.5px] text-[#0B2FA8] mb-1.5 sm:mb-2">{member.role}</span>
        <p className="text-[13px] sm:text-[13.5px] leading-[1.55] text-[#0B0B0B]/70">{member.bio}</p>
      </div>
    </motion.div>
  );
};