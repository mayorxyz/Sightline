import React, {useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {ArrowUpRight, BookOpen, FileText, History} from 'lucide-react';
import {ResourceHubCard, ResourcesIconKey} from '../../lib/resourcesContent';
import {useReducedMotion} from '../../hooks/useReducedMotion';

const ICONS: Record<ResourcesIconKey, React.ComponentType<{className?: string}>> = {
  docs: BookOpen,
  blog: FileText,
  changelog: History,
};

interface ResourceCardProps {
  card: ResourceHubCard;
  index: number;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({card, index}) => {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({rx: 0, ry: 0});
  const Icon = ICONS[card.id];

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
      className="will-change-transform"
    >
      <Link
        to={card.to}
        className="group h-full rounded-[8px] bg-white border border-[#0B0B0B]/15 hover:border-[#0B2FA8] p-5 sm:p-7 flex flex-col justify-between gap-5 sm:gap-8 transition-colors focus-visible:outline-2 focus-visible:outline-[#0B2FA8]"
      >
        <div>
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-[4px] bg-[#0B2FA8] text-white mb-5">
            <Icon className="w-5 h-5" />
          </span>
          <h2 className="text-[28px] font-medium tracking-[-0.03em] text-[#0B0B0B]">
            {card.title}
          </h2>
          <p className="mt-2 text-[15px] leading-[1.6] text-[#0B0B0B]/70">{card.description}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#0B0B0B]/10">
          <span className="font-mono text-[12px] font-medium text-[#0B2FA8]">{card.cta}</span>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-[2px] bg-[#0B2FA8] text-[#D9C4A8] group-hover:rotate-45 transition-transform duration-200">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};
