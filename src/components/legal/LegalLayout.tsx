import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUp, Printer} from 'lucide-react';
import {LEGAL_CROSS_LINKS, LegalDocument} from '../../lib/legalContent';
import {SectionTag} from '../SectionTag';
import {RevealText} from '../RevealText';
import {HeroCanvas} from '../HeroCanvas';
import {Footer} from '../Footer';
import {LegalToc} from './LegalToc';
import {scrollToTopSmooth} from '../../hooks/useLenisGsap';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface LegalLayoutProps {
  doc: LegalDocument;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({doc}) => {
  const reducedMotion = useReducedMotion();
  const [readPct, setReadPct] = useState(0);

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
  }, [doc.key]);

  const titlePrefix = doc.title.endsWith(doc.italicWord)
    ? doc.title.slice(0, doc.title.length - doc.italicWord.length).trimEnd()
    : doc.title;

  return (
    <main className="pb-4">
      <div
        aria-hidden="true"
        className="print-hide fixed top-0 left-0 right-0 h-[3px] z-50 bg-transparent pointer-events-none"
      >
        <div
          style={{width: `${readPct}%`}}
          className="h-full bg-[#0B2FA8] transition-[width] duration-75"
        />
      </div>

      <section className="p-3 sm:p-4 pb-0">
        <div className="relative w-full min-h-[200px] sm:min-h-[240px] rounded-[24px] overflow-hidden bg-[#0A1F6B]">
          <div className="print-hide absolute inset-0">
            <HeroCanvas density={0.3} />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#E9E8E6]/95 via-[#E9E8E6]/88 to-[#D9C4A8]/65 backdrop-blur-[1px]"
            />
          </div>

          <div className="relative z-10 max-w-[1360px] mx-auto pt-16 sm:pt-24 pb-8 sm:pb-10 px-4 sm:px-8 lg:px-12 flex flex-wrap items-end justify-between gap-4 sm:gap-6">
            <div>
              <SectionTag label={doc.tag} />
              <RevealText
                as="h1"
                delayBase={0.08}
                className="mt-3 sm:mt-5 text-3xl sm:text-[58px] lg:text-[72px] text-[#0B0B0B]"
                lines={[
                  titlePrefix !== doc.title ? (
                    <>
                      {titlePrefix}{' '}
                      <span className="headline-serif-accent">{doc.italicWord}</span>
                    </>
                  ) : (
                    doc.title
                  ),
                ]}
              />
              <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-[13px] text-[#0B0B0B]/70">
                <span className="font-mono">{doc.lastUpdated}</span>
                <span className="px-2 sm:px-2.5 py-0.5 rounded-[2px] bg-[#D9C4A8]/70 text-[#0A1F6B] font-mono text-[9px] sm:text-[11px] font-medium">
                  {doc.demoNote}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="print-hide inline-flex items-center gap-2 rounded-[2px] bg-white hover:bg-[#0B2FA8] hover:text-white border border-[#0B0B0B]/15 text-[#0B0B0B] text-xs sm:text-[13px] font-medium px-3 sm:px-4 py-2 sm:py-2.5 transition-colors cursor-pointer shrink-0"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>
      </section>

      <section className="mx-3 sm:mx-5 mt-4 sm:mt-6 mb-6 border border-[#0B0B0B]/20 py-6 sm:py-12 px-3 sm:px-6 lg:px-10">
        <div className="max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
          <aside className="print-hide hidden lg:block lg:col-span-4 lg:sticky lg:top-24">
            <LegalToc sections={doc.sections} />
          </aside>

          <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-6">
            {doc.sections.map((sec) => (
              <article
                key={sec.id}
                id={sec.id}
                className="scroll-mt-20 sm:scroll-mt-28 rounded-[8px] bg-white border border-[#0B0B0B]/15 p-4 sm:p-8"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-[3px] bg-[#0B2FA8] text-white font-mono text-[11px] sm:text-[12px] font-medium shrink-0">
                    {sec.number}
                  </span>
                  <h2 className="text-lg sm:text-xl lg:text-[26px] font-medium tracking-[-0.02em] text-[#0B0B0B]">
                    {sec.title}
                  </h2>
                </div>
                <p className="text-sm sm:text-[15.5px] leading-relaxed sm:leading-[1.7] text-[#0B0B0B]/80">{sec.body}</p>
              </article>
            ))}

            <div className="print-hide mt-2 rounded-[8px] bg-[#D9C4A8]/45 border border-[#0B0B0B]/15 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {LEGAL_CROSS_LINKS.map((link) => {
                  const isCurrent = link.key === doc.key;
                  return (
                    <Link
                      key={link.key}
                      to={link.to}
                      aria-current={isCurrent ? 'page' : undefined}
                      className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-[2px] text-xs sm:text-[13px] font-medium transition-colors ${
                        isCurrent
                          ? 'bg-[#0A1F6B] text-white'
                          : 'bg-white border border-[#0B0B0B]/15 text-[#0B0B0B] hover:border-[#0B2FA8] hover:text-[#0B2FA8]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => scrollToTopSmooth(reducedMotion)}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-[2px] bg-[#0B2FA8] hover:bg-[#0A1F6B] text-white text-xs sm:text-[13px] font-medium transition-colors cursor-pointer shrink-0"
              >
                <span className="hidden sm:inline">Back to top</span>
                <span className="sm:hidden">Top</span>
                <ArrowUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};