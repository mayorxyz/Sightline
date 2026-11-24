import React, {useEffect, useState} from 'react';
import {LegalSection} from '../../lib/legalContent';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface LegalTocProps {
  sections: LegalSection[];
}

export const LegalToc: React.FC<LegalTocProps> = ({sections}) => {
  const reducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');

  useEffect(() => {
    setActiveId(sections[0]?.id ?? '');
    if (typeof IntersectionObserver === 'undefined' || sections.length === 0) return;

    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-18% 0px -65% 0px',
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const handleJump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({behavior: reducedMotion ? 'auto' : 'smooth', block: 'start'});
      setActiveId(id);
    }
  };

  return (
    <nav
      aria-label="On this page"
      className="rounded-[8px] bg-white border border-[#0B0B0B]/15 p-4 sm:p-5"
    >
      <span className="block font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.08em] text-[#0B2FA8] mb-3">
        On this page
      </span>
      <ul className="flex flex-col gap-1">
        {sections.map((sec) => {
          const isActive = activeId === sec.id;
          return (
            <li key={sec.id}>
              <a
                href={`#${sec.id}`}
                onClick={(e) => handleJump(e, sec.id)}
                aria-current={isActive ? 'location' : undefined}
                className={`flex items-center gap-2 sm:gap-2.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-[4px] text-xs sm:text-[13px] transition-colors ${
                  isActive
                    ? 'bg-[#0B2FA8] text-white font-medium'
                    : 'text-[#0B0B0B]/70 hover:bg-[#E9E8E6] hover:text-[#0B0B0B]'
                }`}
              >
                <span
                  className={`font-mono text-[9px] sm:text-[11px] tabular-nums shrink-0 ${
                    isActive ? 'text-[#D9C4A8]' : 'text-[#0B0B0B]/45'
                  }`}
                >
                  {sec.number}
                </span>
                <span className="truncate">{sec.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};