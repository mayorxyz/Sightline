import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {PRICING_SUBNAV_LINKS} from '../../../lib/pricingContent';

export const PricingSubNav: React.FC = () => {
  const {pathname} = useLocation();

  return (
    <div className="mx-3 sm:mx-5 mt-6">
      <nav
        aria-label="Pricing sections"
        className="max-w-[1360px] mx-auto flex flex-wrap items-center gap-2 rounded-[6px] bg-white border border-[#0B0B0B]/15 px-3 py-2.5"
      >
        <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#0B0B0B]/50 px-2 mr-1 hidden sm:inline">
          Pricing Tools
        </span>
        {PRICING_SUBNAV_LINKS.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? 'page' : undefined}
              className={`px-3.5 py-1.5 rounded-[3px] text-[13px] font-medium transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#0B2FA8] ${
                active
                  ? 'bg-[#0B2FA8] text-white'
                  : 'bg-[#E9E8E6]/70 text-[#0B0B0B]/75 hover:bg-[#D9C4A8]/50 hover:text-[#0B0B0B]'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
