import prisma from "../config/prisma.js";

export const asignarRol = async (
  idUsuarioDestino,
  idRolAsignado,
  idUsuarioActual,
) => {
  const parsedRolId =
    typeof idRolAsignado === "string" ? Number(idRolAsignado) : idRolAsignado;

  if (!Number.isInteger(parsedRolId)) {
    throw new Error("El id de rol debe ser un número entero");
  }

  // Verificar permisos
  const esAdministrativo = await prisma.usuario_rol.findFirst({
    where: {
      id_usuario: idUsuarioActual,
      rol: {
        nombre_rol: "Administrativo",
      },
    },
  });

  if (!esAdministrativo) {
    throw new Error("No tienes permisos para asignar roles");
  }

  // Verificar existencia del usuario
  const usuarioExiste = await prisma.usuario.findUnique({
    where: {
      id_usuario: Number(idUsuarioDestino),
    },
  });

  if (!usuarioExiste) {
    throw new Error("El usuario no existe");
  }

  // Verificar existencia del rol
  const rolExiste = await prisma.rol.findUnique({
    where: {
      id_rol: parsedRolId,
    },
  });

  if (!rolExiste) {
    throw new Error("El rol no existe");
  }

  // Verificar si ya tiene rol
  const tieneRol = await prisma.usuario_rol.findFirst({
    where: {
      id_usuario: Number(idUsuarioDestino),
    },
  });

  if (tieneRol) {
    throw new Error("El usuario ya tiene un rol asignado");
  }

  // Asignar rol
  return prisma.usuario_rol.create({
    data: {
      id_usuario: Number(idUsuarioDestino),
      id_rol: parsedRolId,
    },
  });
};
