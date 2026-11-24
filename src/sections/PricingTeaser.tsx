import React, {useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {Check} from 'lucide-react';
import {SectionTag} from '../components/SectionTag';
import {RevealText} from '../components/RevealText';
import {Button} from '../components/Button';
import {useInView} from '../hooks/useInView';
import {useReducedMotion} from '../hooks/useReducedMotion';

interface TeaserTier {
  id: string;
  name: string;
  price: string;
  suffix: string;
  featured?: boolean;
  bullets: string[];
}

const TEASER_TIERS: TeaserTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$0',
    suffix: '/ month',
    bullets: ['50K traces / month', '7-day retention', '1 project workspace'],
  },
  {
    id: 'team',
    name: 'Team',
    price: '$49',
    suffix: '/ seat / mo',
    featured: true,
    bullets: ['5M traces / month', 'Automated evals & alerts', '30-day retention & Slack'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    suffix: 'annual contract',
    bullets: ['Unlimited traces & retention', 'SSO/SAML & audit logs', 'Private VPC & 99.99% SLA'],
  },
];

const TeaserCard: React.FC<{tier: TeaserTier; inView: boolean; delayIdx: number}> = ({
  tier,
  inView,
  delayIdx,
}) => {
  const reducedMotion = useReducedMotion();
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
      className={`h-full w-full min-w-0 rounded-[6px] sm:rounded-[8px] p-3.5 sm:p-7 flex flex-col justify-between gap-3.5 sm:gap-6 will-change-transform ${
        tier.featured
          ? 'bg-[#0B2FA8] text-white shadow-[0_14px_34px_rgba(11,47,168,0.22)] sm:shadow-[0_20px_50px_rgba(11,47,168,0.24)]'
          : 'bg-white text-[#0B0B0B] border border-[#0B0B0B]/12'
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <h3 className="text-[17px] sm:text-[20px] font-medium tracking-[-0.02em] truncate">
            {tier.name}
          </h3>
          {tier.featured && (
            <span className="shrink-0 px-1.5 sm:px-2 py-0.5 rounded-[2px] bg-[#D9C4A8] text-[#0B0B0B] font-mono text-[9.5px] sm:text-[10.5px] font-semibold">
              Popular
            </span>
          )}
        </div>

        <div className="mt-3 sm:mt-5 pb-3 sm:pb-5 border-b border-current/15 flex flex-wrap items-baseline gap-1.5 sm:gap-2 min-w-0">
          <span className="font-mono text-[28px] sm:text-[42px] font-medium tracking-[-0.04em] leading-none tabular-nums">
            {tier.price}
          </span>
          <span
            className={`font-mono text-[11px] sm:text-[12.5px] truncate ${
              tier.featured ? 'text-white/75' : 'text-[#0B0B0B]/60'
            }`}
          >
            {tier.suffix}
          </span>
        </div>

        <ul className="mt-3 sm:mt-5 flex flex-col gap-1.5 sm:gap-2.5">
          {tier.bullets.map((b) => (
            <li key={b} className="flex items-center gap-2 sm:gap-2.5 text-[12.5px] sm:text-[14px] min-w-0">
              <span
                className={`inline-flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[2px] shrink-0 ${
                  tier.featured ? 'bg-[#D9C4A8] text-[#0B2FA8]' : 'bg-[#0B2FA8] text-white'
                }`}
              >
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2.5} />
              </span>
              <span className={`truncate ${tier.featured ? 'text-white/90' : 'text-[#0B0B0B]/80'}`}>
                {b}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const PricingTeaser: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const {ref, inView} = useInView<HTMLElement>({threshold: 0.06, once: true});

  return (
    <section
      ref={ref}
      id="pricing-teaser"
      className="mx-1.5 sm:mx-5 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10"
    >
      <div className="w-full max-w-[1360px] mx-auto min-w-0">
        <div className="flex flex-wrap items-start sm:items-end justify-between gap-3 sm:gap-6 mb-5 sm:mb-10">
          <div className="min-w-0">
            <motion.div
              initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
              animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
              transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
            >
              <SectionTag label="Pricing" />
            </motion.div>

            <RevealText
              as="h2"
              visible={inView}
              delayBase={0.1}
              className="mt-3 sm:mt-6 text-[26px] leading-[1.12] sm:text-[58px] lg:text-[72px] text-[#0B0B0B] max-w-[820px]"
              lines={[
                <>
                  Start Free. <span className="headline-serif-accent">Scale</span>
                </>,
                <>With Runs.</>,
              ]}
            />
          </div>

          <motion.div
            initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            transition={{duration: 0.5, delay: reducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1]}}
            className="shrink-0"
          >
            <Button label="See Full Pricing" variant="primary" to="/pricing" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 items-stretch gap-3 sm:gap-6">
          {TEASER_TIERS.map((tier, idx) => (
            <TeaserCard key={tier.id} tier={tier} inView={inView} delayIdx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingTeaser;