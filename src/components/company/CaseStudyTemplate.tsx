import React, {useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowLeft, ArrowRight, ArrowUpRight} from 'lucide-react';
import {CASE_STUDIES, CaseStudy} from '../../lib/companyContent';
import {StatChip} from '../StatChip';
import {BeforeAfterBars} from './BeforeAfterBars';
import {CaseStudyCard} from './CaseStudyCard';
import {Button} from '../Button';
import {useInView} from '../../hooks/useInView';

interface CaseStudyTemplateProps {
  study: CaseStudy;
}

export const CaseStudyTemplate: React.FC<CaseStudyTemplateProps> = ({study}) => {
  const [readPct, setReadPct] = useState(0);
  const {ref: headerRef, inView: headerInView} = useInView<HTMLElement>({
    threshold: 0.06,
    once: true,
  });

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) {
        setReadPct(0);
        return;
      }
      setReadPct(Math.min(100, Math.max(0, (window.scrollY / total) * 100)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, [study.slug]);

  const currentIdx = CASE_STUDIES.findIndex((c) => c.slug === study.slug);
  const prevStudy = currentIdx > 0 ? CASE_STUDIES[currentIdx - 1] : null;
  const nextStudy =
    currentIdx >= 0 && currentIdx < CASE_STUDIES.length - 1
      ? CASE_STUDIES[currentIdx + 1]
      : null;

  const relatedStudies = useMemo(
    () =>
      study.relatedSlugs
        .map((slug) => CASE_STUDIES.find((c) => c.slug === slug))
        .filter((c): c is CaseStudy => Boolean(c)),
    [study.relatedSlugs]
  );

  return (
    <article className="pb-2 sm:pb-4 pt-16 sm:pt-24 overflow-x-clip">
      {/* Reading Progress Bar */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-transparent pointer-events-none"
      >
        <div
          style={{width: `${readPct}%`}}
          className="h-full bg-[#0B2FA8] transition-[width] duration-75"
        />
      </div>

      {/* Case Study Header */}
      <header
        ref={headerRef}
        className="mx-1.5 sm:mx-5 border border-[#0B0B0B]/20 py-6 sm:py-12 px-3 sm:px-6 lg:px-10 bg-[#0A1F6B] text-white rounded-t-[8px] sm:rounded-t-[12px]"
      >
        <div className="w-full max-w-[1160px] mx-auto min-w-0">
          <Link
            to="/customers"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-[12px] text-[#D9C4A8] hover:underline mb-3 sm:mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span>All Customers</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2.5 sm:mb-4 min-w-0">
            <span className="text-[16px] sm:text-[20px] font-semibold tracking-[-0.03em] text-white">
              {study.company}
            </span>
            <span className="px-2 sm:px-2.5 py-0.5 rounded-[2px] bg-[#D9C4A8] text-[#0A1F6B] font-mono text-[10px] sm:text-[11px] font-semibold uppercase">
              {study.industry}
            </span>
          </div>

          <h1 className="headline-display text-[24px] leading-[1.12] sm:text-[52px] text-white max-w-[920px]">
            {study.headline}
          </h1>

          <div className="mt-5 sm:mt-8 flex flex-wrap items-stretch gap-2 sm:gap-3 min-w-0">
            {study.metrics.map((m, idx) => (
              <StatChip
                key={m.label}
                target={m.target}
                decimals={m.decimals ?? 0}
                prefix={m.prefix}
                suffix={m.suffix}
                label={m.label}
                active={headerInView}
                delayMs={100 + idx * 80}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Two Columns: Sticky Facts Sidebar + Narrative Body */}
      <section className="mx-1.5 sm:mx-5 border-x border-b border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10">
        <div className="w-full max-w-[1160px] mx-auto min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10 items-start">
          {/* Sticky Company Facts Sidebar */}
          <aside className="lg:col-span-4 w-full min-w-0 lg:sticky lg:top-24 rounded-[6px] sm:rounded-[8px] bg-white border border-[#0B0B0B]/15 p-3.5 sm:p-6 flex flex-col gap-3.5 sm:gap-5">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#0B2FA8]">
              Customer Profile
            </span>

            <dl className="flex flex-col gap-2.5 sm:gap-3.5 text-[13px] sm:text-[14px] min-w-0">
              <div className="min-w-0">
                <dt className="font-mono text-[9.5px] sm:text-[10.5px] uppercase text-[#0B0B0B]/50">
                  Industry
                </dt>
                <dd className="font-medium text-[#0B0B0B] leading-snug">{study.facts.industry}</dd>
              </div>
              <div className="min-w-0">
                <dt className="font-mono text-[9.5px] sm:text-[10.5px] uppercase text-[#0B0B0B]/50">
                  Team Size
                </dt>
                <dd className="font-medium text-[#0B0B0B] leading-snug">{study.facts.teamSize}</dd>
              </div>
              <div className="min-w-0">
                <dt className="font-mono text-[9.5px] sm:text-[10.5px] uppercase text-[#0B0B0B]/50">
                  Agents in Production
                </dt>
                <dd className="font-medium text-[#0B0B0B] leading-snug">
                  {study.facts.agentsInProd}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="font-mono text-[9.5px] sm:text-[10.5px] uppercase text-[#0B0B0B]/50">
                  Stack
                </dt>
                <dd className="font-mono text-[11.5px] sm:text-[12.5px] leading-snug text-[#0B0B0B]/80 break-words">
                  {study.facts.stack}
                </dd>
              </div>
            </dl>

            <div className="pt-3 sm:pt-4 border-t border-[#0B0B0B]/12 min-w-0">
              <span className="block font-mono text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.06em] text-[#0B0B0B]/50 mb-2 sm:mb-2.5">
                Products used
              </span>
              <div className="flex flex-wrap gap-1.5">
                {study.productsUsed.map((prod) => (
                  <Link
                    key={prod.to}
                    to={prod.to}
                    className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-[2px] bg-[#E9E8E6] hover:bg-[#0B2FA8] hover:text-white text-[11px] sm:text-[12px] font-medium text-[#0B0B0B] transition-colors"
                  >
                    <span>{prod.label}</span>
                    <ArrowUpRight className="w-3 h-3 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Narrative Body */}
          <div className="lg:col-span-8 w-full min-w-0 flex flex-col gap-6 sm:gap-10">
            <div className="min-w-0">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#0B2FA8]">
                01 · Challenge
              </span>
              <h2 className="mt-1.5 sm:mt-2 text-[20px] sm:text-[32px] font-medium tracking-[-0.02em] leading-snug text-[#0B0B0B]">
                Blindspots behind HTTP 200 responses
              </h2>
              <div className="mt-2.5 sm:mt-3 flex flex-col gap-2.5 sm:gap-3.5 text-[14px] sm:text-[16px] leading-[1.6] sm:leading-[1.7] text-[#0B0B0B]/80">
                {study.challenge.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#0B2FA8]">
                02 · Approach
              </span>
              <h2 className="mt-1.5 sm:mt-2 text-[20px] sm:text-[32px] font-medium tracking-[-0.02em] leading-snug text-[#0B0B0B] mb-3 sm:mb-4">
                How the engineering team fixed it
              </h2>
              <div className="flex flex-col gap-2.5 sm:gap-4 min-w-0">
                {study.approach.map((step, idx) => (
                  <div
                    key={step.title}
                    className="w-full min-w-0 rounded-[6px] bg-white border border-[#0B0B0B]/15 p-3.5 sm:p-5 flex items-start gap-3 sm:gap-4"
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-[3px] bg-[#0B2FA8] text-white font-mono text-[11px] sm:text-[12px] font-medium shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[15px] sm:text-[17px] font-medium leading-snug text-[#0B0B0B]">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-[13px] sm:text-[14.5px] leading-[1.52] sm:leading-[1.6] text-[#0B0B0B]/70">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#0B2FA8]">
                03 · Results
              </span>
              <h2 className="mt-1.5 sm:mt-2 text-[20px] sm:text-[32px] font-medium tracking-[-0.02em] leading-snug text-[#0B0B0B] mb-3 sm:mb-4">
                Measured production impact
              </h2>
              <div className="flex flex-col gap-2.5 sm:gap-3.5 text-[14px] sm:text-[16px] leading-[1.6] sm:leading-[1.7] text-[#0B0B0B]/80 mb-4 sm:mb-6">
                {study.resultsSummary.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <BeforeAfterBars items={study.beforeAfter} />
            </div>

            {/* Pull Quote */}
            <blockquote className="w-full min-w-0 rounded-[6px] sm:rounded-[8px] bg-[#D9C4A8]/55 border-l-4 border-[#0B2FA8] p-4 sm:p-7">
              <p className="text-[16px] sm:text-[24px] font-medium tracking-[-0.02em] leading-[1.35] text-[#0B0B0B]">
                &ldquo;{study.quote.text}&rdquo;
              </p>
              <footer className="mt-3 sm:mt-4 flex items-center gap-2.5 sm:gap-3 min-w-0">
                <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0A1F6B] text-[#D9C4A8] font-mono text-[11px] sm:text-[12px] font-semibold shrink-0">
                  {study.quote.initials}
                </span>
                <div className="min-w-0">
                  <span className="block text-[13px] sm:text-[14px] font-medium text-[#0B0B0B] truncate">
                    {study.quote.author}
                  </span>
                  <span className="block text-[11.5px] sm:text-[12.5px] text-[#0B0B0B]/65 truncate">
                    {study.quote.role}
                  </span>
                </div>
              </footer>
            </blockquote>

            {/* What's Next */}
            <div className="w-full min-w-0 rounded-[6px] bg-white border border-[#0B0B0B]/15 p-3.5 sm:p-6">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#0B2FA8]">
                What&rsquo;s Next
              </span>
              <p className="mt-1.5 sm:mt-2 text-[13.5px] sm:text-[15px] leading-[1.55] sm:leading-[1.6] text-[#0B0B0B]/75">
                {study.whatsNext}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prev/Next + Related 2 Cards + CTA */}
      <section className="mx-1.5 sm:mx-5 mt-3 sm:mt-6 mb-3 sm:mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-10">
        <div className="w-full max-w-[1160px] mx-auto min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 pb-6 sm:pb-10 border-b border-[#0B0B0B]/15">
            {prevStudy ? (
              <Link
                to={`/customers/${prevStudy.slug}`}
                className="w-full min-w-0 rounded-[6px] bg-white border border-[#0B0B0B]/15 hover:border-[#0B2FA8] p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-[#0B2FA8] shrink-0" />
                <div className="min-w-0">
                  <span className="block font-mono text-[9.5px] sm:text-[10px] uppercase text-[#0B0B0B]/50">
                    Previous customer
                  </span>
                  <span className="block text-[14px] sm:text-[15px] font-medium text-[#0B0B0B] truncate">
                    {prevStudy.company}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {nextStudy ? (
              <Link
                to={`/customers/${nextStudy.slug}`}
                className="w-full min-w-0 rounded-[6px] bg-white border border-[#0B0B0B]/15 hover:border-[#0B2FA8] p-3 sm:p-4 flex items-center justify-end gap-2.5 sm:gap-3 text-right transition-colors"
              >
                <div className="min-w-0">
                  <span className="block font-mono text-[9.5px] sm:text-[10px] uppercase text-[#0B0B0B]/50">
                    Next customer
                  </span>
                  <span className="block text-[14px] sm:text-[15px] font-medium text-[#0B0B0B] truncate">
                    {nextStudy.company}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#0B2FA8] shrink-0" />
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
          </div>

          <div className="mt-6 sm:mt-10 min-w-0">
            <h2 className="headline-display text-[22px] leading-[1.12] sm:text-[36px] text-[#0B0B0B] mb-4 sm:mb-6">
              More customer <span className="headline-serif-accent">stories</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-3 sm:gap-6">
              {relatedStudies.map((rs, idx) => (
                <CaseStudyCard key={rs.slug} study={rs} index={idx} />
              ))}
            </div>
          </div>

          <div className="mt-6 sm:mt-10 rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] text-white p-4 sm:p-8 flex flex-wrap items-center justify-between gap-3 sm:gap-4 min-w-0">
            <div className="min-w-0">
              <h3 className="text-[18px] sm:text-[26px] font-medium tracking-[-0.02em] leading-snug">
                Ready to trace your production agents?
              </h3>
              <p className="mt-1 text-[12.5px] sm:text-[14px] text-white/75 leading-snug">
                Launch the live browser sandbox or schedule 30 minutes with an engineer.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
              <Button label="Try Sandbox" variant="sand" to="/demo/sandbox" />
              <Button label="Book a Demo" variant="secondary" to="/demo" />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};