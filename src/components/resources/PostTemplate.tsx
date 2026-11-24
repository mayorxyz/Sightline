import React, {useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowLeft, Check, Copy} from 'lucide-react';
import {BLOG_POSTS, BlogPost} from '../../lib/resourcesContent';
import {Toc} from './Toc';
import {PostCard} from './PostCard';
import {Button} from '../Button';

interface PostTemplateProps {
  post: BlogPost;
}

export const PostTemplate: React.FC<PostTemplateProps> = ({post}) => {
  const [readPct, setReadPct] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) {
        setReadPct(0);
        return;
      }
      setReadPct(Math.min(100, Math.max(0, (window.scrollY / total) * 100)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, [post.slug]);

  const headings = useMemo(
    () => post.sections.map((s) => ({id: s.id, label: s.heading})),
    [post.sections]
  );

  const relatedPosts = useMemo(
    () =>
      post.relatedSlugs
        .map((sl) => BLOG_POSTS.find((p) => p.slug === sl))
        .filter((p): p is BlogPost => Boolean(p)),
    [post.relatedSlugs]
  );

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(post.code.snippet).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <article className="pb-4 pt-16 sm:pt-24">
      {/* Reading Progress Bar */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-transparent pointer-events-none"
      >
        <div
          style={{width: `${readPct}%`}}
          className="h-full bg-[#0B2FA8] transition-[width] duration-75"
        />
      </div>

      {/* Article Header */}
      <header className="mx-2 sm:mx-5 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10 bg-white rounded-t-[12px]">
        <div className="max-w-[960px] mx-auto">
          <Link
            to="/resources/blog"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-[12px] text-[#0B2FA8] hover:underline mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Blog</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="px-2.5 py-0.5 rounded-[2px] bg-[#0B2FA8] text-white font-mono text-[11px] uppercase">
              {post.category}
            </span>
            <span className="font-mono text-[12px] text-[#0B0B0B]/60">
              {post.date} · {post.readingTime}
            </span>
          </div>

          <h1 className="headline-display text-[32px] sm:text-[54px] leading-[1.02] text-[#0B0B0B]">
            {post.title}
          </h1>
          <p className="mt-3 sm:mt-4 text-[15px] sm:text-[17px] leading-[1.55] sm:leading-[1.6] text-[#0B0B0B]/70 max-w-[680px]">
            {post.excerpt}
          </p>

          <div className="mt-6 pt-5 border-t border-[#0B0B0B]/10 flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-[3px] bg-[#0A1F6B] text-[#D9C4A8] font-mono text-[12px] font-semibold">
              {post.initials}
            </span>
            <div>
              <span className="block text-[14px] font-medium text-[#0B0B0B]">{post.author}</span>
              <span className="block text-[12px] text-[#0B0B0B]/60">{post.role}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Body + Sticky TOC */}
      <section className="mx-2 sm:mx-5 border-x border-b border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10">
        <div className="max-w-[960px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-8">
            {post.sections.map((section, sIdx) => (
              <React.Fragment key={section.id}>
                <section id={section.id} className="scroll-mt-28">
                  <h2 className="text-[21px] sm:text-[28px] font-medium tracking-[-0.02em] leading-[1.15] text-[#0B0B0B] mb-2.5 sm:mb-3">
                    {section.heading}
                  </h2>
                  <div className="flex flex-col gap-3 text-[15px] sm:text-[16px] leading-[1.65] sm:leading-[1.7] text-[#0B0B0B]/80">
                    {section.paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </section>

                {/* Insert Code Block after Section 2 */}
                {sIdx === 1 && (
                  <div className="rounded-[6px] bg-[#0A1F6B] text-white border border-[#0B0B0B]/15 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#06154D] border-b border-white/15">
                      <span className="font-mono text-[11px] uppercase text-[#D9C4A8]">
                        {post.code.language}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-1.5 font-mono text-[11px] text-white/80 hover:text-white cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#86EFAC]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 sm:p-4 overflow-x-auto font-mono text-[12px] sm:text-[13px] leading-[1.6] text-white/90">
                      <code>{post.code.snippet}</code>
                    </pre>
                  </div>
                )}

                {/* Insert Pull Quote after Section 1 */}
                {sIdx === 0 && (
                  <blockquote className="rounded-[6px] bg-[#D9C4A8]/45 border-l-4 border-[#0B2FA8] p-4 sm:p-5 text-[18px] sm:text-[20px] font-medium tracking-[-0.02em] leading-[1.35] text-[#0B0B0B]">
                    &ldquo;{post.pullQuote}&rdquo;
                  </blockquote>
                )}
              </React.Fragment>
            ))}
          </div>

          <aside className="hidden lg:block lg:col-span-4">
            <Toc headings={headings} />
          </aside>
        </div>
      </section>

      {/* Related Posts + CTA Band */}
      <section className="mx-2 sm:mx-5 mt-6 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10">
        <div className="max-w-[960px] mx-auto">
          <h2 className="headline-display text-[28px] sm:text-[36px] leading-[1.02] text-[#0B0B0B] mb-5 sm:mb-6">
            Related <span className="headline-serif-accent">articles</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {relatedPosts.map((rp, idx) => (
              <PostCard key={rp.slug} post={rp} index={idx} />
            ))}
          </div>

          <div className="mt-8 sm:mt-10 rounded-[8px] bg-[#0A1F6B] text-white p-5 sm:p-8 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-[22px] font-medium tracking-[-0.02em]">
                See these traces on your own agents
              </h3>
              <p className="mt-1 text-[14px] text-white/75">
                Launch the live browser sandbox or schedule 30 minutes with an engineer.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2.5 sm:gap-3">
              <Button label="Try Sandbox" variant="sand" to="/demo/sandbox" />
              <Button label="Book a Demo" variant="secondary" to="/demo" />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};
