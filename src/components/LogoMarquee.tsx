import React from 'react';

interface PartnerLogo {
  name: string;
  renderMark: () => React.ReactNode;
}

const LOGOS: PartnerLogo[] = [
  {
    name: 'Northwind',
    renderMark: () => (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 15L10 3L17 15H12.5L10 10.5L7.5 15H3Z" fill="#0B0B0B" />
      </svg>
    ),
  },
  {
    name: 'Lumen Labs',
    renderMark: () => (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="6.5" stroke="#0B0B0B" strokeWidth="2" />
        <circle cx="10" cy="10" r="2.2" fill="#0B0B0B" />
      </svg>
    ),
  },
  {
    name: 'Kestrel',
    renderMark: () => (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M4 4H10L16 10L10 16H4L10 10L4 4Z" fill="#0B0B0B" />
      </svg>
    ),
  },
  {
    name: 'Halcyon',
    renderMark: () => (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="5" height="12" rx="1" fill="#0B0B0B" />
        <rect x="12" y="4" width="5" height="12" rx="1" fill="#0B0B0B" />
        <rect x="6" y="8.5" width="8" height="3" fill="#0B0B0B" />
      </svg>
    ),
  },
  {
    name: 'Brightpath',
    renderMark: () => (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M3 13C6 13 7 6 10 6C13 6 14 13 17 13"
          stroke="#0B0B0B"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="10" cy="14.5" r="1.8" fill="#0B0B0B" />
      </svg>
    ),
  },
  {
    name: 'Orbital',
    renderMark: () => (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <ellipse
          cx="10"
          cy="10"
          rx="7.5"
          ry="3.6"
          transform="rotate(-28 10 10)"
          stroke="#0B0B0B"
          strokeWidth="1.9"
        />
        <circle cx="10" cy="10" r="2.1" fill="#0B0B0B" />
      </svg>
    ),
  },
  {
    name: 'Meridian',
    renderMark: () => (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 15V5L10 11L17 5V15" stroke="#0B0B0B" strokeWidth="2.1" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export const LogoMarquee: React.FC = () => {
  const renderLogos = () =>
    LOGOS.map((logo) => (
      <div
        key={logo.name}
        className="flex items-center justify-center gap-2.5 min-w-[164px] sm:min-w-[184px] h-12 px-5 rounded-[4px] bg-[#D9C4A8]/72 backdrop-blur-md border border-white/30 text-[#0B0B0B] shadow-[0_4px_16px_rgba(10,31,107,0.08)] transition-colors duration-200 hover:bg-[#D9C4A8]/90 select-none shrink-0"
      >
        {logo.renderMark()}
        <span className="text-[14px] font-semibold tracking-[-0.02em] whitespace-nowrap">
          {logo.name}
        </span>
      </div>
    ));

  return (
    <div
      className="marquee-wrapper relative w-full overflow-hidden py-1"
      aria-label="Trusted AI engineering teams"
    >
      <div className="animate-marquee flex w-max items-center gap-4">
        <div className="flex shrink-0 items-center gap-4" aria-hidden="true">
          {renderLogos()}
        </div>
        <div className="flex shrink-0 items-center gap-4" aria-hidden="true">
          {renderLogos()}
        </div>
      </div>
    </div>
  );
};
