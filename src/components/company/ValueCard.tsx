import React, {useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {Compass, Eye, ShieldCheck, Zap} from 'lucide-react';
import {CompanyValue} from '../../lib/companyContent';
import {useReducedMotion} from '../../hooks/useReducedMotion';

const VALUE_ICONS: Record<CompanyValue['id'], React.ComponentType<{className?: string}>> = {
  clarity: Eye,
  ship: Zap,
  outcome: ShieldCheck,
  honesty: Compass,
};

interface ValueCardProps {
  value: CompanyValue;
  index: number;
}

export const ValueCard: React.FC<ValueCardProps> = ({value, index}) => {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({rx: 0, ry: 0});
  const Icon = VALUE_ICONS[value.id];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || window.innerWidth < 768 || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-ny * 4).toFixed(2)),
      ry: Number((nx * 4).toFixed(2)),
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({rx: 0, ry: 0})}
      initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, amount: 0.2}}
      transition={{
        duration: reducedMotion ? 0 : 0.45,
        delay: reducedMotion ? 0 : index * 0.08,
      }}
      style={{
        transform: reducedMotion
          ? undefined
          : `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="rounded-[6px] sm:rounded-[8px] bg-[#D9C4A8]/55 border border-[#0B0B0B]/15 p-4 sm:p-6 flex flex-col gap-2.5 sm:gap-3 will-change-transform"
    >
      <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-[3px] bg-[#0B2FA8] text-white">
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </span>
      <h3 className="text-[18px] sm:text-[20px] font-medium tracking-[-0.02em] text-[#0B0B0B]">{value.title}</h3>
      <p className="text-[13px] sm:text-[14px] leading-[1.55] text-[#0B0B0B]/75">{value.body}</p>
    </motion.div>
  );
};