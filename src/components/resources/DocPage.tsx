import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowLeft, ArrowRight, Check, Copy} from 'lucide-react';
import {DOC_PAGES, DocPageItem} from '../../lib/resourcesContent';
import {Callout} from './Callout';
import {Feedback} from './Feedback';
import {useReducedMotion} from '../../hooks/useReducedMotion';

const QUICKSTART_STORAGE_KEY = 'oiq_quickstart_steps_v1';

const QUICKSTART_CHECKLIST = [
  {id: 'install', label: 'Install Sightline or @Sightline/sdk'},
  {id: 'apikey', label: 'Export OIQ_API_KEY in your local environment'},
  {id: 'wrap', label: 'Wrap your agent entry point with @oiq.trace'},
];

interface DocPageProps {
  doc: DocPageItem;
}

export const DocPageView: React.FC<DocPageProps> = ({doc}) => {
  const reducedMotion = useReducedMotion();
  const isQuickstart = doc.slug === 'quickstart';

  const [lang, setLang] = useState<'python' | 'typescript'>('python');
  const [copied, setCopied] = useState(false);
  const [typedLen, setTypedLen] = useState<number>(doc.code[lang].length);

  // Quickstart persisted checklist
  const [checks, setChecks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(QUICKSTART_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });

  const toggleCheck = (id: string) => {
    setChecks((prev) => {
      const next = {...prev, [id]: !prev[id]};
      try {
        localStorage.setItem(QUICKSTART_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const snippet = doc.code[lang];

  // Typewriter reveal ONLY on Quickstart (and skipped if reduced motion)
  useEffect(() => {
    if (!isQuickstart || reducedMotion) {
      setTypedLen(snippet.length);
      return;
    }

    setTypedLen(0);
    let current = 0;
    const step = Math.max(4, Math.ceil(snippet.length / 36));
    const timer = setInterval(() => {
      current += step;
      if (current >= snippet.length) {
        setTypedLen(snippet.length);
        clearInterval(timer);
      } else {
        setTypedLen(current);
      }
    }, 18);

    return () => clearInterval(timer);
  }, [doc.slug, isQuickstart, lang, reducedMotion, snippet]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(snippet).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const prevDoc = doc.prevSlug ? DOC_PAGES.find((d) => d.slug === doc.prevSlug) : undefined;
  const nextDoc = doc.nextSlug ? DOC_PAGES.find((d) => d.slug === doc.nextSlug) : undefined;

  return (
    <div className="flex flex-col gap-5 sm:gap-7">
      <div className="pb-5 border-b border-[#0B0B0B]/15">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#0B2FA8]">
          {doc.group}
        </span>
        <h1 className="mt-2 headline-display text-[30px] sm:text-[44px] leading-[1.02] text-[#0B0B0B]">
          {doc.title}
        </h1>
        <p className="mt-2.5 text-[14.5px] sm:text-[16px] leading-[1.55] sm:leading-[1.6] text-[#0B0B0B]/70">{doc.summary}</p>
      </div>

      {/* Quickstart Interactive Checklist persisted in localStorage */}
      {isQuickstart && (
        <div className="rounded-[6px] bg-white border border-[#0B0B0B]/15 p-3.5 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#0B2FA8]">
              Quickstart Checklist
            </span>
            <span className="font-mono text-[11px] text-[#0B0B0B]/55 tabular-nums">
              {QUICKSTART_CHECKLIST.filter((c) => checks[c.id]).length}/3 complete
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {QUICKSTART_CHECKLIST.map((item) => {
              const done = !!checks[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleCheck(item.id)}
                  aria-pressed={done}
                  className={`flex items-start sm:items-center gap-3 px-3 py-2.5 rounded-[4px] border text-left text-[12.5px] sm:text-[13.5px] leading-[1.45] cursor-pointer transition-colors ${
                    done
                      ? 'bg-[#D9C4A8]/40 border-[#0B2FA8] text-[#0B0B0B]'
                      : 'bg-[#F8F7F5] border-[#0B0B0B]/12 text-[#0B0B0B]/85'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-[2px] border inline-flex items-center justify-center shrink-0 ${
                      done
                        ? 'bg-[#0B2FA8] border-[#0B2FA8] text-white'
                        : 'bg-white border-[#0B0B0B]/25 text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3" strokeWidth={2.5} />
                  </span>
                  <span className={done ? 'line-through text-[#0B0B0B]/60' : ''}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Doc Sections */}
      {doc.sections.map((sec) => (
        <section key={sec.id} id={sec.id} className="scroll-mt-28">
          <h2 className="text-[20px] sm:text-[22px] leading-[1.15] font-medium tracking-[-0.02em] text-[#0B0B0B] mb-2">
            {sec.heading}
          </h2>
          <p className="text-[15.5px] leading-[1.65] text-[#0B0B0B]/80">{sec.body}</p>
        </section>
      ))}

      {/* Python / TypeScript Code Snippet */}
      <div className="rounded-[8px] bg-[#0A1F6B] border border-[#0B0B0B]/15 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#06154D] border-b border-white/15">
          <div className="flex items-center gap-1" role="tablist" aria-label="Code language">
            {(['python', 'typescript'] as const).map((l) => (
              <button
                key={l}
                type="button"
                role="tab"
                aria-selected={lang === l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-[3px] font-mono text-[11.5px] capitalize cursor-pointer transition-colors ${
                  lang === l ? 'bg-[#0B2FA8] text-white' : 'text-white/65 hover:text-white'
                }`}
              >
                {l === 'python' ? 'Python' : 'TypeScript'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#86EFAC]" />
                <span className="text-[#86EFAC]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-3 sm:p-5 overflow-x-auto font-mono text-[12px] sm:text-[13px] leading-[1.6] text-white/90 min-h-[120px]">
          <code>{snippet.slice(0, typedLen)}</code>
        </pre>
      </div>

      {/* Note / Tip Callout */}
      <Callout type={doc.callout.type} title={doc.callout.title} body={doc.callout.body} />

      {/* Prev / Next Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2">
        {prevDoc ? (
          <Link
            to={`/resources/docs/${prevDoc.slug}`}
            className="rounded-[6px] bg-white border border-[#0B0B0B]/15 hover:border-[#0B2FA8] p-4 flex items-center gap-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#0B2FA8] shrink-0" />
            <div>
              <span className="block font-mono text-[10px] uppercase text-[#0B0B0B]/50">
                Previous
              </span>
              <span className="text-[14px] font-medium text-[#0B0B0B]">{prevDoc.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextDoc ? (
          <Link
            to={`/resources/docs/${nextDoc.slug}`}
            className="rounded-[6px] bg-white border border-[#0B0B0B]/15 hover:border-[#0B2FA8] p-4 flex items-center justify-end gap-3 text-right transition-colors"
          >
            <div>
              <span className="block font-mono text-[10px] uppercase text-[#0B0B0B]/50">
                Next
              </span>
              <span className="text-[14px] font-medium text-[#0B0B0B]">{nextDoc.title}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#0B2FA8] shrink-0" />
          </Link>
        ) : (
          <div />
        )}
      </div>

      <Feedback docSlug={doc.slug} />
    </div>
  );
};
