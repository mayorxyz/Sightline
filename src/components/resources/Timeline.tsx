import React, {useEffect, useMemo, useRef, useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {motion} from 'framer-motion';
import {
  CHANGELOG_ENTRIES,
  ChangelogCategory,
} from '../../lib/resourcesContent';
import {CategoryChips} from './CategoryChips';
import {useReducedMotion} from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

type FilterCat = 'All' | ChangelogCategory;
const FILTER_CATS: FilterCat[] = ['All', 'New', 'Improved', 'Fixed'];

export const Timeline: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  const [selectedCat, setSelectedCat] = useState<FilterCat>('All');
  const [visibleCount, setVisibleCount] = useState<number>(5);

  const filtered = useMemo(() => {
    if (selectedCat === 'All') return CHANGELOG_ENTRIES;
    return CHANGELOG_ENTRIES.filter((entry) => entry.categories.includes(selectedCat));
  }, [selectedCat]);

  const visibleEntries = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    if (reducedMotion || !containerRef.current || !lineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        {scaleY: 0},
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: 'bottom 65%',
            scrub: 0.4,
          },
        }
      );
    }, containerRef);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [reducedMotion, visibleEntries.length, selectedCat]);

  return (
    <section className="mx-2 sm:mx-5 mt-6 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10">
      <div className="max-w-[960px] mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 sm:pb-8 border-b border-[#0B0B0B]/15">
          <CategoryChips
            categories={FILTER_CATS}
            selected={selectedCat}
            onSelect={(cat) => {
              setSelectedCat(cat);
              setVisibleCount(5);
            }}
            layoutGroupId="changelog-cat-pill"
          />

          <span className="font-mono text-[11px] sm:text-[12px] text-[#0B0B0B]/60 tabular-nums">
            Showing {visibleEntries.length} of {filtered.length} releases
          </span>
        </div>

        <div ref={containerRef} className="relative mt-8 sm:mt-10 pl-6 sm:pl-12">
          {/* Vertical Scroll-Linked Cobalt Line */}
          <div
            aria-hidden="true"
            className="absolute left-1.5 sm:left-4 top-2 bottom-2 w-[2px] bg-[#0B0B0B]/12"
          >
            <div
              ref={lineRef}
              style={{transformOrigin: 'top center'}}
              className="w-full h-full bg-[#0B2FA8]"
            />
          </div>

          <div className="flex flex-col gap-6 sm:gap-8">
            {visibleEntries.map((entry, idx) => (
              <motion.article
                key={entry.version}
                initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.2}}
                transition={{
                  duration: reducedMotion ? 0 : 0.45,
                  delay: reducedMotion ? 0 : idx * 0.05,
                }}
                className="relative rounded-[6px] sm:rounded-[8px] bg-white border border-[#0B0B0B]/15 p-4 sm:p-6"
              >
                {/* Node Dot */}
                <span
                  aria-hidden="true"
                  className="absolute -left-[21px] sm:-left-[39px] top-6 sm:top-7 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-[2px] bg-[#0B2FA8] border-2 border-[#E9E8E6]"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 sm:px-2.5 py-0.5 rounded-[2px] bg-[#0A1F6B] text-[#D9C4A8] font-mono text-[10px] sm:text-[11.5px] font-medium">
                      {entry.version}
                    </span>
                    <span className="font-mono text-[11px] sm:text-[12px] text-[#0B0B0B]/55">{entry.date}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {entry.categories.map((cat) => (
                      <span
                        key={cat}
                        className={`px-1.5 sm:px-2 py-0.5 rounded-[2px] font-mono text-[9px] sm:text-[10.5px] border ${
                          cat === 'New'
                            ? 'bg-[#0B2FA8]/10 text-[#0B2FA8] border-[#0B2FA8]/25'
                            : cat === 'Improved'
                              ? 'bg-[#D9C4A8]/50 text-[#0B0B0B] border-[#0B0B0B]/15'
                              : 'bg-[#0B0B0B]/6 text-[#0B0B0B]/75 border-[#0B0B0B]/15'
                        }`}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <h2 className="text-[18px] sm:text-[22px] font-medium tracking-[-0.02em] text-[#0B0B0B]">
                  {entry.title}
                </h2>
                <p className="mt-1.5 sm:mt-2 text-[13px] sm:text-[14.5px] leading-[1.6] text-[#0B0B0B]/75">{entry.body}</p>

                {entry.previewTag && (
                  <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 rounded-[4px] bg-[#06154D] px-2.5 sm:px-3 py-1 sm:py-1.5 font-mono text-[10px] sm:text-[11.5px] text-[#D9C4A8]">
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#4ADE80]" />
                    <span>{entry.previewTag}</span>
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </div>

        {hasMore && (
          <div className="mt-8 sm:mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount(filtered.length)}
              className="rounded-[2px] bg-[#0B2FA8] hover:bg-[#0A1F6B] text-white text-[12px] sm:text-[13.5px] font-medium px-5 sm:px-6 py-2.5 sm:py-3 transition-colors cursor-pointer"
            >
              Load more releases
            </button>
          </div>
        )}
      </div>
    </section>
  );
};