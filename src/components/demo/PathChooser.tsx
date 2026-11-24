import React, {useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {Check, Play, Calendar} from 'lucide-react';
import {DEMO_PATHS} from '../../lib/demoContent';
import {Button} from '../Button';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface PathChooserProps {
  onBookScroll: () => void;
}

export const PathChooser: React.FC<PathChooserProps> = ({onBookScroll}) => {
  const reducedMotion = useReducedMotion();

  return (
    <section className="mx-2 sm:mx-5 mt-6 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10">
      <div className="max-w-[1360px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
        {DEMO_PATHS.map((card, idx) => (
          <TiltPathCard
            key={card.id}
            card={card}
            index={idx}
            reducedMotion={reducedMotion}
            onBookScroll={onBookScroll}
          />
        ))}
      </div>
    </section>
  );
};

interface TiltPathCardProps {
  card: (typeof DEMO_PATHS)[number];
  index: number;
  reducedMotion: boolean;
  onBookScroll: () => void;
}

const TiltPathCard: React.FC<TiltPathCardProps> = ({
  card,
  index,
  reducedMotion,
  onBookScroll,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({rx: 0, ry: 0});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || window.innerWidth < 768 || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-ny * 6).toFixed(2)), // max 3deg
      ry: Number((nx * 6).toFixed(2)),
    });
  };

  const handleMouseLeave = () => setTilt({rx: 0, ry: 0});

  const isSand = card.variant === 'sand';

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 24}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, amount: 0.2}}
      transition={{
        duration: reducedMotion ? 0 : 0.55,
        delay: reducedMotion ? 0 : index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        transform: reducedMotion
          ? undefined
          : `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`rounded-[8px] p-5 sm:p-7 lg:p-9 flex flex-col justify-between gap-5 sm:gap-8 border will-change-transform min-w-0 ${
        isSand
          ? 'bg-[#D9C4A8] text-[#0B0B0B] border-[#0B0B0B]/15'
          : 'bg-[#0A1F6B] text-white border-[#0A1F6B]'
      }`}
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] font-mono text-[11px] uppercase tracking-[0.06em] ${
              isSand ? 'bg-[#0B2FA8] text-white' : 'bg-[#D9C4A8] text-[#0A1F6B] font-semibold'
            }`}
          >
            {isSand ? <Play className="w-3 h-3 fill-current" /> : <Calendar className="w-3 h-3" />}
            <span>{card.badge}</span>
          </span>

          <span
            className={`font-mono text-[12px] ${
              isSand ? 'text-[#0B0B0B]/70' : 'text-[#D9C4A8]'
            }`}
          >
            {card.duration}
          </span>
        </div>

        <h2 className="text-[26px] sm:text-[36px] font-medium tracking-[-0.03em] leading-[1.05]">
          {card.title}
        </h2>
        <p
          className={`mt-3 text-[15px] leading-[1.6] max-w-[480px] ${
            isSand ? 'text-[#0B0B0B]/75' : 'text-white/75'
          }`}
        >
          {card.description}
        </p>

        <ul className="mt-6 flex flex-col gap-2.5">
          {card.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-[14px]">
              <span
                className={`mt-0.5 inline-flex items-center justify-center w-4 h-4 rounded-[2px] shrink-0 ${
                  isSand ? 'bg-[#0B2FA8] text-white' : 'bg-[#D9C4A8] text-[#0A1F6B]'
                }`}
              >
                <Check className="w-3 h-3" strokeWidth={2.4} />
              </span>
              <span className={isSand ? 'text-[#0B0B0B]/85' : 'text-white/85'}>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-2 w-full [&>div]:w-full sm:[&>div]:w-auto [&>div>a]:w-full sm:[&>div>a]:w-auto [&>div>button]:w-full sm:[&>div>button]:w-auto">
        {card.id === 'sandbox' ? (
          <Button label={card.ctaLabel} variant="primary" to="/demo/sandbox" />
        ) : (
          <Button label={card.ctaLabel} variant="sand" onClick={onBookScroll} />
        )}
      </div>
    </motion.div>
  );
};
