import React, {useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {Check} from 'lucide-react';
import {PricingTier} from '../../../lib/mockData';
import {BillingCycle} from './BillingToggle';
import {Button} from '../../../components/Button';
import {useReducedMotion} from '../../../hooks/useReducedMotion';

interface PricingCardProps {
  tier: PricingTier;
  cycle: BillingCycle;
  inView: boolean;
  delayIdx: number;
}

export const PricingCard: React.FC<PricingCardProps> = ({tier, cycle, inView, delayIdx}) => {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({rx: 0, ry: 0});

  const targetPrice = cycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
  const [displayPrice, setDisplayPrice] = useState<number | null>(targetPrice);
  const prevTargetRef = useRef<number | null>(targetPrice);

  // Smooth number roll when billing cycle toggles
  useEffect(() => {
    if (targetPrice === null) {
      setDisplayPrice(null);
      return;
    }
    const startVal = prevTargetRef.current ?? targetPrice;
    prevTargetRef.current = targetPrice;

    if (reducedMotion || startVal === targetPrice) {
      setDisplayPrice(targetPrice);
      return;
    }

    let rafId = 0;
    const startTime = performance.now();
    const duration = 360;

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayPrice(Math.round(startVal + (targetPrice - startVal) * eased));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setDisplayPrice(targetPrice);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [targetPrice, reducedMotion]);

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

  const isFeatured = Boolean(tier.featured);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({rx: 0, ry: 0})}
      initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
      animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
      transition={{
        duration: reducedMotion ? 0 : 0.55,
        delay: reducedMotion ? 0 : delayIdx * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        transform: reducedMotion
          ? undefined
          : `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`h-full w-full min-w-0 rounded-[6px] sm:rounded-[8px] p-4 sm:p-8 flex flex-col justify-between gap-4 sm:gap-6 will-change-transform ${
        isFeatured
          ? 'bg-[#0B2FA8] text-white shadow-[0_14px_34px_rgba(11,47,168,0.22)] sm:shadow-[0_24px_54px_rgba(11,47,168,0.28)]'
          : 'bg-white text-[#0B0B0B] border border-[#0B0B0B]/12'
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <h3 className="text-[18px] sm:text-[22px] font-medium tracking-[-0.02em] truncate">
            {tier.name}
          </h3>
          {tier.badge && (
            <span className="shrink-0 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-[2px] bg-[#D9C4A8] text-[#0B0B0B] font-mono text-[10px] sm:text-[11px] font-semibold whitespace-nowrap">
              {tier.badge}
            </span>
          )}
        </div>

        <p
          className={`mt-1.5 sm:mt-2 text-[13px] sm:text-[14px] leading-[1.45] sm:leading-[1.5] ${
            isFeatured ? 'text-white/80' : 'text-[#0B0B0B]/65'
          }`}
        >
          {tier.tagline}
        </p>

        {/* Price Row */}
        <div className="mt-4 sm:mt-6 pb-4 sm:pb-6 border-b border-current/15 flex flex-wrap items-baseline gap-1.5 sm:gap-2 min-w-0">
          <span className="text-[32px] sm:text-[52px] font-medium tracking-[-0.04em] leading-none font-mono tabular-nums">
            {displayPrice === null ? 'Custom' : `$${displayPrice}`}
          </span>
          <span
            className={`text-[11.5px] sm:text-[13px] font-mono truncate ${
              isFeatured ? 'text-white/75' : 'text-[#0B0B0B]/60'
            }`}
          >
            {tier.priceSuffix}
          </span>
        </div>

        {/* Checklist */}
        <ul className="mt-4 sm:mt-6 flex flex-col gap-2 sm:gap-3">
          {tier.features.map((feat, idx) => (
            <motion.li
              key={feat}
              initial={reducedMotion ? {opacity: 1, x: 0} : {opacity: 0, x: -8}}
              animate={inView || reducedMotion ? {opacity: 1, x: 0} : {opacity: 0, x: -8}}
              transition={{
                duration: reducedMotion ? 0 : 0.35,
                delay: reducedMotion ? 0 : 0.16 + idx * 0.05,
              }}
              className="flex items-start gap-2 sm:gap-2.5 text-[13px] sm:text-[14px] leading-snug min-w-0"
            >
              <span
                className={`mt-0.5 inline-flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[2px] shrink-0 ${
                  isFeatured ? 'bg-[#D9C4A8] text-[#0B2FA8]' : 'bg-[#0B2FA8] text-white'
                }`}
              >
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2.5} />
              </span>
              <span className={`min-w-0 ${isFeatured ? 'text-white/90' : 'text-[#0B0B0B]/85'}`}>
                {feat}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="pt-1 sm:pt-2 w-full [&>*]:w-full sm:[&>*]:w-auto">
        <Button
          label={tier.ctaLabel}
          variant={isFeatured ? 'sand' : 'primary'}
          to={tier.ctaTo}
        />
      </div>
    </motion.div>
  );
};