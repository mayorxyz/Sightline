import React, {useEffect, useRef, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';
import {ArrowUpRight} from 'lucide-react';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {
  DesktopCompanyDropdown,
  DesktopProductDropdown,
  DesktopResourcesDropdown,
  MobileCompanyAccordion,
  MobileProductAccordion,
  MobileResourcesAccordion,
} from './product/NavDropdown';

const NAV_LINKS = [
  {label: 'Home', to: '/'},
  {label: 'Product', to: '/product'},
  {label: 'Pricing', to: '/pricing'},
  {label: 'Resources', to: '/resources'},
  {label: 'Company', to: '/about'},
  {label: 'Demo', to: '/demo'},
];

const isActivePath = (pathname: string, to: string) =>
  to === '/'
    ? pathname === '/'
    : pathname === to || pathname.startsWith(`${to}/`);

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onOutside = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('touchstart', onOutside, {passive: true});
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('touchstart', onOutside);
    };
  }, [menuOpen]);

  if (location.pathname.startsWith('/demo/sandbox')) {
    return null;
  }

  const closeMenu = () => setMenuOpen(false);
  const scrollTopIfHome = (to: string) => {
    if (to === '/' && location.pathname === '/') {
      window.scrollTo({top: 0, behavior: reducedMotion ? 'auto' : 'smooth'});
    }
  };

  const rowMotion = (index: number) => ({
    initial: reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: -8},
    animate: {opacity: 1, y: 0},
    transition: {
      duration: reducedMotion ? 0 : 0.28,
      delay: reducedMotion ? 0 : 0.04 + index * 0.04,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  });

  return (
    <div className="fixed top-3 md:top-6 left-0 right-0 z-50 flex justify-center px-3 md:px-4 pointer-events-none">
      <div
        ref={wrapRef}
        className="relative w-full max-w-[560px] lg:max-w-[780px] pointer-events-auto"
      >
        <motion.header
          initial={reducedMotion ? {y: 0, opacity: 1} : {y: '-100%', opacity: 0}}
          animate={{
            y: 0,
            opacity: 1,
            scale: scrolled && !reducedMotion ? 0.97 : 1,
          }}
          transition={{
            y: {duration: 0.65, ease: [0.16, 1, 0.3, 1]},
            opacity: {duration: 0.45},
            scale: {duration: 0.25, ease: [0.16, 1, 0.3, 1]},
          }}
          className={`flex items-center justify-between gap-4 lg:gap-6 bg-white text-[#0B0B0B] rounded-[6px] border border-[#0B0B0B]/10 shadow-[0_10px_30px_rgba(10,31,107,0.14)] transition-[padding] duration-200 px-3 sm:px-4 ${
            scrolled ? 'py-1.5' : 'py-2'
          }`}
        >
          <Link
            to="/"
            onClick={() => scrollTopIfHome('/')}
            className="flex items-center gap-2 text-[16px] font-semibold tracking-[-0.03em] text-[#0B0B0B] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#0B2FA8]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
              <path
                d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z"
                stroke="#0B0B0B"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="3" fill="#0B2FA8" />
            </svg>
            <span>Sightline</span>
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-5 text-[13px] font-medium text-[#0B0B0B]/75"
          >
            {NAV_LINKS.map((item) => {
              if (item.to === '/product') return <DesktopProductDropdown key={item.to} />;
              if (item.to === '/resources') return <DesktopResourcesDropdown key={item.to} />;
              if (item.to === '/about') return <DesktopCompanyDropdown key={item.to} />;
              const active = isActivePath(location.pathname, item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => scrollTopIfHome(item.to)}
                  className={`relative whitespace-nowrap shrink-0 py-1 transition-colors duration-150 hover:text-[#0B2FA8] ${
                    active ? 'text-[#0B2FA8]' : ''
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active-underline"
                      transition={
                        reducedMotion ? {duration: 0} : {type: 'spring', stiffness: 420, damping: 32}
                      }
                      className="absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-[#0B2FA8]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile / tablet toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-dropdown"
            className="lg:hidden relative inline-flex items-center justify-center w-10 h-10 bg-[#0B2FA8] hover:bg-[#0A1F6B] text-white rounded-[4px] transition-colors duration-150 shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B2FA8]"
          >
            <span
              className={`absolute block w-[18px] h-[1.5px] bg-white transition-transform duration-200 ${
                menuOpen ? 'rotate-45' : '-translate-y-[3.5px]'
              }`}
            />
            <span
              className={`absolute block w-[18px] h-[1.5px] bg-white transition-transform duration-200 ${
                menuOpen ? '-rotate-45' : 'translate-y-[3.5px]'
              }`}
            />
          </button>
        </motion.header>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-nav-dropdown"
              role="dialog"
              aria-label="Site navigation"
              initial={reducedMotion ? {opacity: 1} : {opacity: 0, y: -8, scaleY: 0.96}}
              animate={{opacity: 1, y: 0, scaleY: 1}}
              exit={reducedMotion ? {opacity: 0} : {opacity: 0, y: -8, scaleY: 0.96}}
              transition={{duration: reducedMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1]}}
              style={{transformOrigin: 'top'}}
              className="lg:hidden absolute left-0 right-0 top-full mt-2 bg-[#0A1F6B] text-white rounded-[6px] border border-white/10 shadow-[0_20px_50px_rgba(10,31,107,0.35)] overflow-hidden"
            >
              <nav
                aria-label="Mobile navigation"
                className="max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain px-4 pt-2 pb-1"
              >
                {NAV_LINKS.map((item, index) => {
                  let content: React.ReactNode;

                  if (item.to === '/product') {
                    content = <MobileProductAccordion onNavigate={closeMenu} />;
                  } else if (item.to === '/resources') {
                    content = <MobileResourcesAccordion indexNumber={`0${index + 1}`} onNavigate={closeMenu} />;
                  } else if (item.to === '/about') {
                    content = <MobileCompanyAccordion indexNumber={`0${index + 1}`} onNavigate={closeMenu} />;
                  } else {
                    const active = isActivePath(location.pathname, item.to);
                    content = (
                      <Link
                        to={item.to}
                        onClick={() => {
                          scrollTopIfHome(item.to);
                          closeMenu();
                        }}
                        className={`group flex items-center gap-3 py-3.5 text-[22px] font-medium tracking-[-0.03em] leading-none transition-colors ${
                          active ? 'text-[#D9C4A8]' : 'text-white hover:text-[#D9C4A8]'
                        }`}
                      >
                        <span className="flex-1">{item.label}</span>
                        <ArrowUpRight
                          className="w-5 h-5 text-[#D9C4A8] opacity-60 group-hover:opacity-100 transition-opacity"
                          strokeWidth={1.75}
                        />
                      </Link>
                    );
                  }

                  return (
                    <motion.div
                      key={item.to}
                      {...rowMotion(index)}
                      className={index < NAV_LINKS.length - 1 ? 'border-b border-white/10' : ''}
                    >
                      {content}
                    </motion.div>
                  );
                })}
              </nav>

              <div className="flex items-center justify-between gap-3 border-t border-white/15 px-4 py-3 text-[12px] text-white/70">
                <span className="truncate">AI Agent Observability &amp; Evaluation</span>
                <span className="shrink-0">hello@Sightline.dev</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};