export const obtenerUsuariosSinRol = async () => {
  return prisma.usuario.findMany({
    where: {
      usuario_rol: { none: {} }
    },
    select: {
      id: true,
      nombre: true,
      email: true
    }
  });
};
