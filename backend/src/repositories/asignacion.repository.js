import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class AsignacionRepository {
  async verificarRolAdministrativo(idUsuarioActual) {
    return prisma.usuario_rol.findFirst({
      where: {
        id_usuario: idUsuarioActual,
        rol: { nombre_rol: "Administrativo" },
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

  async asignarRol(idUsuarioDestino, idRolAsignado) {
    return prisma.usuario_rol.create({
      data: {
        id_usuario: Number(idUsuarioDestino),
        id_rol: Number(idRolAsignado),
      },
    });
  }
}
