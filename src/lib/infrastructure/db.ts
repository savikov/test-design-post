export type Post = {
  id: string;
  title: string;
  bodyMd: string;
  status: PostStatus;
  authorName: string;
  postedAt: string | null;
  productSlug: string | null;
  productTitle: string | null;
};

export interface PostsRepository {
  listPublished(params?: { productSlug?: string | null }): Promise<PostListItem[]>;
  getById(id: string): Promise<Post | null>;
}
