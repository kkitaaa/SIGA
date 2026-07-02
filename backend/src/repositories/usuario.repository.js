// src/repositories/usuario.repository.js
import prisma from "../config/prisma.js";

const mapUsuario = (usuario) => ({
  id_usuario: usuario.id_usuario,
  nombre: `${usuario.primer_nombre} ${usuario.primer_apellido}`.trim(),
  primer_nombre: usuario.primer_nombre,
  segundo_nombre: usuario.segundo_nombre,
  primer_apellido: usuario.primer_apellido,
  segundo_apellido: usuario.segundo_apellido,
  rut: usuario.rut,
  numero_telefonico: usuario.numero_telefonico,
  correo: usuario.cuenta?.email || "sin correo",
  rol: usuario.roles[0]?.rol.nombre_rol || "SinRol",
});

export class UsuarioRepository {
  async findAll() {
    return prisma.usuario.findMany({ include: { cuenta: true, roles: true } });
  }

  async create(data) {
    return prisma.usuario.create({ data });
  }

  async findUsuariosSinRol() {
    const usuarios = await prisma.usuario.findMany({
      where: { roles: { none: {} } },
      include: {
        roles: { include: { rol: true } },
        cuenta: { select: { email: true } },
      },
    });

    return usuarios.map(mapUsuario);
  }

  async findAllConRol() {
    const usuarios = await prisma.usuario.findMany({
      include: {
        roles: { include: { rol: true } },
        cuenta: { select: { email: true } },
      },
    });

    return usuarios.map(mapUsuario);
  }

  async update(idUsuario, data) {
    const allowedUsuarioFields = [
      "rut",
      "primer_nombre",
      "segundo_nombre",
      "primer_apellido",
      "segundo_apellido",
      "numero_telefonico",
    ];

    const usuarioData = Object.fromEntries(
      Object.entries(data).filter(([key]) => allowedUsuarioFields.includes(key)),
    );

    const email = typeof data.email === "string" ? data.email.trim() : undefined;

    const usuarioActualizado = await prisma.usuario.update({
      where: { id_usuario: idUsuario },
      data: usuarioData,
      include: {
        roles: { include: { rol: true } },
        cuenta: { select: { email: true } },
      },
    });

    if (email) {
      const cuentaExistente = await prisma.cuenta.findUnique({ where: { id_usuario: idUsuario } });
      if (cuentaExistente) {
        await prisma.cuenta.update({
          where: { id_usuario: idUsuario },
          data: { email },
        });
      }
    }

    return {
      id_usuario: usuarioActualizado.id_usuario,
      nombre: `${usuarioActualizado.primer_nombre} ${usuarioActualizado.primer_apellido}`.trim(),
      primer_nombre: usuarioActualizado.primer_nombre,
      segundo_nombre: usuarioActualizado.segundo_nombre,
      primer_apellido: usuarioActualizado.primer_apellido,
      segundo_apellido: usuarioActualizado.segundo_apellido,
      rut: usuarioActualizado.rut,
      numero_telefonico: usuarioActualizado.numero_telefonico,
      correo: email || usuarioActualizado.cuenta?.email || "sin correo",
      rol: usuarioActualizado.roles[0]?.rol.nombre_rol || "SinRol",
    };
  }
}
