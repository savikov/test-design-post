import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { SupabasePostsRepository } from '@/lib/infrastructure/supabasePostsRepo';
import { PostsService } from '@/lib/core/postsService';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const service = new PostsService(new SupabasePostsRepository());
  const post = await service.getPostById(id);

  if (!post) notFound();

  // MVP правило: публично показываем только published
  if (post.status !== 'published') notFound();

  return (
    <main style={{ maxWidth: 860, margin: '40px auto', padding: '0 16px' }}>
      <Link href="/" style={{ opacity: 0.8 }}>
        ← Назад
      </Link>

      <h1 style={{ fontSize: 28, margin: '16px 0 8px' }}>{post.title}</h1>

      <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 24 }}>
        {post.authorName}
        {post.productTitle ? ` · ${post.productTitle}` : ''}
        {post.postedAt ? ` · ${new Date(post.postedAt).toLocaleDateString()}` : ''}
      </div>

      <article style={{ lineHeight: 1.65 }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.bodyMd}
        </ReactMarkdown>
      </article>
    </main>
  );
}
