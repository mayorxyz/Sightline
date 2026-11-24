import React from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight} from 'lucide-react';
import {PageHeader} from '../../components/PageHeader';
import {ResourceCard} from '../../components/resources/ResourceCard';
import {SearchBox} from '../../components/resources/SearchBox';
import {PostCard} from '../../components/resources/PostCard';
import {NewsletterBand} from '../../components/resources/NewsletterBand';
import {Footer} from '../../components/Footer';
import {
  BLOG_POSTS,
  CHANGELOG_ENTRIES,
  RESOURCES_HUB_CARDS,
} from '../../lib/resourcesContent';

export const ResourcesIndex: React.FC = () => {
  const newestPosts = BLOG_POSTS.slice(0, 3);
  const latestRelease = CHANGELOG_ENTRIES[0];

  return (
    <main className="pb-4">
      <PageHeader
        tag="Resources"
        lines={[
          <>
            Learn, <span className="headline-serif-accent">Ship</span>, Repeat
          </>,
        ]}
        subtitle="Short SDK guides, field notes on AI agent reliability, and weekly product releases."
      />

      {/* Search + 3 Hub Cards */}
      <section className="mx-2 sm:mx-5 mt-6 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-5 sm:gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-[20px] sm:text-[22px] font-medium tracking-[-0.02em] text-[#0B0B0B]">
                Explore knowledge base
              </h2>
              <p className="mt-1 text-[13px] sm:text-[14px] text-[#0B0B0B]/65">
                Jump into quickstarts, articles, or release history.
              </p>
            </div>
            <div className="w-full sm:w-[380px]">
              <SearchBox placeholder="Search docs and blog posts..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
            {RESOURCES_HUB_CARDS.map((card, idx) => (
              <ResourceCard key={card.id} card={card} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Row: 3 Blog Posts + 1 Changelog Card */}
      <section className="mx-2 sm:mx-5 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-2 mb-5 sm:mb-8">
            <h2 className="headline-display text-[28px] sm:text-[44px] leading-[1.02] text-[#0B0B0B]">
              Latest <span className="headline-serif-accent">updates</span>
            </h2>
            <Link
              to="/resources/blog"
              className="inline-flex items-center gap-1 font-mono text-[11px] sm:text-[12px] text-[#0B2FA8] hover:underline"
            >
              <span>All blog posts</span>
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 items-stretch">
            {newestPosts.map((post, idx) => (
              <PostCard key={post.slug} post={post} index={idx} />
            ))}

            {/* Latest Changelog Card */}
            <Link
              to="/resources/changelog"
              className="group rounded-[6px] sm:rounded-[8px] bg-[#0A1F6B] text-white border border-[#0A1F6B] hover:border-[#D9C4A8] p-5 sm:p-6 flex flex-col justify-between gap-4 sm:gap-6 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-[2px] bg-[#D9C4A8] text-[#0A1F6B] font-mono text-[10px] sm:text-[10.5px] font-semibold">
                    {latestRelease.version}
                  </span>
                  <span className="font-mono text-[10px] sm:text-[11px] text-white/60">{latestRelease.date}</span>
                </div>
                <h3 className="text-[18px] sm:text-[20px] font-medium tracking-[-0.02em] leading-[1.25] text-white group-hover:text-[#D9C4A8] transition-colors">
                  {latestRelease.title}
                </h3>
                <p className="mt-2 sm:mt-2.5 text-[13px] sm:text-[13.5px] leading-[1.6] text-white/75">
                  {latestRelease.body}
                </p>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-white/15 flex items-center justify-between font-mono text-[11px] sm:text-[12px] text-[#D9C4A8]">
                <span>Latest release</span>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <NewsletterBand />
      <Footer />
    </main>
  );
};

export default ResourcesIndex;