export interface StorageRepository {
  getPublicUrl(bucket: string, key: string): string;
}
