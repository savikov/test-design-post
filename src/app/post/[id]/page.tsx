import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { SupabasePostsRepository } from '@/lib/infrastructure/supabasePostsRepo';
import { SupabaseStorageRepository } from '@/lib/infrastructure/supabaseStorageRepo';
import { PostsService } from '@/lib/core/postsService';
import { RoundedMedia } from '@/components/RoundedMedia';
import { CoverImage } from '@/components/CoverImage';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const service = new PostsService(new SupabasePostsRepository());
  const post = await service.getPostById(id);
  const storageRepo = new SupabaseStorageRepository();

  if (!post) notFound();

  // MVP правило: публично показываем только published
  if (post.status !== 'published') notFound();

  const formattedDate = post.postedAt
    ? new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(post.postedAt))
    : '';

  const metaParts = [post.productTitle ?? '', formattedDate].filter(Boolean);
  const metaText = metaParts.join(' · ');
  const designersInline = (post.designers ?? []).map((designer, index) => {
    const initial = designer.name?.trim().charAt(0)?.toUpperCase() ?? '';
    return (
      <span
        key={`${designer.name}-${index}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#f2f2f2',
            color: '#111',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {designer.avatarUrl ? (
            <img
              src={designer.avatarUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            initial
          )}
        </span>
        <span>{designer.name}</span>
      </span>
    );
  });

  const mediaBlocks = post.media ?? [];
  const coverUrl = storageRepo.getPublicUrl('Media', `posts/${post.id}/1.png`);
  const fallbackBlock = mediaBlocks.find((block) => block.type === 'image') ?? null;
  const fallbackCoverUrl = fallbackBlock
    ? storageRepo.getPublicUrl(fallbackBlock.bucket, fallbackBlock.storageKey)
    : null;
  const restBlocks = mediaBlocks;
  const restBlocksWithUrl = restBlocks.map((block) => ({
    ...block,
    publicUrl: storageRepo.getPublicUrl(block.bucket, block.storageKey),
  }));

  return (
    <main style={{ maxWidth: 900, margin: '56px auto 80px', padding: '0 20px' }}>
      <div style={{ marginBottom: 16 }}>
        <img
          src="/brand/logo.svg"
          alt="CDEK DESIGN"
          style={{ height: 22, width: 'auto', display: 'block' }}
        />
      </div>
      <h1 style={{ fontSize: 40, margin: '0 0 16px', lineHeight: 1.15 }}>
        CDEK DESIGN
      </h1>
      <p style={{ opacity: 0.7, marginBottom: 32, fontSize: 16, lineHeight: 1.5 }}>
        Витрина продуктового дизайна команды CDEK
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          fontSize: 14,
          opacity: 0.7,
          padding: '8px 0',
          marginBottom: 24,
        }}
      >
        ← Назад
      </Link>

      <h1 style={{ fontSize: 40, margin: '0 0 10px', lineHeight: 1.15 }}>
        {post.title}
      </h1>

      {designersInline.length > 0 || metaText ? (
        <div
          style={{
            fontSize: 13,
            opacity: 0.7,
            marginBottom: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          {designersInline.length > 0 ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              {designersInline.map((node, index) => (
                <span key={`designer-${index}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  {node}
                  {index < designersInline.length - 1 ? <span>·</span> : null}
                </span>
              ))}
            </span>
          ) : null}
          {metaText ? <span>{designersInline.length > 0 ? `· ${metaText}` : metaText}</span> : null}
        </div>
      ) : null}

      <figure style={{ margin: '24px 0 36px' }}>
        <RoundedMedia>
          <CoverImage
            primarySrc={coverUrl}
            fallbackSrc={fallbackCoverUrl}
            alt=""
            style={{ width: '100%', display: 'block' }}
          />
        </RoundedMedia>
      </figure>

      {restBlocksWithUrl.length > 0 ? (
        <section style={{ margin: '24px 0 36px' }}>
          {restBlocksWithUrl.map((block, index) => (
            <figure
              key={`${block.storageKey}-${index}`}
              style={{ margin: '0 0 24px' }}
            >
              {block.type === 'image' ? (
                <RoundedMedia>
                  <img
                    src={block.publicUrl}
                    alt=""
                    style={{ maxWidth: '100%', display: 'block' }}
                  />
                </RoundedMedia>
              ) : (
                <RoundedMedia>
                  <video
                    controls
                    style={{ width: '100%', display: 'block' }}
                  >
                    <source src={block.publicUrl} />
                  </video>
                </RoundedMedia>
              )}

              {block.caption ? (
                <figcaption style={{ fontSize: 13, opacity: 0.75, marginTop: 8 }}>
                  {block.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </section>
      ) : null}

      {post.lead ? (
        <article style={{ lineHeight: 1.65 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.lead}
          </ReactMarkdown>
        </article>
      ) : null}
    </main>
  );
}
