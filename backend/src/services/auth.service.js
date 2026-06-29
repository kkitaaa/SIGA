import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/auth.repository.js";

const repo = new AuthRepository();

export const AuthService = {
  async registerUser(datosUsuario) {
    const { nombre, email, password, rut } = datosUsuario;

    const [primer_nombre, ...apellidos] = (nombre || "").split(" ");
    const primer_apellido = apellidos.join(" ") || "Sin Apellido";

    const hashedPassword = await bcrypt.hash(password, 10);

    return repo.createUsuario({
      rut,
      primer_nombre,
      primer_apellido,
      email,
      contraseña: hashedPassword,
    });
  },

  async loginUser(credenciales) {
    const { email, password } = credenciales;

    const cuenta = await repo.findCuentaByEmail(email);
    if (!cuenta) throw new Error("CREDENCIALES_INVALIDAS");

    const passwordValida = await bcrypt.compare(password, cuenta.contraseña);
    if (!passwordValida) throw new Error("CREDENCIALES_INVALIDAS");

    const role = cuenta.usuario.roles[0]?.rol.nombre_rol || "SinRol";
    const nombreCompleto = [
      cuenta.usuario.primer_nombre,
      cuenta.usuario.primer_apellido,
    ].filter(Boolean).join(" ").trim();

    const token = jwt.sign(
      { id_usuario: cuenta.id_usuario, email: cuenta.email, role },
      process.env.JWT_SECRET || "firma_secreta_siga",
      { expiresIn: "2h" },
    );

    return {
      token,
      usuario: cuenta.usuario,
      role,
      nombre: nombreCompleto || cuenta.usuario.primer_nombre,
      email: cuenta.email,
    };
  },
};
