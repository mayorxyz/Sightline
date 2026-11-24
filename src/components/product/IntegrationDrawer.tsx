import React, {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Check, Copy, X} from 'lucide-react';
import {DetailedIntegration} from '../../lib/productContent';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface IntegrationDrawerProps {
  integration: DetailedIntegration | null;
  onClose: () => void;
}

export const IntegrationDrawer: React.FC<IntegrationDrawerProps> = ({
  integration,
  onClose,
}) => {
  const reducedMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
    if (!integration) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [integration, onClose]);

  const handleCopy = async () => {
    if (!integration) return;
    try {
      await navigator.clipboard.writeText(integration.snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(true);
    }
  };

  return (
    <AnimatePresence>
      {integration && (
        <>
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#0A1F6B]/40 backdrop-blur-[2px]"
          />
          <motion.aside
            initial={reducedMotion ? {opacity: 1, x: 0} : {opacity: 0, x: '100%'}}
            animate={{opacity: 1, x: 0}}
            exit={reducedMotion ? {opacity: 0} : {opacity: 0, x: '100%'}}
            transition={{duration: reducedMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1]}}
            role="dialog"
            aria-modal="true"
            aria-label={`${integration.name} setup instructions`}
            className="fixed top-4 right-4 bottom-4 z-50 w-[calc(100vw-32px)] max-w-[460px] rounded-[8px] bg-white border border-[#0B0B0B]/15 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#0B0B0B]/12">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-[4px] bg-[#0B2FA8] text-white font-mono text-[13px] font-semibold">
                    {integration.abbr}
                  </span>
                  <div>
                    <h3 className="text-[20px] font-medium tracking-[-0.02em] text-[#0B0B0B]">
                      {integration.name}
                    </h3>
                    <span className="font-mono text-[11px] text-[#0B0B0B]/55">
                      {integration.category}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close setup drawer"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-[4px] bg-[#E9E8E6] hover:bg-[#D9C4A8] text-[#0B0B0B] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="mt-4 text-[15px] leading-[1.55] text-[#0B0B0B]/75">
                {integration.summary}
              </p>

              {/* 3-step Setup Instructions */}
              <div className="mt-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#0B2FA8]">
                  3-Step Setup
                </span>
                <ol className="mt-3 flex flex-col gap-3">
                  {integration.steps.map((step, idx) => (
                    <li
                      key={step}
                      className="flex items-start gap-3 p-3 rounded-[4px] bg-[#E9E8E6]/65 border border-[#0B0B0B]/8 text-[14px] text-[#0B0B0B]"
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-[2px] bg-[#0B2FA8] text-white font-mono text-[11px] shrink-0">
                        0{idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Code Snippet */}
              <div className="mt-6 rounded-[6px] bg-[#0A1F6B] text-white overflow-hidden">
                <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/15 bg-[#06154D]">
                  <span className="font-mono text-[11px] text-[#D9C4A8]">Quickstart Snippet</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-white/10 hover:bg-white/20 font-mono text-[11px] cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-[#86EFAC]" />
                        <span className="text-[#86EFAC]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 font-mono text-[12px] leading-[1.6] text-white/90 overflow-x-auto">
                  <code>{integration.snippet}</code>
                </pre>
              </div>
            </div>

            <div className="pt-5 mt-6 border-t border-[#0B0B0B]/12 flex items-center justify-between text-[12px] text-[#0B0B0B]/60">
              <span>Status: Ready to connect</span>
              <span className="font-mono">v1.4 connector</span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
