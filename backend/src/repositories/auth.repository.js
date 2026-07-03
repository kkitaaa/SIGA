import prisma from "../config/prisma.js";

export class AuthRepository {
  async createUsuario({
    rut,
    primer_nombre,
    primer_apellido,
    email,
    contraseña,
  }) {
    return prisma.usuario.create({
      data: {
        rut,
        primer_nombre,
        segundo_nombre: "",
        primer_apellido,
        segundo_apellido: "",
        numero_telefonico: "",
        cuenta: {
          create: {
            email,
            contraseña,
            estado: "Activo",
          },
        },
      },
    });
  }

  async findCuentaByEmail(email) {
    return prisma.cuenta.findUnique({
      where: { email },
      include: {
        usuario: {
          include: {
            roles: { include: { rol: true } },
          },
        },
      },
    });
  }

  async createRefreshToken({ token, id_cuenta, expiresAt }) {
    return prisma.refreshToken.create({
      data: {
        token,
        id_cuenta,
        expiresAt,
      },
    });
  }

  async findRefreshToken(token) {
    return prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  async findCuentaById(id_cuenta) {
    return prisma.cuenta.findUnique({
      where: { id_cuenta },
      include: {
        usuario: {
          include: { roles: { include: { rol: true } } },
        },
      },
    });
  }

  async revokeRefreshToken(token) {
    return prisma.refreshToken.updateMany({
      where: { token },
      data: { revoked: true },
    });
  }
}
