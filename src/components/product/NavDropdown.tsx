import React, {useEffect, useRef, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';
import {
  Activity,
  BellRing,
  CheckCircle2,
  ChevronDown,
  LineChart,
  Plug,
  ShieldCheck,
  ArrowUpRight,
  BookOpen,
  FileText,
  History,
  Building2,
  Users,
  Mail,
} from 'lucide-react';
import {PRODUCT_NAV_ITEMS, ProductIconKey} from '../../lib/productContent';
import {RESOURCES_NAV_ITEMS, ResourcesIconKey} from '../../lib/resourcesContent';
import {COMPANY_NAV_ITEMS, CompanyNavIconKey} from '../../lib/companyContent';
import {useReducedMotion} from '../../hooks/useReducedMotion';

export const ProductIcon: React.FC<{id: ProductIconKey; className?: string}> = ({
  id,
  className = 'w-4 h-4',
}) => {
  switch (id) {
    case 'tracing':
      return <Activity className={className} strokeWidth={2} />;
    case 'evals':
      return <CheckCircle2 className={className} strokeWidth={2} />;
    case 'cost':
      return <LineChart className={className} strokeWidth={2} />;
    case 'alerts':
      return <BellRing className={className} strokeWidth={2} />;
    case 'security':
      return <ShieldCheck className={className} strokeWidth={2} />;
    case 'integrations':
      return <Plug className={className} strokeWidth={2} />;
  }
};

export const DesktopProductDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  const isActive = location.pathname.startsWith('/product');

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openMenu = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => setOpen(false), 140);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocus={openMenu}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
      className="relative"
    >
      <Link
        to="/product"
        aria-expanded={open}
        className={`relative inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-1 transition-colors duration-150 hover:text-[#0B2FA8] ${
          isActive ? 'text-[#0B2FA8]' : ''
        }`}
      >
        <span>Product</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
        {isActive && (
          <motion.span
            layoutId="nav-active-underline"
            transition={
              reducedMotion
                ? {duration: 0}
                : {type: 'spring', stiffness: 420, damping: 32}
            }
            className="absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-[#0B2FA8]"
          />
        )}
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reducedMotion ? {opacity: 1} : {opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={reducedMotion ? {opacity: 0} : {opacity: 0, y: 6}}
            transition={{duration: reducedMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1]}}
            className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+12px)] w-[540px] rounded-[8px] bg-white border border-[#0B0B0B]/12 shadow-[0_24px_60px_rgba(10,31,107,0.18)] p-3 z-50"
          >
            <div className="flex items-center justify-between px-3 py-2 mb-1.5 border-b border-[#0B0B0B]/10">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#0B0B0B]/55">
                Platform Modules
              </span>
              <Link
                to="/product"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0B2FA8] hover:underline"
              >
                <span>Product Hub</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {PRODUCT_NAV_ITEMS.map((item) => {
                const subActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-start gap-3 p-2.5 rounded-[6px] transition-colors ${
                      subActive
                        ? 'bg-[#0B2FA8]/8 text-[#0B2FA8]'
                        : 'hover:bg-[#E9E8E6]/70 text-[#0B0B0B]'
                    }`}
                  >
                    <span className="mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-[4px] bg-[#0B2FA8] text-white shrink-0">
                      <ProductIcon id={item.id} className="w-4 h-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-medium leading-tight">
                        {item.title}
                      </span>
                      <span className="block text-[11.5px] text-[#0B0B0B]/65 mt-0.5 leading-snug">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MobileProductAccordion: React.FC<{onNavigate: () => void}> = ({onNavigate}) => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const isActive = location.pathname.startsWith('/product');

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between gap-4 py-3.5">
        <Link
          to="/product"
          onClick={onNavigate}
          className={`group inline-flex items-center gap-3 text-xl sm:text-[22px] font-medium tracking-[-0.03em] leading-none transition-colors ${
            isActive ? 'text-[#D9C4A8]' : 'text-white hover:text-[#D9C4A8]'
          }`}
        >
          <span>Product</span>
        </Link>

        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          aria-label="Toggle product sub-pages"
          className="inline-flex items-center justify-center w-9 h-9 rounded-[4px] bg-white/10 text-white hover:bg-white/20 cursor-pointer"
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 'auto'}}
            exit={{opacity: 0, height: 0}}
            transition={{duration: 0.24}}
            className="overflow-hidden pl-9 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            {PRODUCT_NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                onClick={onNavigate}
                className={`flex items-center gap-2.5 py-2 px-3 rounded-[4px] text-sm sm:text-[15px] transition-colors ${
                  location.pathname === item.to
                    ? 'bg-[#D9C4A8] text-[#0A1F6B] font-medium'
                    : 'bg-white/5 text-white/85 hover:bg-white/15'
                }`}
              >
                <ProductIcon id={item.id} className="w-4 h-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ResourcesIcon: React.FC<{id: ResourcesIconKey; className?: string}> = ({
  id,
  className = 'w-4 h-4',
}) => {
  switch (id) {
    case 'docs':
      return <BookOpen className={className} strokeWidth={2} />;
    case 'blog':
      return <FileText className={className} strokeWidth={2} />;
    case 'changelog':
      return <History className={className} strokeWidth={2} />;
  }
};

export const DesktopResourcesDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  const isActive = location.pathname.startsWith('/resources');

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openMenu = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => setOpen(false), 140);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocus={openMenu}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
      className="relative"
    >
      <Link
        to="/resources"
        aria-expanded={open}
        className={`relative inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-1 transition-colors duration-150 hover:text-[#0B2FA8] ${
          isActive ? 'text-[#0B2FA8]' : ''
        }`}
      >
        <span>Resources</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
        {isActive && (
          <motion.span
            layoutId="nav-active-underline"
            transition={
              reducedMotion
                ? {duration: 0}
                : {type: 'spring', stiffness: 420, damping: 32}
            }
            className="absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-[#0B2FA8]"
          />
        )}
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reducedMotion ? {opacity: 1} : {opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={reducedMotion ? {opacity: 0} : {opacity: 0, y: 6}}
            transition={{duration: reducedMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1]}}
            className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+12px)] w-[360px] rounded-[8px] bg-white border border-[#0B0B0B]/12 shadow-[0_24px_60px_rgba(10,31,107,0.18)] p-3 z-50"
          >
            <div className="flex items-center justify-between px-3 py-2 mb-1.5 border-b border-[#0B0B0B]/10">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#0B0B0B]/55">
                Library
              </span>
              <Link
                to="/resources"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0B2FA8] hover:underline"
              >
                <span>Resources Hub</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex flex-col gap-1">
              {RESOURCES_NAV_ITEMS.map((item) => {
                const subActive = location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-start gap-3 p-2.5 rounded-[6px] transition-colors ${
                      subActive
                        ? 'bg-[#0B2FA8]/8 text-[#0B2FA8]'
                        : 'hover:bg-[#E9E8E6]/70 text-[#0B0B0B]'
                    }`}
                  >
                    <span className="mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-[4px] bg-[#0B2FA8] text-white shrink-0">
                      <ResourcesIcon id={item.id} className="w-4 h-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-medium leading-tight">
                        {item.title}
                      </span>
                      <span className="block text-[11.5px] text-[#0B0B0B]/65 mt-0.5 leading-snug">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MobileResourcesAccordion: React.FC<{
  indexNumber: string;
  onNavigate: () => void;
}> = ({indexNumber, onNavigate}) => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const isActive = location.pathname.startsWith('/resources');

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between gap-4 py-3.5">
        <Link
          to="/resources"
          onClick={onNavigate}
          className={`group inline-flex items-center gap-3 text-xl sm:text-[22px] font-medium tracking-[-0.03em] leading-none transition-colors ${
            isActive ? 'text-[#D9C4A8]' : 'text-white hover:text-[#D9C4A8]'
          }`}
        >
          <span>Resources</span>
        </Link>

        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          aria-label="Toggle resources sub-pages"
          className="inline-flex items-center justify-center w-9 h-9 rounded-[4px] bg-white/10 text-white hover:bg-white/20 cursor-pointer"
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 'auto'}}
            exit={{opacity: 0, height: 0}}
            transition={{duration: 0.24}}
            className="overflow-hidden pl-9 mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2"
          >
            {RESOURCES_NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                onClick={onNavigate}
                className={`flex items-center gap-2.5 py-2 px-3 rounded-[4px] text-sm sm:text-[15px] transition-colors ${
                  location.pathname.startsWith(item.to)
                    ? 'bg-[#D9C4A8] text-[#0A1F6B] font-medium'
                    : 'bg-white/5 text-white/85 hover:bg-white/15'
                }`}
              >
                <ResourcesIcon id={item.id} className="w-4 h-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CompanyIcon: React.FC<{id: CompanyNavIconKey; className?: string}> = ({
  id,
  className = 'w-4 h-4',
}) => {
  switch (id) {
    case 'about':
      return <Building2 className={className} strokeWidth={2} />;
    case 'customers':
      return <Users className={className} strokeWidth={2} />;
    case 'contact':
      return <Mail className={className} strokeWidth={2} />;
  }
};

