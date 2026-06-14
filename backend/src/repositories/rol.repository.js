import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class RolRepository {
  async findAllRoles() {
    return prisma.rol.findMany();
  }

  async usuarioTieneRol(userId, requiredRole) {
    return prisma.usuario_rol.findFirst({
      where: {
        id_usuario: userId,
        rol: { nombre_rol: requiredRole },
      },
    });
  }
}
