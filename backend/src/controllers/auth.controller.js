import { AuthService } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const usuario = await AuthService.registerUser(req.body);
    res.status(201).json({
      mensaje: "Usuario registrado con éxito",
      usuario: usuario.primer_nombre,
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res
      .status(500)
      .json({ error: "Error al registrar el usuario en el servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const data = await AuthService.loginUser(req.body);
    res.status(200).json({
      token: data.token,
      role: data.role,
      mensaje: `¡Bienvenido ${data.usuario.primer_nombre}!`,
    });
  } catch (error) {
    if (error.message === "CREDENCIALES_INVALIDAS") {
      return res
        .status(401)
        .json({ error: "El correo o la contraseña son incorrectos" });
    }
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
