import { supabase } from './supabaseClient';
import type { StorageRepository } from './storage';

export class SupabaseStorageRepository implements StorageRepository {
  getPublicUrl(bucket: string, key: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(key);
    return data.publicUrl;
  }
}
