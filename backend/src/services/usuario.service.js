import prisma from "../config/prisma.js";

export const obtenerUsuariosSinRol = async () => {
  return prisma.usuario.findMany({
    where: {
      roles: { none: {} },
    },
    select: {
      id_usuario: true,
      primer_nombre: true,
      primer_apellido: true,
      cuenta: {
        select: { email: true },
      },
    },
  });
};
