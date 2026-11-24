import React, {useEffect, useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {Sparkles} from 'lucide-react';
import {motion} from 'framer-motion';
import {AgentTrace} from '../components/AgentTrace';
import {StatChip} from '../components/StatChip';
import {RevealText} from '../components/RevealText';
import {Button} from '../components/Button';
import {useInView} from '../hooks/useInView';
import {useReducedMotion} from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

// Deterministic swirl dash strokes (6-24px long, 4px thick, sand #D9C4A8 at 35% opacity)
interface SwirlDash {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

const SWIRL_DASHES: SwirlDash[] = (() => {
  const dashes: SwirlDash[] = [];
  let s = 9182;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  const cx = 240;
  const cy = 280;

  for (let ring = 0; ring < 14; ring++) {
    const r = 130 + ring * 58;
    const count = 18 + ring * 4;
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2 + ring * 0.27 + (rand() - 0.5) * 0.14;
      const x = cx + Math.cos(theta) * (r * 1.25);
      const y = cy + Math.sin(theta) * (r * 0.78);

      if (x < -40 || x > 1240 || y < -40 || y > 660) continue;

      const inTextZone = x > 610 && x < 1030 && y > 170 && y < 480;
      if (inTextZone && rand() < 0.86) continue;

      const angle = theta + Math.PI / 2 + (rand() - 0.5) * 0.16;
      const len = 6 + rand() * 18;
      const dx = Math.cos(angle) * (len / 2);
      const dy = Math.sin(angle) * (len / 2);

      dashes.push({
        x1: Number((x - dx).toFixed(1)),
        y1: Number((y - dy).toFixed(1)),
        x2: Number((x + dx).toFixed(1)),
        y2: Number((y + dy).toFixed(1)),
        opacity: inTextZone ? 0.16 : 0.35,
      });
    }
  }
  return dashes;
})();

const WhySightline: React.FC = () => {
  const {ref: inViewRef, inView} = useInView<HTMLElement>({threshold: 0.06, once: true});
  const bgParallaxRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !inViewRef.current || !bgParallaxRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(bgParallaxRef.current, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: inViewRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, inViewRef);

    return () => ctx.revert();
  }, [reducedMotion, inViewRef]);

  return (
    <section
      id="why-Sightline"
      ref={inViewRef}
      className="mx-1.5 sm:mx-5 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10"
    >
      <motion.div
        initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
        animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
        transition={{duration: 0.55, ease: [0.16, 1, 0.3, 1]}}
        className="relative w-full min-h-0 lg:min-h-[600px] rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center gap-5 sm:gap-10 lg:gap-12 p-3.5 sm:p-10 lg:p-14"
      >
        {/* Swirl Dashed Strokes Background */}
        <div
          ref={bgParallaxRef}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-8 sm:-inset-12 will-change-transform"
        >
          <svg
            viewBox="0 0 1200 620"
            preserveAspectRatio="xMidYMid slice"
            className={`w-full h-full ${reducedMotion ? '' : 'animate-swirl-drift'}`}
          >
            {SWIRL_DASHES.map((d, i) => (
              <line
                key={i}
                x1={d.x1}
                y1={d.y1}
                x2={d.x2}
                y2={d.y2}
                stroke="#D9C4A8"
                strokeOpacity={d.opacity}
                strokeWidth="4"
                strokeLinecap="round"
              />
            ))}
          </svg>
        </div>

        {/* Left Column (50%): Interactive Agent Trace Card */}
        <motion.div
          initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
          animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
          transition={{duration: 0.55, delay: reducedMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1]}}
          className="relative z-10 w-full min-w-0 max-w-[540px] mx-auto lg:mx-0"
        >
          <AgentTrace inView={inView} />
        </motion.div>

        {/* Right Column (50%): Content */}
        <div className="relative z-10 w-full min-w-0 flex flex-col items-start">
          {/* Cobalt Square with White Sparkle Icon */}
          <motion.div
            initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            transition={{duration: 0.5, delay: reducedMotion ? 0 : 0.14, ease: [0.16, 1, 0.3, 1]}}
            className="w-10 h-10 sm:w-14 sm:h-14 rounded-[4px] bg-[#0B2FA8] border border-white/15 flex items-center justify-center text-white mb-3.5 sm:mb-6 shadow-[0_8px_24px_rgba(11,47,168,0.45)]"
          >
            <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" strokeWidth={1.85} />
          </motion.div>

          {/* Heading */}
          <RevealText
            as="h2"
            visible={inView}
            delayBase={0.18}
            className="text-[25px] leading-[1.08] sm:text-[42px] lg:text-[44px] text-white sm:!leading-[1.02] max-w-[500px]"
            lines={[
              <>Why Should You Choose</>,
              <>
                <span className="headline-serif-accent text-[#D9C4A8]">Sightline</span>
              </>,
            ]}
          />

          {/* Paragraph */}
          <motion.p
            initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            transition={{duration: 0.55, delay: reducedMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1]}}
            className="mt-3 sm:mt-5 text-[13.5px] sm:text-[17px] leading-[1.52] sm:leading-[1.6] text-white/85 max-w-[520px]"
          >
            As agent workflows grow, teams lose confidence in what their agents are actually
            doing. Sightline gives you full traces, evals, and alerts across every run,
            built for teams that need more than logs.
          </motion.p>

          {/* 3 Inline Stat Chips */}
          <motion.div
            initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            transition={{duration: 0.55, delay: reducedMotion ? 0 : 0.34, ease: [0.16, 1, 0.3, 1]}}
            className="mt-4 sm:mt-6 flex flex-wrap items-stretch gap-2 sm:gap-2.5"
          >
            <StatChip
              target={2.3}
              decimals={1}
              suffix="M"
              label="traces/day"
              active={inView}
              delayMs={180}
            />
            <StatChip
              target={1.84}
              decimals={2}
              prefix="p95 "
              suffix="s"
              label=""
              active={inView}
              delayMs={260}
            />
            <StatChip
              target={99.97}
              decimals={2}
              suffix="%"
              label="uptime"
              active={inView}
              delayMs={340}
            />
          </motion.div>

          {/* View Use Cases CTA */}
          <motion.div
            initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
            transition={{duration: 0.55, delay: reducedMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1]}}
            className="mt-5 sm:mt-8 shrink-0"
          >
            <Button label="View Use Cases" variant="sand" to="/product" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default WhySightline;