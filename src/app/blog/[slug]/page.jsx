import { notFound } from 'next/navigation';
import BlogPost from '@/views/BlogPost.jsx';
import { getAllPosts, getPost, getRelatedPosts } from '@/lib/blog.js';
import { formatDate } from '@/lib/format.js';
import { blogPostingSchema } from '@/seo/schema.js';
import { pageMetadata, JsonLd } from '@/seo/meta.jsx';
import { SITE_URL } from '@/seo/seo.config.js';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    pathname: `/blog/${slug}`,
    title: post.title,
    description: post.excerpt,
    image: post.cover ? `${SITE_URL}${post.cover}` : undefined,
    type: 'article',
    publishedTime: post.date,
    modifiedTime: post.updated || post.date,
    authors: [post.author],
    tags: post.tags,
    noindex: post.draft,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = getRelatedPosts(slug).map((p) => ({ ...p, dateLabel: formatDate(p.date) }));
  return (
    <>
      <JsonLd pathname={`/blog/${slug}`} title={post.title} extra={[blogPostingSchema(post)]} />
      <BlogPost post={{ ...post, dateLabel: formatDate(post.date) }} related={related} />
    </>
  );
}
