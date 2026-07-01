// src/repositories/usuario.repository.js
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

  async findAllConRol() {
    const usuarios = await prisma.usuario.findMany({
      include: {
        roles: { include: { rol: true } },
        cuenta: { select: { email: true } },
      },
    });

    return usuarios.map((u) => ({
      id_usuario: u.id_usuario,
      nombre: `${u.primer_nombre} ${u.primer_apellido}`,
      correo: u.cuenta?.email || "sin correo",
      rol: u.roles[0]?.rol.nombre_rol || "SinRol",
    }));
  }
}
