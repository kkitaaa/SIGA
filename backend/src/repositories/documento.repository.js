import prisma from '../config/prisma.js';

export const crearDocumento = async (data) => {
  return prisma.documento.create({
    data,
  });
};