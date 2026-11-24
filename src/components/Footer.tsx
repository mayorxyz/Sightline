import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Check, ArrowRight, ArrowUp} from 'lucide-react';
import {FOOTER_COLUMNS} from '../lib/mockData';
import {scrollToTopSmooth} from '../hooks/useLenisGsap';
import {useReducedMotion} from '../hooks/useReducedMotion';

export const Footer: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter a valid work email.');
      return;
    }
    setError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="mx-3 sm:mx-5 mb-4 mt-4 rounded-[8px] bg-[#0A1F6B] text-white p-6 sm:p-10 lg:p-12">
      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-10 border-b border-white/15">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2.5 text-[19px] font-semibold tracking-[-0.03em] text-white"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z"
                    stroke="#FFFFFF"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="3" fill="#D9C4A8" />
                </svg>
                <span>Sightline</span>
              </Link>
              <p className="mt-3 text-[14px] leading-[1.6] text-white/70 max-w-[300px]">
                Full traces, automated evals, and cost telemetry built for production AI agents.
              </p>
            </div>

            <div>
              <span className="block text-[12px] font-mono uppercase tracking-[0.08em] text-[#D9C4A8] mb-2">
                Changelog & Releases
              </span>
              {subscribed ? (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-[4px] bg-white/10 border border-white/20 text-[13px] text-[#D9C4A8]">
                  <Check className="w-4 h-4" />
                  <span>Subscribed. Monthly product updates on the way.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-1.5 max-w-[340px]">
                  <div className="flex items-stretch gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="you@company.com"
                      aria-label="Work email for newsletter"
                      className="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-[2px] px-3 py-2 text-[13px] text-white placeholder:text-white/45 focus:outline-none focus:border-[#D9C4A8]"
                    />
                    <button
                      type="submit"
                      aria-label="Subscribe to newsletter"
                      className="inline-flex items-center justify-center px-3.5 rounded-[2px] bg-[#D9C4A8] text-[#0A1F6B] font-medium text-[13px] hover:bg-white transition-colors cursor-pointer shrink-0"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  {error && <span className="text-[12px] text-red-300">{error}</span>}
                </form>
              )}
            </div>
          </div>

          {/* 4 Link Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {FOOTER_COLUMNS.map((col) => {
              const links =
                col.heading === 'Resources'
                  ? [
                      {label: 'Docs', to: '/resources/docs'},
                      {label: 'Blog', to: '/resources/blog'},
                      {label: 'Changelog', to: '/resources/changelog'},
                      {label: 'ROI Calculator', to: '/pricing/roi'},
                    ]
                  : col.heading === 'Company'
                    ? [
                        {label: 'About', to: '/about'},
                        {label: 'Customers', to: '/customers'},
                        {label: 'Contact', to: '/contact'},
                        {label: 'Careers', to: '/about'},
                      ]
                    : col.heading === 'Legal'
                      ? [
                          {label: 'Privacy Policy', to: '/legal/privacy'},
                          {label: 'Terms of Service', to: '/legal/terms'},
                          {label: 'Security Policy', to: '/legal/security'},
                          {label: 'Security Overview', to: '/product/security'},
                        ]
                      : col.links;
              return (
                <div key={col.heading}>
                  <h3 className="text-[12px] font-mono uppercase tracking-[0.08em] text-[#D9C4A8] mb-3.5">
                    {col.heading}
                  </h3>
                  <ul className="flex flex-col gap-2.5 text-[14px]">
                    {links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.to}
                          className="text-white/75 hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Copyright + Back to Top */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-[13px] text-white/60">
          <span>© 2026 Sightline Inc. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <span className="font-mono text-[12px] hidden sm:inline">San Francisco · London</span>
            <button
              type="button"
              onClick={() => scrollToTopSmooth(reducedMotion)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[12px] font-medium transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
