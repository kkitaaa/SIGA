import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class AuthRepository {
  async createUsuario({ rut, primer_nombre, primer_apellido, email, contraseña }) {
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
}