export const DesktopCompanyDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  const isActive =
    location.pathname === '/about' ||
    location.pathname.startsWith('/customers') ||
    location.pathname === '/contact';

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openMenu = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => setOpen(false), 140);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocus={openMenu}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
      className="relative"
    >
      <Link
        to="/about"
        aria-expanded={open}
        className={`relative inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-1 transition-colors duration-150 hover:text-[#0B2FA8] ${
          isActive ? 'text-[#0B2FA8]' : ''
        }`}
      >
        <span>Company</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
        {isActive && (
          <motion.span
            layoutId="nav-active-underline"
            transition={
              reducedMotion
                ? {duration: 0}
                : {type: 'spring', stiffness: 420, damping: 32}
            }
            className="absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-[#0B2FA8]"
          />
        )}
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reducedMotion ? {opacity: 1} : {opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={reducedMotion ? {opacity: 0} : {opacity: 0, y: 6}}
            transition={{duration: reducedMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1]}}
            className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+12px)] w-[350px] rounded-[8px] bg-white border border-[#0B0B0B]/12 shadow-[0_24px_60px_rgba(10,31,107,0.18)] p-3 z-50"
          >
            <div className="flex items-center justify-between px-3 py-2 mb-1.5 border-b border-[#0B0B0B]/10">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#0B0B0B]/55">
                Organization
              </span>
              <Link
                to="/about"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0B2FA8] hover:underline"
              >
                <span>About Us</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex flex-col gap-1">
              {COMPANY_NAV_ITEMS.map((item) => {
                const subActive =
                  item.to === '/customers'
                    ? location.pathname.startsWith('/customers')
                    : location.pathname === item.to;
                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-start gap-3 p-2.5 rounded-[6px] transition-colors ${
                      subActive
                        ? 'bg-[#0B2FA8]/8 text-[#0B2FA8]'
                        : 'hover:bg-[#E9E8E6]/70 text-[#0B0B0B]'
                    }`}
                  >
                    <span className="mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-[4px] bg-[#0B2FA8] text-white shrink-0">
                      <CompanyIcon id={item.id} className="w-4 h-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-medium leading-tight">
                        {item.title}
                      </span>
                      <span className="block text-[11.5px] text-[#0B0B0B]/65 mt-0.5 leading-snug">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MobileCompanyAccordion: React.FC<{
  indexNumber: string;
  onNavigate: () => void;
}> = ({indexNumber, onNavigate}) => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const isActive =
    location.pathname === '/about' ||
    location.pathname.startsWith('/customers') ||
    location.pathname === '/contact';

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between gap-4 py-3.5">
        <Link
          to="/about"
          onClick={onNavigate}
          className={`group inline-flex items-center gap-3 text-xl sm:text-[22px] font-medium tracking-[-0.03em] leading-none transition-colors ${
            isActive ? 'text-[#D9C4A8]' : 'text-white hover:text-[#D9C4A8]'
          }`}
        >
          <span>Company</span>
        </Link>

        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          aria-label="Toggle company sub-pages"
          className="inline-flex items-center justify-center w-9 h-9 rounded-[4px] bg-white/10 text-white hover:bg-white/20 cursor-pointer"
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 'auto'}}
            exit={{opacity: 0, height: 0}}
            transition={{duration: 0.24}}
            className="overflow-hidden pl-9 mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2"
          >
            {COMPANY_NAV_ITEMS.map((item) => {
              const subActive =
                item.to === '/customers'
                  ? location.pathname.startsWith('/customers')
                  : location.pathname === item.to;
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  onClick={onNavigate}
                  className={`flex items-center gap-2.5 py-2 px-3 rounded-[4px] text-sm sm:text-[15px] transition-colors ${
                    subActive
                      ? 'bg-[#D9C4A8] text-[#0A1F6B] font-medium'
                      : 'bg-white/5 text-white/85 hover:bg-white/15'
                  }`}
                >
                  <CompanyIcon id={item.id} className="w-4 h-4 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};