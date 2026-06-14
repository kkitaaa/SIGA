import { RolRepository } from "../repositories/rol.repository.js";

const repo = new RolRepository();

export const listarRoles = async () => {
  return repo.findAllRoles();
};

export const verificarRolUsuario = async (userId, requiredRole) => {
  return repo.usuarioTieneRol(userId, requiredRole);
};
