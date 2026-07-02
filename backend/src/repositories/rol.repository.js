import prisma from "../config/prisma.js";
import { ROLES } from "../constants/roles.js";

export class RolRepository {
  async ensureDefaultRoles() {
    const rolesPorDefecto = Object.values(ROLES);
    const rolesExistentes = await prisma.rol.findMany({
      select: { nombre_rol: true },
    });
    const nombresExistentes = new Set(
      rolesExistentes.map((rol) => rol.nombre_rol),
    );

    for (const nombreRol of rolesPorDefecto) {
      if (!nombresExistentes.has(nombreRol)) {
        await prisma.rol.create({ data: { nombre_rol: nombreRol } });
        nombresExistentes.add(nombreRol);
      }
    }

    return prisma.rol.findMany();
  }

  async findAllRoles() {
    return this.ensureDefaultRoles();
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
