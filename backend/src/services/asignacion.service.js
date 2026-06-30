import { AsignacionRepository } from "../repositories/asignacion.repository.js";

const repo = new AsignacionRepository();

export const asignarRol = async (
  idUsuarioDestino,
  idRolAsignado,
  idUsuarioActual,
) => {
  const parsedRolId =
    typeof idRolAsignado === "string" ? Number(idRolAsignado) : idRolAsignado;

  if (!Number.isInteger(parsedRolId)) {
    throw new Error("El id de rol debe ser un número entero");
  }

  // Verificar permisos
  const esAdministrativo = await repo.verificarRolAdministrativo(idUsuarioActual);
  if (!esAdministrativo) throw new Error("No tienes permisos para asignar roles");

  // Verificar existencia del usuario
  const usuarioExiste = await repo.usuarioExiste(idUsuarioDestino);
  if (!usuarioExiste) throw new Error("El usuario no existe");

  // Verificar existencia del rol
  const rolExiste = await repo.rolExiste(parsedRolId);
  if (!rolExiste) throw new Error("El rol no existe");

  // Verificar si ya tiene rol
  const tieneRol = await repo.usuarioTieneRol(idUsuarioDestino);
  if (tieneRol) throw new Error("El usuario ya tiene un rol asignado");

  // Asignar rol
  return repo.asignarRol(idUsuarioDestino, parsedRolId);
};

export const revocarRol = async (idUsuarioDestino, idUsuarioActual) => {
  // Verificar permisos
  const esAdministrativo = await repo.verificarRolAdministrativo(idUsuarioActual);
  if (!esAdministrativo) throw new Error("No tienes permisos para revocar roles");

  // Verificar existencia del usuario
  const usuarioExiste = await repo.usuarioExiste(idUsuarioDestino);
  if (!usuarioExiste) throw new Error("El usuario no existe");

  // Verificar si tiene rol asignado
  const rolAsignado = await repo.usuarioTieneRol(idUsuarioDestino);
  if (!rolAsignado) throw new Error("El usuario no tiene un rol asignado");

  // Revocar rol
  await repo.revocarRol(idUsuarioDestino);

  return { mensaje: "Rol revocado correctamente" };
};
