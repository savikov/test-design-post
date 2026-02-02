import Link from 'next/link';
import { SupabasePostsRepository } from '@/lib/infrastructure/supabasePostsRepo';
import { PostsService } from '@/lib/core/postsService';

export default async function Home() {
  const service = new PostsService(new SupabasePostsRepository());
  const posts = await service.listPublished(null);

  return (
    <main style={{ maxWidth: 860, margin: '40px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Design Team Posts</h1>
      <p style={{ opacity: 0.7, marginBottom: 24 }}>
        Витрина опубликованных постов дизайн-команды (MVP)
      </p>

      {posts.length === 0 ? (
        <div style={{ opacity: 0.6 }}>
          Нет опубликованных постов
        </div>
      ) : (
        <ul style={{ display: 'grid', gap: 12, padding: 0, listStyle: 'none' }}>
          {posts.map((p) => (
            <li key={p.id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
              <Link href={`/post/${p.id}`} style={{ fontSize: 18, fontWeight: 600 }}>
                {p.title}
              </Link>
              <div style={{ marginTop: 8, fontSize: 13, opacity: 0.75 }}>
                {p.authorName}
                {p.productTitle ? ` · ${p.productTitle}` : ''}
                {p.postedAt ? ` · ${new Date(p.postedAt).toLocaleDateString()}` : ''}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
