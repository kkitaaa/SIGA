import { useMemo } from "react";
import { useAuth } from "../hooks/useAuth";

const normalizeRole = (value) => {
  if (!value) return "";

  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
};

export function useCurrentUser() {
  const { usuario, rol, token, cargando } = useAuth();

  const normalizedRole = normalizeRole(rol);

  const user = useMemo(
    () => ({
      nombre: usuario?.nombre || usuario?.primer_nombre || "Usuario",
      email: usuario?.email || "usuario@ejemplo.com",
      rol,
      roleKey: normalizedRole,
    }),
    [usuario, rol, normalizedRole],
  );

  return {
    user,
    role: normalizedRole,
    token,
    cargando,
    isAuthenticated: Boolean(token),
  };
}

export { normalizeRole };
