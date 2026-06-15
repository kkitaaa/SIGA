import fs from 'fs/promises';
import path from 'path';

export class LocalStorageStrategy {
  async upload(file) {
    const fileName = `${Date.now()}-${file.originalname}`;

    const filePath = path.join(
      process.cwd(),
      'uploads',
      fileName,
    );

    await fs.writeFile(filePath, file.buffer);

    return {
      nombre: file.originalname,
      url: `/uploads/${fileName}`,
    };
  }
}