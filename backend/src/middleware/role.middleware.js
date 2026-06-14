import { verificarRolUsuario } from "../services/rol.service.js";
import { ROLES } from "../constants/roles.js";

export const verifyRole = (requiredRole) => {
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

      const tieneRol = await verificarRolUsuario(userId, requiredRole);
      if (!tieneRol) {
        return res.status(403).json({
          error: "Acceso denegado: no tienes los permisos necesarios",
        });
      }

      next();
    } catch (error) {
      console.error(`Error verificando el rol ${requiredRole}:`, error);
      res.status(500).json({
        error: "Error interno del servidor al validar permisos",
      });
    }
  };
};
