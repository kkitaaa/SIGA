import { PrismaClient } from "@prisma/client";
import prisma from "../config/prisma.js";

export class UsuarioRepository {
  async findAll() {
    return prisma.usuario.findMany({ include: { cuenta: true, roles: true } });
  }

  async create(data) {
    return prisma.usuario.create({ data });
  }

  async findUsuariosSinRol() {
    return prisma.usuario.findMany({
      where: { roles: { none: {} } },
      select: {
        id_usuario: true,
        primer_nombre: true,
        primer_apellido: true,
        cuenta: { select: { email: true } },
      },
    });
  }
}
