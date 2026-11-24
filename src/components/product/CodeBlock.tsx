import React, {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {Check, Copy} from 'lucide-react';
import {CODE_SNIPPETS, CodeLanguage} from '../../lib/mockData';
import {useInView} from '../../hooks/useInView';
import {useReducedMotion} from '../../hooks/useReducedMotion';

const LANGS: CodeLanguage[] = ['Python', 'TypeScript', 'cURL'];

export const CodeBlock: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const {ref, inView} = useInView<HTMLElement>({threshold: 0.2, once: true});
  const [lang, setLang] = useState<CodeLanguage>('Python');
  const [typedLen, setTypedLen] = useState<number>(
    reducedMotion ? CODE_SNIPPETS.Python.length : 0
  );
  const [copied, setCopied] = useState(false);

  const snippet = CODE_SNIPPETS[lang];

  useEffect(() => {
    if (reducedMotion) {
      setTypedLen(snippet.length);
      return;
    }
    if (!inView) return;

    setTypedLen(0);
    let current = 0;
    const stepSize = Math.max(4, Math.ceil(snippet.length / 42));
    const timer = setInterval(() => {
      current += stepSize;
      if (current >= snippet.length) {
        setTypedLen(snippet.length);
        clearInterval(timer);
      } else {
        setTypedLen(current);
      }
    }, 18);

    return () => clearInterval(timer);
  }, [inView, lang, reducedMotion, snippet]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <section
      ref={ref}
      className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10"
    >
      <motion.div
        initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 24}}
        animate={inView || reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 24}}
        transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
        className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center"
      >
        <div className="lg:col-span-5">
          <h2 className="headline-display text-[28px] sm:text-[46px] leading-tight text-[#0B0B0B]">
            Instrument in <span className="headline-serif-accent">five</span> minutes
          </h2>
          <p className="mt-3 text-[14px] sm:text-[16px] leading-[1.6] text-[#0B0B0B]/70">
            Initialize the client with your API key, wrap any agent entry point, and annotate
            custom tool spans without rewriting orchestration logic.
          </p>
        </div>

        <div className="lg:col-span-7 rounded-[6px] bg-[#0A1F6B] border border-[#0B0B0B]/15 overflow-hidden shadow-[0_20px_50px_rgba(10,31,107,0.18)]">
          {/* Code Window Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 border-b border-white/15 bg-[#06154D]">
            <div className="flex items-center gap-1" role="tablist" aria-label="SDK languages">
              {LANGS.map((l) => {
                const active = lang === l;
                return (
                  <button
                    key={l}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setLang(l)}
                    className={`px-2.5 py-1 rounded-[3px] font-mono text-[11px] sm:text-[12px] transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#0B2FA8] text-white'
                        : 'text-white/65 hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] sm:text-[11px] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#86EFAC]" />
                  <span className="text-[#86EFAC]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 sm:p-6 overflow-x-auto font-mono text-[11px] sm:text-[13px] leading-[1.6] sm:leading-[1.65] text-white/90 min-h-[220px] sm:min-h-[250px]">
            <code>{snippet.slice(0, typedLen)}</code>
          </pre>
        </div>
      </motion.div>
    </section>
  );
};