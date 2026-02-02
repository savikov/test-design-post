import type { Post, PostsRepository, PostListItem } from '@/lib/infrastructure/db';

export class PostsService {
  constructor(private repo: PostsRepository) {}

  listPublished(productSlug?: string | null): Promise<PostListItem[]> {
    return this.repo.listPublished({ productSlug: productSlug ?? null });
  }

  getPostById(id: string): Promise<Post | null> {
    return this.repo.getById(id);
  }
}
