import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {BLOG_POSTS} from '../../lib/resourcesContent';
import {PostTemplate} from '../../components/resources/PostTemplate';
import {NotFound} from '../../components/NotFound';
import {Footer} from '../../components/Footer';

export const BlogPost: React.FC = () => {
  const {slug} = useParams<{slug: string}>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} — Sightline Blog`;
    }
  }, [post]);

  if (!post) {
    return <NotFound />;
  }

  return (
    <>
      <PostTemplate post={post} />
      <Footer />
    </>
  );
};

export default BlogPost;