// auth.service.js
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const AuthService = {
  async registerUser(datosUsuario) {
    const { nombre, email, password, rut } = datosUsuario;

    const [primer_nombre, ...apellidos] = (nombre || "").split(" ");
    const primer_apellido = apellidos.join(" ") || "Sin Apellido";

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.usuario.create({
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
            contraseña: hashedPassword,
            estado: "Activo",
          },
        },
      },
    });

    return nuevoUsuario;
  },

  async loginUser(credenciales) {
    const { email, password } = credenciales;

    const cuenta = await prisma.cuenta.findUnique({
      where: { email },
      include: {
        usuario: {
          include: {
            roles: { include: { rol: true } }
          }
        }
      }
    });

    if (!cuenta) throw new Error("CREDENCIALES_INVALIDAS");

    const passwordValida = await bcrypt.compare(password, cuenta.contraseña);
    if (!passwordValida) throw new Error("CREDENCIALES_INVALIDAS");

    const role = cuenta.usuario.roles[0]?.rol.nombre_rol || "SinRol";

    const token = jwt.sign(
      { id_usuario: cuenta.id_usuario, email: cuenta.email, role },
      process.env.JWT_SECRET || "firma_secreta_siga",
      { expiresIn: "2h" }
    );

    return { token, usuario: cuenta.usuario, role };
  }
};
