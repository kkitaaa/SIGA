import fs from 'fs/promises';
import path from 'path';

export class LocalStorageStrategy {
  async upload(file) {
    const originalName = path.basename(file.originalname);
    const fileName = `${Date.now()}-${originalName}`;
    const uploadDir = path.join(process.cwd(), 'uploads');

    const filePath = path.join(uploadDir, fileName);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, file.buffer);

    return {
      nombre: originalName,
      url: `/uploads/${fileName}`,
    };
  }
}
