import React, {useEffect, useState} from 'react';

export interface TocHeading {
  id: string;
  label: string;
}

interface TocProps {
  headings: TocHeading[];
  title?: string;
}

export const Toc: React.FC<TocProps> = ({headings, title = 'On this page'}) => {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? '');

  useEffect(() => {
    setActiveId(headings[0]?.id ?? '');
    if (headings.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {rootMargin: '-96px 0px -55% 0px', threshold: 0.1}
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label={title} className="sticky top-24 lg:top-28 flex flex-col gap-2">
      <span className="font-mono text-[10px] sm:text-[10.5px] uppercase tracking-[0.08em] text-[#0B0B0B]/50 mb-1">
        {title}
      </span>
      <ul className="flex flex-col gap-1 border-l border-[#0B0B0B]/15">
        {headings.map((h) => {
          const active = activeId === h.id;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                aria-current={active ? 'location' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(h.id);
                  el?.scrollIntoView({behavior: 'smooth', block: 'start'});
                  setActiveId(h.id);
                }}
                className={`block pl-3 sm:pl-3.5 py-1 text-[11px] sm:text-[13px] -ml-[1px] border-l-2 transition-colors ${
                  active
                    ? 'border-[#0B2FA8] text-[#0B2FA8] font-medium'
                    : 'border-transparent text-[#0B0B0B]/60 hover:text-[#0B0B0B]'
                }`}
              >
                {h.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};