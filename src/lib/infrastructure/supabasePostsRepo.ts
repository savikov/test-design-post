import { supabase } from './supabaseClient';
import type { Post, PostListItem, PostsRepository } from './db';

export class SupabasePostsRepository implements PostsRepository {
  async listPublished(params?: { productSlug?: string | null }): Promise<PostListItem[]> {
    let query = supabase
      .from('posts')
      .select(`
        id,
        title,
        author_name,
        posted_at,
        products:product_id ( slug, title )
      `)
      .eq('status', 'published')
      .order('posted_at', { ascending: false });

    if (params?.productSlug) {
      query = query.eq('products.slug', params.productSlug);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      id: row.id,
      title: row.title,
      authorName: row.author_name,
      postedAt: row.posted_at,
      productSlug: row.products?.slug ?? null,
      productTitle: row.products?.title ?? null,
    }));
  }

  async getById(id: string): Promise<Post | null> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        body_md,
        status,
        author_name,
        posted_at,
        products:product_id ( slug, title )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      bodyMd: data.body_md,
      status: data.status,
      authorName: data.author_name,
      postedAt: data.posted_at,
      productSlug: data.products?.slug ?? null,
      productTitle: data.products?.title ?? null,
    };
  }
}
