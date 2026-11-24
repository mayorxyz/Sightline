import React, {useMemo, useState} from 'react';
import {Search} from 'lucide-react';
import {PageHeader} from '../../components/PageHeader';
import {CategoryChips} from '../../components/resources/CategoryChips';
import {PostCard} from '../../components/resources/PostCard';
import {NewsletterBand} from '../../components/resources/NewsletterBand';
import {Footer} from '../../components/Footer';
import {BLOG_POSTS, BlogCategory} from '../../lib/resourcesContent';

type BlogFilter = 'All' | BlogCategory;
const CATEGORIES: BlogFilter[] = ['All', 'Engineering', 'Evals', 'Cost', 'Product', 'Security'];

export const Blog: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<BlogFilter>('All');
  const [query, setQuery] = useState('');

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BLOG_POSTS.filter((post) => {
      const catOk = selectedCat === 'All' || post.category === selectedCat;
      const queryOk =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
      return catOk && queryOk;
    });
  }, [selectedCat, query]);

  const featuredPost = useMemo(() => {
    if (selectedCat !== 'All' || query.trim()) return null;
    return BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];
  }, [selectedCat, query]);

  const gridPosts = useMemo(() => {
    if (!featuredPost) return filteredPosts;
    return filteredPosts.filter((p) => p.slug !== featuredPost.slug);
  }, [featuredPost, filteredPosts]);

  return (
    <main className="pb-4">
      <PageHeader
        tag="Blog"
        lines={[
          <>Notes From The</>,
          <>
            <span className="headline-serif-accent">Trace</span>
          </>,
        ]}
        subtitle="Engineering lessons on debugging silent agent failures, CI eval gates, and token economics."
      />

      <section className="mx-2 sm:mx-5 mt-6 mb-6 border border-[#0B0B0B]/20 py-8 sm:py-12 px-3 sm:px-6 lg:px-10">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-6 sm:gap-8">
          {/* Category Filter + Live Search */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-[#0B0B0B]/15">
            <CategoryChips
              categories={CATEGORIES}
              selected={selectedCat}
              onSelect={setSelectedCat}
              layoutGroupId="blog-category-pill"
            />

            <div className="relative w-full sm:w-[280px]">
              <Search className="w-4 h-4 text-[#0B0B0B]/45 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter articles..."
                aria-label="Filter blog articles"
                className="w-full h-9 sm:h-10 rounded-[4px] border border-[#0B0B0B]/20 bg-white pl-9 pr-3 text-[13px] sm:text-[13.5px] text-[#0B0B0B] focus:outline-none focus:border-[#0B2FA8]"
              />
            </div>
          </div>

          {featuredPost && <PostCard post={featuredPost} featured />}

          {gridPosts.length === 0 && !featuredPost ? (
            <div className="rounded-[6px] sm:rounded-[8px] bg-white border border-[#0B0B0B]/15 p-8 sm:p-10 text-center text-[14px] sm:text-[15px] text-[#0B0B0B]/65">
              No articles match your current filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {gridPosts.map((post, idx) => (
                <PostCard key={post.slug} post={post} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      <NewsletterBand />
      <Footer />
    </main>
  );
};

export default Blog;