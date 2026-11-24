import React, {useRef} from 'react';
import {Activity, BellRing, CheckCircle2, LineChart} from 'lucide-react';
import {motion} from 'framer-motion';
import {SectionTag} from '../components/SectionTag';
import {RevealText} from '../components/RevealText';
import {FeatureCard, FeatureCardTheme} from '../components/features/FeatureCard';
import {TraceWaterfall} from '../components/features/TraceWaterfall';
import {EvalTable} from '../components/features/EvalTable';
import {CostChart} from '../components/features/CostChart';
import {AlertFeed} from '../components/features/AlertFeed';
import {useInView} from '../hooks/useInView';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {useHorizontalPin} from '../hooks/useHorizontalPin';

interface FeatureSpec {
  index: string;
  title: string;
  description: string;
  theme: FeatureCardTheme;
  icon: React.ReactNode;
  renderMock: (active: boolean) => React.ReactNode;
}

const FEATURES: FeatureSpec[] = [
  {
    index: '01',
    title: 'Tracing',
    description:
      'Capture every tool invocation, retrieval step, and model call in a unified span timeline.',
    theme: 'sand',
    icon: <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />,
    renderMock: (active) => <TraceWaterfall active={active} />,
  },
  {
    index: '02',
    title: 'Evals',
    description:
      'Run automated hallucination, tone, and policy checks continuously against production traffic.',
    theme: 'navy',
    icon: <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />,
    renderMock: (active) => <EvalTable active={active} />,
  },
  {
    index: '03',
    title: 'Cost and Latency',
    description:
      'Track token spend per run and p95 latency across every model provider in real time.',
    theme: 'cobalt',
    icon: <LineChart className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />,
    renderMock: (active) => <CostChart active={active} />,
  },
  {
    index: '04',
    title: 'Alerts',
    description:
      'Route instant regression notifications to Slack, Email, or PagerDuty the moment metrics drift.',
    theme: 'white',
    icon: <BellRing className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />,
    renderMock: (active) => <AlertFeed active={active} />,
  },
];

const FeaturesSection: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const {ref: headerRef, inView: headerInView} = useInView<HTMLDivElement>({
    threshold: 0.06,
    once: true,
  });

  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const {isMobile, progress, activeIndex, isScrubbing, visibleCards} = useHorizontalPin({
    sectionRef,
    pinRef,
    trackRef,
    cardRefs,
    cardCount: FEATURES.length,
    reducedMotion,
  });

  const formattedCounter = `0${Math.min(FEATURES.length, activeIndex + 1)} / 0${FEATURES.length}`;

  return (
    <section
      ref={sectionRef}
      id="features"
      className="mx-1.5 sm:mx-5 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10 overflow-x-clip"
    >
      {/* Top Section Tag & Headline */}
      <div ref={headerRef} className="w-full max-w-[1360px] mx-auto mb-5 sm:mb-12 min-w-0">
        <motion.div
          initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
          animate={headerInView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
          transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
        >
          <SectionTag label="Features" />
        </motion.div>

        <RevealText
          as="h2"
          visible={headerInView}
          delayBase={0.1}
          className="mt-3 sm:mt-6 text-[26px] leading-[1.12] sm:text-[58px] lg:text-[72px] text-[#0B0B0B] max-w-[920px]"
          lines={[
            <>Build Observability That</>,
            <>
              Matches <span className="headline-serif-accent">Real Agents</span>
            </>,
          ]}
        />
      </div>

      {/* Pinned Horizontal Scrub Container (Desktop) / Scroll-Snap (Mobile) / Static Grid (Reduced Motion) */}
      <div ref={pinRef} className="w-full max-w-[1360px] mx-auto min-w-0">
        <div className="overflow-hidden -mx-1 px-1 sm:-mx-2 sm:px-2">
          <div
            ref={trackRef}
            className={
              reducedMotion
                ? 'grid grid-cols-1 lg:grid-cols-2 items-stretch gap-3 sm:gap-6'
                : isMobile
                  ? 'flex items-stretch gap-3 overflow-x-auto snap-x snap-mandatory scroll-px-2.5 pb-2 -mx-2.5 px-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
                  : 'flex items-stretch gap-6 w-max py-2 will-change-transform'
            }
          >
            {FEATURES.map((feat, idx) => (
              <FeatureCard
                key={feat.index}
                index={feat.index}
                title={feat.title}
                description={feat.description}
                theme={feat.theme}
                icon={feat.icon}
                isActive={activeIndex === idx}
                isScrubbing={isScrubbing}
                isMobile={isMobile}
                cardRef={(el) => {
                  cardRefs.current[idx] = el;
                }}
              >
                {feat.renderMock(visibleCards[idx])}
              </FeatureCard>
            ))}
          </div>
        </div>

        {/* 2px Cobalt Progress Bar + 01 / 04 Counter */}
        {!reducedMotion && (
          <div className="mt-4 sm:mt-7 flex items-center justify-between gap-3 sm:gap-6">
            <div className="flex-1 h-[2px] bg-[#0B0B0B]/15 rounded-full overflow-hidden">
              <div
                style={{
                  transform: `scaleX(${Math.max(0.06, progress)})`,
                  transformOrigin: 'left center',
                }}
                className="h-full w-full bg-[#0B2FA8] transition-transform duration-100 ease-out will-change-transform"
              />
            </div>
            <span className="font-mono text-[11px] sm:text-[13px] font-medium tabular-nums text-[#0B0B0B] whitespace-nowrap shrink-0">
              {formattedCounter}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturesSection;