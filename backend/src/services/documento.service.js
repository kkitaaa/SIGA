import { StorageContext } from '../storage/storage-context.js';
import { crearDocumento } from '../repositories/documento.repository.js';

const storage = new StorageContext();

export const subirDocumento = async (file, idUsuario) => {
  const archivo = await storage.upload(file);

  return crearDocumento({
    url: archivo.url,
    id_usuario: idUsuario,
  });
};
