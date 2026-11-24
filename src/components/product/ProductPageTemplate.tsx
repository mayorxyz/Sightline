import React, {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {motion} from 'framer-motion';
import {ArrowUpRight, Check, Copy} from 'lucide-react';
import {HeroCanvas} from '../HeroCanvas';
import {SectionTag} from '../SectionTag';
import {RevealText} from '../RevealText';
import {Button} from '../Button';
import {Faq} from '../../pages/pricing/pricing  components/Faq';
import {Footer} from '../Footer';
import {ProductIcon} from './NavDropdown';
import {ProductSubPageData} from '../../lib/productContent';
import {useInView} from '../../hooks/useInView';
import {useReducedMotion} from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface ProductPageTemplateProps {
  data: ProductSubPageData;
  demo: React.ReactNode;
}

type Lang = 'python' | 'ts' | 'curl';

export const ProductPageTemplate: React.FC<ProductPageTemplateProps> = ({data, demo}) => {
  const reducedMotion = useReducedMotion();

  const {ref: whatRef, inView: whatInView} = useInView<HTMLElement>({threshold: 0.16, once: true});
  const {ref: stepsRef, inView: stepsInView} = useInView<HTMLElement>({threshold: 0.16, once: true});
  const {ref: capRef, inView: capInView} = useInView<HTMLElement>({threshold: 0.14, once: true});
  const {ref: useCaseRef, inView: useCaseInView} = useInView<HTMLElement>({threshold: 0.14, once: true});
  const {ref: codeRef, inView: codeInView} = useInView<HTMLElement>({threshold: 0.2, once: true});

  const stepsTrackRef = useRef<HTMLDivElement | null>(null);
  const [stepProgress, setStepProgress] = useState(reducedMotion ? 1 : 0);
  const [hoveredCapIdx, setHoveredCapIdx] = useState<number | null>(null);
  const [capTilt, setCapTilt] = useState({rx: 0, ry: 0});

  const [codeLang, setCodeLang] = useState<Lang>('python');
  const [typedLen, setTypedLen] = useState<number>(
    reducedMotion ? data.code.python.length : 0
  );
  const [copied, setCopied] = useState(false);

  const snippet = data.code[codeLang];

  // Scroll-scrubbed cobalt line across 4 steps
  useEffect(() => {
    if (reducedMotion || !stepsTrackRef.current) {
      setStepProgress(1);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: stepsTrackRef.current,
        start: 'top 78%',
        end: 'top 32%',
        scrub: 0.4,
        onUpdate: (self) => setStepProgress(self.progress),
      });
    }, stepsTrackRef);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [reducedMotion]);

  // Code typewriter reveal
  useEffect(() => {
    if (reducedMotion) {
      setTypedLen(snippet.length);
      return;
    }
    if (!codeInView) return;
    setTypedLen(0);
    let len = 0;
    const step = Math.max(4, Math.ceil(snippet.length / 40));
    const timer = setInterval(() => {
      len += step;
      if (len >= snippet.length) {
        setTypedLen(snippet.length);
        clearInterval(timer);
      } else {
        setTypedLen(len);
      }
    }, 18);
    return () => clearInterval(timer);
  }, [codeInView, snippet, reducedMotion]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(true);
    }
  };

  const scrollToDocs = () => {
    const el = document.getElementById('sdk-code');
    if (el) el.scrollIntoView({behavior: reducedMotion ? 'auto' : 'smooth'});
  };

  return (
    <main className="pb-4">
      {/* 1. Compact Header */}
      <section className="p-2 sm:p-4 pb-0">
        <div className="relative w-full min-h-[220px] sm:min-h-[240px] rounded-[16px] sm:rounded-[24px] overflow-hidden bg-[#0A1F6B]">
          <div className="absolute inset-0">
            <HeroCanvas density={0.3} />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#E9E8E6]/95 via-[#E9E8E6]/88 to-[#D9C4A8]/65 backdrop-blur-[1px]"
            />
          </div>

          <div className="relative z-10 max-w-[1360px] mx-auto pt-16 sm:pt-24 pb-8 sm:pb-10 px-4 sm:px-8 lg:px-12">
            <SectionTag label={data.tag} />
            <RevealText
              as="h1"
              delayBase={0.08}
              className="mt-3 sm:mt-5 text-[32px] sm:text-[58px] lg:text-[72px] leading-tight text-[#0B0B0B] max-w-[920px]"
              lines={[
                <>{data.headlineTop}</>,
                <>
                  <span className="headline-serif-accent">{data.headlineItalic}</span>
                </>,
              ]}
            />
            <p className="mt-3 text-[14px] sm:text-[17px] leading-[1.6] text-[#0B0B0B]/70 max-w-[580px]">
              {data.sub}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button label="Request A Demo" variant="primary" to="/demo" />
              <Button label="View Docs" variant="secondary" onClick={scrollToDocs} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. What It Is */}
      <section
        ref={whatRef}
        className="mx-2 sm:mx-5 mt-6 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10"
      >
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-6">
            <h2 className="headline-display text-[26px] sm:text-[40px] leading-tight text-[#0B0B0B]">
              {data.whatItIs.title}
            </h2>
            <p className="mt-3 text-[14px] sm:text-[16px] leading-[1.6] text-[#0B0B0B]/75 max-w-[520px]">
              {data.whatItIs.body}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {data.whatItIs.chips.map((chip) => (
                <span
                  key={chip}
                  className="px-2.5 py-1 rounded-[3px] bg-white border border-[#0B0B0B]/15 font-mono text-[11px] sm:text-[12px] text-[#0B0B0B]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] p-4 sm:p-8 text-white">
            <svg viewBox="0 0 520 150" className="w-full h-auto overflow-visible" aria-hidden="true">
              <motion.path
                d="M 90 75 L 220 75 M 300 75 L 430 75"
                fill="none"
                stroke="#D9C4A8"
                strokeWidth="2"
                strokeDasharray="5 5"
                initial={reducedMotion ? {pathLength: 1} : {pathLength: 0}}
                animate={whatInView || reducedMotion ? {pathLength: 1} : {pathLength: 0}}
                transition={{duration: 0.75, ease: [0.16, 1, 0.3, 1]}}
              />
              {data.whatItIs.diagramNodes.map((label, idx) => {
                const cx = idx === 0 ? 75 : idx === 1 ? 260 : 445;
                return (
                  <g key={label}>
                    <rect
                      x={cx - 66}
                      y={42}
                      width="132"
                      height="66"
                      rx="6"
                      fill={idx === 1 ? '#0B2FA8' : '#FFFFFF'}
                      stroke="rgba(255,255,255,0.2)"
                    />
                    <text
                      x={cx}
                      y={79}
                      textAnchor="middle"
                      fill={idx === 1 ? '#FFFFFF' : '#0B0B0B'}
                      fontSize="12"
                      fontWeight="500"
                      fontFamily="Inter Tight, sans-serif"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section
        ref={stepsRef}
        className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10"
      >
        <div className="max-w-[1360px] mx-auto">
          <h2 className="headline-display text-[28px] sm:text-[44px] leading-tight text-[#0B0B0B] mb-6 sm:mb-10">
            How it <span className="headline-serif-accent">works</span>
          </h2>

          <div ref={stepsTrackRef} className="relative">
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-9 left-[8%] right-[8%] h-[2px] bg-[#0B0B0B]/15 z-0"
            >
              <div
                style={{
                  transform: `scaleX(${stepProgress})`,
                  transformOrigin: 'left center',
                }}
                className="h-full w-full bg-[#0B2FA8]"
              />
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {data.steps.map((step, idx) => {
                const lit = reducedMotion || stepProgress >= idx * 0.28 || stepsInView;
                return (
                  <motion.div
                    key={step.number}
                    initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                    animate={stepsInView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                    transition={{duration: 0.55, delay: idx * 0.08}}
                    className="bg-white rounded-[6px] sm:rounded-[8px] border border-[#0B0B0B]/12 p-4 sm:p-5 flex flex-col justify-between gap-4 sm:gap-5"
                  >
                    <div>
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full font-mono text-[11px] sm:text-[12px] font-semibold tabular-nums transition-colors ${
                          lit ? 'bg-[#0B2FA8] text-white' : 'bg-[#E9E8E6] text-[#0B0B0B]'
                        }`}
                      >
                        {step.number}
                      </span>
                      <h3 className="mt-3 sm:mt-4 text-[17px] sm:text-[19px] font-medium tracking-[-0.02em] text-[#0B0B0B]">
                        {step.title}
                      </h3>
                      <p className="mt-1 sm:mt-1.5 text-[13px] sm:text-[14px] leading-[1.5] text-[#0B0B0B]/70">
                        {step.body}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Key Capabilities */}
      <section
        ref={capRef}
        className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10"
      >
        <div className="max-w-[1360px] mx-auto">
          <h2 className="headline-display text-[28px] sm:text-[44px] leading-tight text-[#0B0B0B] mb-6 sm:mb-8">
            Key <span className="headline-serif-accent">capabilities</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {data.capabilities.map((cap, idx) => {
              const isHovered = hoveredCapIdx === idx;
              return (
                <motion.div
                  key={cap.title}
                  initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                  animate={capInView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                  transition={{duration: 0.5, delay: idx * 0.06}}
                  onMouseMove={(e) => {
                    if (reducedMotion || window.innerWidth < 768) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const nx = (e.clientX - rect.left) / rect.width - 0.5;
                    const ny = (e.clientY - rect.top) / rect.height - 0.5;
                    setHoveredCapIdx(idx);
                    setCapTilt({
                      rx: Number((-ny * 4).toFixed(2)),
                      ry: Number((nx * 4).toFixed(2)),
                    });
                  }}
                  onMouseLeave={() => {
                    setHoveredCapIdx(null);
                    setCapTilt({rx: 0, ry: 0});
                  }}
                  style={{
                    transform:
                      isHovered && !reducedMotion
                        ? `perspective(1000px) translateY(-4px) rotateX(${capTilt.rx}deg) rotateY(${capTilt.ry}deg)`
                        : undefined,
                    transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="bg-white rounded-[6px] border border-[#0B0B0B]/12 p-5 sm:p-6 flex flex-col gap-3"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-[4px] bg-[#0B2FA8] text-white">
                    <ProductIcon id={data.id} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </span>
                  <h3 className="text-[16px] sm:text-[18px] font-medium tracking-[-0.02em] text-[#0B0B0B]">
                    {cap.title}
                  </h3>
                  <p className="text-[13px] sm:text-[14px] leading-[1.55] text-[#0B0B0B]/70">{cap.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Interactive Demo */}
      <section className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto">
          <h2 className="headline-display text-[28px] sm:text-[44px] leading-tight text-[#0B0B0B] mb-6 sm:mb-8">
            Interactive <span className="headline-serif-accent">sandbox</span>
          </h2>
          <div className="rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] p-4 sm:p-8 text-white shadow-[0_20px_50px_rgba(10,31,107,0.18)]">
            {demo}
          </div>
        </div>
      </section>

      {/* 6. Use Cases */}
      <section
        ref={useCaseRef}
        className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10"
      >
        <div className="max-w-[1360px] mx-auto">
          <h2 className="headline-display text-[28px] sm:text-[44px] leading-tight text-[#0B0B0B] mb-6 sm:mb-8">
            Production <span className="headline-serif-accent">use cases</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
            {data.useCases.map((uc, idx) => (
              <motion.div
                key={uc.title}
                initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                animate={useCaseInView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                transition={{duration: 0.55, delay: idx * 0.08}}
                className="rounded-[6px] sm:rounded-[8px] bg-[#D9C4A8] p-5 sm:p-6 flex flex-col justify-between gap-4 sm:gap-5 text-[#0B0B0B]"
              >
                <div>
                  <span className="inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-[2px] bg-[#0B2FA8] text-white font-mono text-[10px] sm:text-[11px] font-medium tabular-nums mb-3 sm:mb-4">
                    {uc.metric}
                  </span>
                  <h3 className="text-[20px] sm:text-[22px] font-medium tracking-[-0.02em] leading-snug">
                    {uc.title}
                  </h3>

                  <div className="mt-3 sm:mt-4 flex flex-col gap-2 sm:gap-2.5 text-[13px] sm:text-[14px] leading-[1.5]">
                    <div>
                      <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.06em] text-[#0B0B0B]/55 block">
                        Problem
                      </span>
                      <span className="text-[#0B0B0B]/85">{uc.problem}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.06em] text-[#0B0B0B]/55 block">
                        What you do
                      </span>
                      <span className="text-[#0B0B0B]/85">{uc.action}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.06em] text-[#0B0B0B]/55 block">
                        Result
                      </span>
                      <span className="font-medium text-[#0B0B0B]">{uc.outcome}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Code Snippet Block */}
      <section
        id="sdk-code"
        ref={codeRef}
        className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10"
      >
        <div className="max-w-[1360px] mx-auto rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b border-white/15 bg-[#06154D]">
            <div className="flex items-center gap-1" role="tablist" aria-label="SDK snippet language">
              {(
                [
                  {id: 'python', label: 'Python'},
                  {id: 'ts', label: 'TypeScript'},
                  {id: 'curl', label: 'cURL'},
                ] as {id: Lang; label: string}[]
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={codeLang === item.id}
                  onClick={() => setCodeLang(item.id)}
                  className={`px-2.5 sm:px-3 py-1 rounded-[3px] font-mono text-[11px] sm:text-[12px] transition-colors cursor-pointer ${
                    codeLang === item.id ? 'bg-[#0B2FA8] text-white' : 'text-white/65 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-[3px] bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] sm:text-[11px] cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#86EFAC]" />
                  <span className="text-[#86EFAC]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 sm:p-6 font-mono text-[11px] sm:text-[13px] leading-[1.6] sm:leading-[1.65] text-white/90 overflow-x-auto min-h-[160px] sm:min-h-[180px]">
            <code>{snippet.slice(0, typedLen)}</code>
          </pre>
        </div>
      </section>

      {/* 8. FAQ + Related Features + Final CTA */}
      <Faq items={data.faq} />

      <section className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto">
          <h2 className="headline-display text-[26px] sm:text-[40px] leading-tight text-[#0B0B0B] mb-5 sm:mb-6">
            Related <span className="headline-serif-accent">modules</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {data.related.map((rel) => (
              <Link
                key={rel.to}
                to={rel.to}
                className="group rounded-[6px] sm:rounded-[8px] bg-white border border-[#0B0B0B]/12 p-5 sm:p-6 flex items-center justify-between gap-4 hover:border-[#0B2FA8] transition-colors"
              >
                <div>
                  <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#0B2FA8]">
                    {rel.tag}
                  </span>
                  <h3 className="mt-1 text-[20px] sm:text-[22px] font-medium tracking-[-0.02em] text-[#0B0B0B]">
                    {rel.title}
                  </h3>
                  <p className="mt-1 text-[13px] sm:text-[14px] text-[#0B0B0B]/70">{rel.description}</p>
                </div>
                <span className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-[2px] bg-[#0B2FA8] text-white shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-45 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto rounded-[6px] sm:rounded-[8px] bg-[#D9C4A8] p-6 sm:p-12 flex flex-wrap items-center justify-between gap-6">
          <h2 className="headline-display text-[26px] sm:text-[44px] leading-tight text-[#0B0B0B] max-w-[620px]">
            Ready to instrument your agents <span className="headline-serif-accent">today</span>?
          </h2>
          <Button label="Request A Demo" variant="primary" to="/demo" />
        </div>
      </section>

      <Footer />
    </main>
  );
};