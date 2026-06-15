import { StorageContext } from '../storage/storage-context.js';
import { crearDocumento } from '../repositories/documento.repository.js';

const storage = new StorageContext();

export const subirDocumento = async (file) => {
  const archivo = await storage.upload(file);

  return crearDocumento({
    nombre: archivo.nombre,
    url: archivo.url,
  });
};