import React from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {ArrowUpRight} from 'lucide-react';
import {BlogPost} from '../../lib/resourcesContent';
import {useReducedMotion} from '../../hooks/useReducedMotion';

interface PostCardProps {
  post: BlogPost;
  featured?: boolean;
  index?: number;
}

export const PostCard: React.FC<PostCardProps> = ({post, featured = false, index = 0}) => {
  const reducedMotion = useReducedMotion();

  if (featured) {
    return (
      <motion.article
        initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true, amount: 0.2}}
        transition={{duration: reducedMotion ? 0 : 0.45}}
      >
        <Link
          to={`/resources/blog/${post.slug}`}
          className="group rounded-[8px] bg-[#0A1F6B] text-white border border-[#0A1F6B] p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center hover:border-[#D9C4A8] transition-colors"
        >
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="px-2.5 py-0.5 rounded-[2px] bg-[#D9C4A8] text-[#0A1F6B] font-mono text-[11px] font-semibold uppercase">
                Featured · {post.category}
              </span>
              <span className="font-mono text-[12px] text-white/60">
                {post.date} · {post.readingTime}
              </span>
            </div>

            <h2 className="text-[30px] sm:text-[40px] font-medium tracking-[-0.03em] leading-[1.05] text-white group-hover:text-[#D9C4A8] transition-colors">
              {post.title}
            </h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-white/75 max-w-[600px]">
              {post.excerpt}
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:flex-col lg:items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-[3px] bg-[#0B2FA8] text-[#D9C4A8] font-mono text-[13px] font-semibold">
                {post.initials}
              </span>
              <div className="text-left">
                <span className="block text-[14px] font-medium text-white">{post.author}</span>
                <span className="block text-[12px] text-white/60">{post.role}</span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 font-mono text-[12px] text-[#D9C4A8]">
              <span>Read article</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={reducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, amount: 0.2}}
      transition={{
        duration: reducedMotion ? 0 : 0.45,
        delay: reducedMotion ? 0 : index * 0.06,
      }}
    >
      <Link
        to={`/resources/blog/${post.slug}`}
        className="group h-full rounded-[8px] bg-white border border-[#0B0B0B]/15 hover:border-[#0B2FA8] p-4 sm:p-6 flex flex-col justify-between gap-4 sm:gap-6 transition-colors"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="px-2 py-0.5 rounded-[2px] bg-[#0B2FA8]/10 text-[#0B2FA8] font-mono text-[10.5px] font-medium uppercase">
              {post.category}
            </span>
            <span className="font-mono text-[11px] text-[#0B0B0B]/55">{post.readingTime}</span>
          </div>

          <h3 className="text-[20px] sm:text-[22px] font-medium tracking-[-0.02em] leading-[1.2] text-[#0B0B0B] group-hover:text-[#0B2FA8] transition-colors">
            {post.title}
          </h3>
          <p className="mt-2.5 text-[14px] leading-[1.6] text-[#0B0B0B]/70">{post.excerpt}</p>
        </div>

        <div className="pt-4 border-t border-[#0B0B0B]/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-[2px] bg-[#0A1F6B] text-[#D9C4A8] font-mono text-[11px] font-semibold">
              {post.initials}
            </span>
            <span className="text-[12.5px] font-medium text-[#0B0B0B]">{post.author}</span>
          </div>
          <span className="font-mono text-[11px] text-[#0B0B0B]/50">{post.date}</span>
        </div>
      </Link>
    </motion.article>
  );
};
