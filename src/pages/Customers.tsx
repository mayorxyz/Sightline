import React, {useMemo, useState} from 'react';
import {PageHeader} from '../components/PageHeader';
import {LogoMarquee} from '../components/LogoMarquee';
import {Button} from '../components/Button';
import {SectionTag} from '../components/SectionTag';
import {StatChip} from '../components/StatChip';
import {Footer} from '../components/Footer';
import {CategoryChips} from '../components/resources/CategoryChips';
import {TestimonialSlider} from '../components/testimonials/TestimonialSlider';
import {CaseStudyCard} from '../components/company/CaseStudyCard';
import {
  CASE_STUDIES,
  CUSTOMERS_AGGREGATE_STATS,
  IndustryCategory,
} from '../lib/companyContent';
import {useInView} from '../hooks/useInView';

const INDUSTRIES: IndustryCategory[] = ['All', 'Support', 'Engineering', 'Sales', 'Finance'];

export const Customers: React.FC = () => {
  const [industry, setIndustry] = useState<IndustryCategory>('All');
  const {ref: statsRef, inView: statsInView} = useInView<HTMLElement>({
    threshold: 0.2,
    once: true,
  });

  const featured = useMemo(
    () => CASE_STUDIES.find((c) => c.featured) ?? CASE_STUDIES[0],
    []
  );

  const filteredStudies = useMemo(
    () =>
      industry === 'All'
        ? CASE_STUDIES
        : CASE_STUDIES.filter((c) => c.industry === industry),
    [industry]
  );

  return (
    <main className="pb-4">
      <PageHeader
        tag="Customers"
        lines={[
          <>
            Teams That Ship With <span className="headline-serif-accent">Confidence</span>
          </>,
        ]}
        subtitle="How engineering organizations monitor live agents, prevent cost spikes, and debug regressions fast."
      />

      {/* Logo Bar */}
      <section className="mx-3 sm:mx-5 mt-6 mb-6 border border-[#0B0B0B]/20 py-6 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto">
          <LogoMarquee />
        </div>
      </section>

      {/* Featured Case Study: Lumen Labs */}
      <section className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto rounded-[8px] bg-[#0A1F6B] text-white p-5 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-stretch lg:items-center min-w-0">
          <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5 min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="px-2 py-1 sm:px-2.5 rounded-[2px] bg-[#D9C4A8] text-[#0A1F6B] font-mono text-[10px] sm:text-[11px] font-semibold uppercase">
                Featured Story · {featured.industry}
              </span>
              <span className="font-mono text-[13px] text-white/75">{featured.company}</span>
            </div>

            <blockquote className="text-[21px] sm:text-[28px] lg:text-[32px] font-medium tracking-[-0.02em] leading-[1.18] sm:leading-[1.2] break-words">
              &ldquo;{featured.quote.text}&rdquo;
            </blockquote>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0B2FA8] text-[#D9C4A8] font-mono text-[12px] font-semibold">
                {featured.quote.initials}
              </span>
              <div>
                <div className="text-[14px] font-medium text-white">{featured.quote.author}</div>
                <div className="text-[12.5px] text-white/65">{featured.quote.role}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-[6px] bg-white/10 border border-white/15 p-4 sm:p-6 lg:p-8 flex flex-col justify-between gap-4 sm:gap-6 min-w-0">
            <div>
              <span className="block font-mono text-[11px] uppercase tracking-[0.08em] text-[#D9C4A8]">
                Verified Impact
              </span>
              <div className="mt-2 font-mono text-[34px] sm:text-[40px] lg:text-[48px] font-medium tracking-[-0.03em] text-white leading-[1.02] break-words">
                {featured.headlineMetric}
              </div>
              <p className="mt-2.5 sm:mt-3 text-[13.5px] sm:text-[14.5px] leading-[1.55] sm:leading-[1.6] text-white/75">{featured.summary}</p>
            </div>

            <div className="w-full sm:w-auto [&>div]:w-full sm:[&>div]:w-auto [&>div>a]:w-full sm:[&>div>a]:w-auto">
              <Button
                label="Read Case Study"
                variant="sand"
                to={`/customers/${featured.slug}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Industry Filter + Case Study Grid */}
      <section className="mx-3 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
            <div>
              <SectionTag label="Case Studies" />
              <h2 className="mt-3 sm:mt-4 headline-display text-[28px] sm:text-[48px] leading-[1.02] text-[#0B0B0B]">
                Production <span className="headline-serif-accent">results</span> by team
              </h2>
            </div>

            <CategoryChips
              categories={INDUSTRIES}
              selected={industry}
              onSelect={setIndustry}
              layoutGroupId="customers-industry-filter"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredStudies.map((study, idx) => (
              <CaseStudyCard key={study.slug} study={study} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Aggregate Metrics Row */}
      <section
        ref={statsRef}
        className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-10 px-3 sm:px-6 lg:px-10"
      >
        <div className="max-w-[1360px] mx-auto rounded-[8px] bg-[#0A1F6B] text-white p-5 sm:p-7 lg:p-9 flex flex-col sm:flex-wrap sm:flex-row items-start sm:items-center justify-between gap-5 min-w-0">
          <div>
            <span className="block font-mono text-[11px] uppercase tracking-[0.08em] text-[#D9C4A8] mb-1.5">
              Aggregate Customer Benchmarks
            </span>
            <h2 className="text-[20px] sm:text-[28px] leading-[1.15] font-medium tracking-[-0.02em]">
              Measured across 140+ production workspaces
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto min-w-0">
            {CUSTOMERS_AGGREGATE_STATS.map((stat, idx) => (
              <StatChip
                key={stat.label}
                target={stat.target}
                decimals={stat.decimals}
                suffix={stat.suffix}
                label={stat.label}
                active={statsInView}
                delayMs={80 + idx * 90}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Customer Quote Slider */}
      <section className="mx-3 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto rounded-[8px] bg-[#0A1F6B] p-4 sm:p-10 lg:p-12 min-w-0">
          <TestimonialSlider />
        </div>
      </section>

      {/* CTA Band */}
      <section className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto rounded-[8px] bg-[#D9C4A8]/55 border border-[#0B0B0B]/15 p-5 sm:p-10 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-4 sm:gap-6 min-w-0">
          <div>
            <h2 className="headline-display text-[28px] sm:text-[42px] leading-[1.02] text-[#0B0B0B]">
              Ship your next agent <span className="headline-serif-accent">release</span> safely
            </h2>
            <p className="mt-2 text-[15px] text-[#0B0B0B]/70 max-w-[520px]">
              Start free with 10k monthly traces or book a technical walkthrough with our team.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button label="Try Sandbox" variant="primary" to="/demo/sandbox" />
            <Button label="Book a Demo" variant="secondary" to="/demo" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Customers;
