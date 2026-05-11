import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const AuthService = {
  async registerUser(datosUsuario) {
    const { nombre, email, password, rol } = datosUsuario;

    const [primer_nombre, ...apellidos] = nombre.split(" ");
    const primer_apellido = apellidos.join(" ") || "Sin Apellido";
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        rut: "00000000-0", // **Dato temporal**
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

  // Lógica de login
  async loginUser(credenciales) {
    const { email, password } = credenciales;

    // Busca la cuenta por email e incluye los datos del usuario
    const cuenta = await prisma.cuenta.findUnique({
      where: { email },
      include: { usuario: true }
    });

    if (!cuenta) throw new Error("CREDENCIALES_INVALIDAS");

    // Verifica la contraseña
    const passwordValida = await bcrypt.compare(password, cuenta.contraseña);
    if (!passwordValida) throw new Error("CREDENCIALES_INVALIDAS");

    //  Genera el Token JWT
    const token = jwt.sign(
      { id_usuario: cuenta.id_usuario, email: cuenta.email },
      process.env.JWT_SECRET || "firma_secreta_siga",
      { expiresIn: "2h" }
    );

    return { token, usuario: cuenta.usuario };
  }
};