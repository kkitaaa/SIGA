import { StorageStrategy } from '../storage.interface.js';
import { supabase } from '../../config/supabase.js';

export class SupabaseStorageStrategy extends StorageStrategy {
  async upload(file) {
    const fileName = `${Date.now()}-${file.originalname}`;

    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw new Error('Error al subir archivo');
    }

    const { data } = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(fileName);

    return {
      nombre: file.originalname,
      url: data.publicUrl,
    };
  }
}