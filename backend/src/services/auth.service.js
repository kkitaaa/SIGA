import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { AuthRepository } from "../repositories/auth.repository.js";

const repo = new AuthRepository();

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

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
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    const token = jwt.sign(
      { id_usuario: cuenta.id_usuario, email: cuenta.email, role },
      process.env.JWT_SECRET || "firma_secreta_siga",
      { expiresIn: "2h" },
    );

    // create refresh token and persist
    const refreshToken = randomUUID();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    await repo.createRefreshToken({
      token: refreshToken,
      id_cuenta: cuenta.id_cuenta,
      expiresAt,
    });

    return {
      token,
      refreshToken,
      usuario: cuenta.usuario,
      role,
      nombre: nombreCompleto || cuenta.usuario.primer_nombre,
      email: cuenta.email,
    };
  },

  async refreshToken(oldRefreshToken) {
    const row = await repo.findRefreshToken(oldRefreshToken);
    if (!row) return null;
    if (row.revoked) return null;
    if (new Date(row.expiresAt) < new Date()) return null;

    // rotate refresh token: revoke old, create new
    await repo.revokeRefreshToken(oldRefreshToken);
    const newToken = randomUUID();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    await repo.createRefreshToken({
      token: newToken,
      id_cuenta: row.id_cuenta,
      expiresAt,
    });

    // create access token using id_usuario and role: fetch cuenta by id
    const refreshed = await repo.findRefreshToken(newToken);
    const cuentaId = refreshed.id_cuenta;
    // fetch cuenta with usuario and roles
    const cuentaObj = await repo.findCuentaById(cuentaId);
    const role = cuentaObj.usuario.roles[0]?.rol.nombre_rol || "SinRol";
    const token = jwt.sign(
      { id_usuario: cuentaObj.id_usuario, email: cuentaObj.email, role },
      process.env.JWT_SECRET || "firma_secreta_siga",
      { expiresIn: "2h" },
    );

    return { token, refreshToken: newToken };
  },

  async revokeRefreshToken(token) {
    await repo.revokeRefreshToken(token);
  },
};
