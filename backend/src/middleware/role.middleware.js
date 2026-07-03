import { verificarRolUsuario } from "../services/rol.service.js";

export const verifyRole = (...requiredRoles) => {
  const rolesPermitidos = requiredRoles
    .flatMap((rol) => (Array.isArray(rol) ? rol : [rol]))
    .filter(Boolean);

  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "No autorizado" });
      }

      const userId = req.user.id_usuario || req.user.id;
      if (!userId) {
        return res.status(401).json({
          error: "Token inválido: falta información del usuario",
        });
      }

      for (const rolPermitido of rolesPermitidos) {
        const tieneRol = await verificarRolUsuario(userId, rolPermitido);
        if (tieneRol) {
          return next();
        }
      }

      return res.status(403).json({
        error: "Acceso denegado: no tienes los permisos necesarios",
      });
    } catch (error) {
      console.error(
        `Error verificando los roles ${rolesPermitidos.join(", ")}:`,
        error,
      );
      res.status(500).json({
        error: "Error interno del servidor al validar permisos",
      });
    }
  };
};
