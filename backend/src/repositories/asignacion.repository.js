import prisma from "../config/prisma.js";

export class AsignacionRepository {
  async verificarRolDirectiva(idUsuarioActual) {
    return prisma.usuario_rol.findFirst({
      where: {
        id_usuario: idUsuarioActual,
        rol: { nombre_rol: "Directiva" },
      },
    });
  }

  async usuarioExiste(idUsuarioDestino) {
    return prisma.usuario.findUnique({
      where: { id_usuario: Number(idUsuarioDestino) },
    });
  }

  async rolExiste(idRolAsignado) {
    return prisma.rol.findUnique({
      where: { id_rol: Number(idRolAsignado) },
    });
  }

  async usuarioTieneRol(idUsuarioDestino) {
    return prisma.usuario_rol.findFirst({
      where: { id_usuario: Number(idUsuarioDestino) },
    });
  }

  async asignarRol(idUsuarioDestino, idRolAsignado, idTipoFuncionario) {
    return prisma.$transaction(async (tx) => {
      // 1. Siempre asignamos el rol
      const asignacion = await tx.usuario_rol.create({
        data: {
          id_usuario: Number(idUsuarioDestino),
          id_rol: Number(idRolAsignado),
        },
      });

      // 2. Si es funcionario, usamos UPSERT en lugar de CREATE
      if (idTipoFuncionario) {
        await tx.funcionario.upsert({
          where: { 
            // Buscamos al funcionario por su ID de usuario (que es único según tu schema)
            id_usuario: Number(idUsuarioDestino) 
          },
          update: {
            // Si ya existía, simplemente le actualizamos la especialidad
            id_tipo_funcionario: Number(idTipoFuncionario)
          },
          create: {
            // Si no existía, lo creamos desde cero
            id_usuario: Number(idUsuarioDestino),
            id_tipo_funcionario: Number(idTipoFuncionario),
          },
        });
      }

      return asignacion;
    });
  }

  async revocarRol(idUsuarioDestino) {
    const rolAsignado = await prisma.usuario_rol.findFirst({
      where: { id_usuario: Number(idUsuarioDestino) },
    });

    if (!rolAsignado) {
      throw new Error("El usuario no tiene un rol asignado");
    }

    return prisma.usuario_rol.delete({
      where: {
        id_usuario_id_rol: {
          id_usuario: rolAsignado.id_usuario,
          id_rol: rolAsignado.id_rol,
        },
      },
    });
  }

  async verificarRolAdministrativo(idUsuarioActual) {
    return prisma.usuario_rol.findFirst({
      where: {
        id_usuario: idUsuarioActual,
        rol: { nombre_rol: "Administrativo" },
      },
    });
  }

}
