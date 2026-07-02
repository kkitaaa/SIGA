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

  async cambiarRol(idUsuarioDestino, idRolAsignado, idTipoFuncionario) {
    return prisma.$transaction(async (tx) => {
      const rolActual = await tx.usuario_rol.findFirst({
        where: { id_usuario: Number(idUsuarioDestino) },
      });

      if (rolActual) {
        await tx.usuario_rol.delete({
          where: {
            id_usuario_id_rol: {
              id_usuario: rolActual.id_usuario,
              id_rol: rolActual.id_rol,
            },
          },
        });
      }

      const asignacion = await tx.usuario_rol.create({
        data: {
          id_usuario: Number(idUsuarioDestino),
          id_rol: Number(idRolAsignado),
        },
      });

      if (idTipoFuncionario) {
        await tx.funcionario.upsert({
          where: {
            id_usuario: Number(idUsuarioDestino),
          },
          update: {
            id_tipo_funcionario: Number(idTipoFuncionario),
          },
          create: {
            id_usuario: Number(idUsuarioDestino),
            id_tipo_funcionario: Number(idTipoFuncionario),
          },
        });
      }

      return asignacion;
    });
  }

  async cambiarRol(idUsuarioDestino, idRolAsignado, idTipoFuncionario) {
    return this.asignarRol(idUsuarioDestino, idRolAsignado, idTipoFuncionario);
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

  async verificarRolGestionUsuarios(idUsuarioActual) {
    return prisma.usuario_rol.findFirst({
      where: {
        id_usuario: idUsuarioActual,
        rol: {
          nombre_rol: {
            in: ["Administrativo", "Directiva", "Coordinador Administrativo"],
          },
        },
      },
    });
  }
}
