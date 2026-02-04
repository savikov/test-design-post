export type Post = {
  id: string;
  title: string;
  lead?: string | null;
  media?: MediaBlock[] | null;
  designers?: Designer[] | null;
  status: PostStatus;
  authorName: string;
  postedAt: string | null;
  productSlug: string | null;
  productTitle: string | null;
};

export type PostStatus = 'draft' | 'published';

export type PostListItem = {
  id: string;
  title: string;
  lead?: string | null;
  media?: MediaBlock[] | null;
  designers?: Designer[] | null;
  authorName: string;
  postedAt: string | null;
  productSlug: string | null;
  productTitle: string | null;
};

export type MediaBlock = {
  type: 'image' | 'video';
  bucket: string;
  storageKey: string;
  caption?: string;
  order?: number;
};

export type Designer = {
  name: string;
  avatarKey?: string;
  avatarUrl?: string;
};

export interface PostsRepository {
  listPublished(params?: { productSlug?: string | null }): Promise<PostListItem[]>;
  getById(id: string): Promise<Post | null>;
}
