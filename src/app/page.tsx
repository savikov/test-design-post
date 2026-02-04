import Link from 'next/link';
import { SupabasePostsRepository } from '@/lib/infrastructure/supabasePostsRepo';
import { PostsService } from '@/lib/core/postsService';
import { SupabaseStorageRepository } from '@/lib/infrastructure/supabaseStorageRepo';
import { CoverImage } from '@/components/CoverImage';

export default async function Home() {
  const service = new PostsService(new SupabasePostsRepository());
  const posts = await service.listPublished(null);
  const storageRepo = new SupabaseStorageRepository();

  const sortedPosts = [...posts].sort((a, b) => {
    const aTime = a.postedAt ? new Date(a.postedAt).getTime() : 0;
    const bTime = b.postedAt ? new Date(b.postedAt).getTime() : 0;
    return bTime - aTime;
  });

  return (
    <main style={{ maxWidth: 1200, margin: '64px auto 96px', padding: '0 20px' }}>
      <div style={{ marginBottom: 16 }}>
        <img
          src="/brand/logo.svg"
          alt="CDEK DESIGN"
          style={{ height: 22, width: 'auto', display: 'block' }}
        />
      </div>
      <p
        style={{
          opacity: 0.7,
          marginBottom: 64,
          fontSize: 24,
          lineHeight: 1.4,
          maxWidth: 560,
        }}
      >
        Витрина продуктового дизайна команды CDEK
      </p>

      {sortedPosts.length === 0 ? (
        <div style={{ opacity: 0.6 }}>
          Нет опубликованных постов
        </div>
      ) : (
        <ul className="posts-grid" style={{ padding: 0, listStyle: 'none' }}>
          {sortedPosts.map((p, index) => {
            const designers = p.designers ?? [];
            const designerNames = designers
              .map((designer) => designer.name)
              .filter(Boolean)
              .join(', ');
            const designerAvatars = designers
              .filter((designer) => designer.avatarUrl)
              .map((designer) => designer.avatarUrl as string);
            const coverUrl = storageRepo.getPublicUrl('Media', `posts/${p.id}/1.png`);
            const fallbackBlock = (p.media ?? []).find((block) => block.type === 'image') ?? null;
            const fallbackUrl = fallbackBlock
              ? storageRepo.getPublicUrl(fallbackBlock.bucket, fallbackBlock.storageKey)
              : null;
            const isHero = index === 0;
            const mediaClass = 'post-card__media post-card__media--square';

            return (
              <li key={p.id} className={`post-card-item${isHero ? ' post-card-item--hero' : ''}`}>
                <Link
                  href={`/post/${p.id}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                  }}
                  className="post-card"
                >
                  <div className={mediaClass}>
                    <CoverImage
                      primarySrc={coverUrl}
                      fallbackSrc={fallbackUrl}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <div className="post-card__overlay">
                    {p.productTitle ? (
                      <div className="post-card__product">{p.productTitle}</div>
                    ) : null}
                    <div className="post-card__title">{p.title}</div>
                    {designerNames ? (
                      <div className="post-card__designers">
                        {designerAvatars.length > 0 ? (
                          <span className="post-card__avatars">
                            {designerAvatars.map((avatarUrl, avatarIndex) => (
                              <span
                                key={`${avatarUrl}-${avatarIndex}`}
                                className="post-card__avatar"
                              >
                                <img
                                  src={avatarUrl}
                                  alt=""
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                              </span>
                            ))}
                          </span>
                        ) : null}
                        <span className="post-card__names">{designerNames}</span>
                      </div>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
