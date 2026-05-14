import prisma from '../config/prisma.js';

export const asignarRol = async (idUsuarioDestino, idRolAsignado, idUsuarioActual) => {
  // Verificar si el usuario actual tiene rol Administrativo
  const esAdministrativo = await prisma.usuario_rol.findFirst({
    where: {
      id_usuario: idUsuarioActual,
      rol: { nombre_rol: 'Administrativo' },
    },
  });

  if (!esAdministrativo) {
    throw new Error('No tienes permisos para asignar roles');
  }

  // Verificar que el usuario destino no tenga rol aún
  const tieneRol = await prisma.usuario_rol.findFirst({
    where: { id_usuario: idUsuarioDestino },
  });

  if (tieneRol) {
    throw new Error('El usuario ya tiene un rol asignado');
  }

  // Asignar rol al usuario destino
  return prisma.usuario_rol.create({
    data: {
      id_usuario: idUsuarioDestino,
      id_rol: idRolAsignado,
    },
  });
};
