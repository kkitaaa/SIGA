import { LocalStorageStrategy } from './strategies/local-storage.strategy.js';
import { SupabaseStorageStrategy } from './strategies/supabase-storage.strategy.js';

export class StorageContext {
  constructor() {
    this.strategy =
      process.env.STORAGE_DRIVER === 'local'
        ? new LocalStorageStrategy()
        : new SupabaseStorageStrategy();
  }

  async upload(file) {
    return this.strategy.upload(file);
  }
}