import { AuthService } from "../services/auth.service.js";
import { RegisterDTO } from "../dto/register.dto.js";
import { LoginDTO } from "../dto/login.dto.js";

export const register = async (req, res) => {
  try {
    const registerData = new RegisterDTO(req.body);

    const usuario = await AuthService.registerUser(registerData);
    res.status(201).json({
      mensaje: "Usuario registrado con éxito",
      usuario: usuario.primer_nombre,
    });
  } catch (error) {
    // Capturar errores de validación del DTO
    if (error.message.startsWith("VALIDATION_ERROR:")) {
      return res
        .status(400)
        .json({ error: error.message.replace("VALIDATION_ERROR: ", "") });
    }

    console.error("Error en registro:", error);
    res
      .status(500)
      .json({ error: "Error al registrar el usuario en el servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const loginData = new LoginDTO(req.body);

    const data = await AuthService.loginUser(loginData);
    // Set refresh token in a httpOnly cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    };

    res.cookie("refreshToken", data.refreshToken, cookieOptions);

    res.status(200).json({
      token: data.token,
      role: data.role,
      nombre: data.nombre,
      email: data.email,
      usuario: data.usuario,
      mensaje: `¡Bienvenido ${data.nombre || data.usuario.primer_nombre}!`,
    });
  } catch (error) {
    if (error.message.startsWith("VALIDATION_ERROR:")) {
      return res
        .status(400)
        .json({ error: error.message.replace("VALIDATION_ERROR: ", "") });
    }

    if (error.message === "CREDENCIALES_INVALIDAS") {
      return res
        .status(401)
        .json({ error: "El correo o la contraseña son incorrectos" });
    }

    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const refresh = async (req, res) => {
  try {
    // Read refresh token from httpOnly cookie
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
      return res.status(400).json({ error: "refreshToken requerido" });

    const data = await AuthService.refreshToken(refreshToken);
    if (!data) return res.status(401).json({ error: "Refresh token inválido" });

    // set new refresh token cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    };

    res.cookie("refreshToken", data.refreshToken, cookieOptions);

    // return new access token
    res.status(200).json({ token: data.token });
  } catch (error) {
    console.error("Error en refresh:", error);
    res.status(500).json({ error: "Error interno al refrescar token" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
      return res.status(400).json({ error: "refreshToken requerido" });

    await AuthService.revokeRefreshToken(refreshToken);
    // clear cookie
    res.clearCookie("refreshToken", { path: "/" });
    res.status(200).json({ mensaje: "Sesión cerrada" });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};
