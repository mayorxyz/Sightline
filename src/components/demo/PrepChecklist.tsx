import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {Check, Copy} from 'lucide-react';
import {PREP_CHECKLIST_ITEMS} from '../../lib/demoContent';
import {SectionTag} from '../SectionTag';
import {useReducedMotion} from '../../hooks/useReducedMotion';

export const PrepChecklist: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => ({...prev, [id]: !prev[id]}));
  };

  const handleCopy = () => {
    const text = PREP_CHECKLIST_ITEMS.map((item) => {
      const mark = checkedIds[item.id] ? '[x]' : '[ ]';
      return `${mark} ${item.title} — ${item.hint}`;
    }).join('\n');
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const doneCount = PREP_CHECKLIST_ITEMS.filter((i) => checkedIds[i.id]).length;

  return (
    <section
      id="prep"
      className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10"
    >
      <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4">
          <SectionTag label="Prep Checklist" />
          <h2 className="mt-3 sm:mt-4 headline-display text-[28px] sm:text-[44px] leading-[1.02] text-[#0B0B0B]">
            Optional items to <span className="headline-serif-accent">bring</span>
          </h2>
          <p className="mt-3 text-[15px] leading-[1.6] text-[#0B0B0B]/70">
            None are required, but having one or two ready helps us go straight into your agent traces.
          </p>

          <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-[2px] bg-[#0B2FA8] hover:bg-[#0A1F6B] text-white text-[13px] font-medium px-4 py-2.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-[#D9C4A8]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Checklist copied' : 'Copy checklist'}</span>
            </button>
            <span className="font-mono text-[12px] text-[#0B0B0B]/60 tabular-nums">
              {doneCount}/{PREP_CHECKLIST_ITEMS.length} ready
            </span>
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
          {PREP_CHECKLIST_ITEMS.map((item, idx) => {
            const isChecked = !!checkedIds[item.id];
            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-pressed={isChecked}
                initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 24}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.2}}
                transition={{
                  duration: reducedMotion ? 0 : 0.45,
                  delay: reducedMotion ? 0 : idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`text-left rounded-[6px] border p-3.5 sm:p-5 flex items-start gap-3 sm:gap-3.5 transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-[#D9C4A8]/45 border-[#0B2FA8]'
                    : 'bg-white border-[#0B0B0B]/15 hover:border-[#0B2FA8]/60'
                }`}
              >
                <span
                  className={`mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-[3px] border shrink-0 transition-colors ${
                    isChecked
                      ? 'bg-[#0B2FA8] border-[#0B2FA8] text-white'
                      : 'bg-white border-[#0B0B0B]/25 text-transparent'
                  }`}
                >
                  <motion.span
                    initial={false}
                    animate={
                      isChecked
                        ? {scale: 1, opacity: 1}
                        : {scale: reducedMotion ? 1 : 0.4, opacity: 0}
                    }
                    transition={{duration: reducedMotion ? 0 : 0.18}}
                  >
                    <Check className="w-3.5 h-3.5" strokeWidth={2.6} />
                  </motion.span>
                </span>

                <div>
                  <span
                    className={`block text-[16px] font-medium tracking-[-0.01em] ${
                      isChecked ? 'line-through text-[#0B0B0B]/60' : 'text-[#0B0B0B]'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="mt-1 block text-[13px] leading-[1.55] text-[#0B0B0B]/65">
                    {item.hint}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
