import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, rolesPermitidos = [] }) {
  const { estaAutenticado, cargando, rol } = useAuth();

  const normalizeRole = (value) => {
    if (!value) return "";
    return String(value)
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");
  };

  if (cargando) {
    return <p>Cargando...</p>;
  }

  if (!estaAutenticado()) {
    // Si no tiene token, se va al login
    return <Navigate to="/" replace />;
  }

  // Ahora sí lee correctamente los roles permitidos
  const normalizedRole = normalizeRole(rol);
  const normalizedAllowedRoles = rolesPermitidos.map(normalizeRole);

  if (
    rolesPermitidos.length > 0 &&
    !normalizedAllowedRoles.includes(normalizedRole)
  ) {
    // Si el usuario no tiene el rol necesario, lo mandamos al inicio
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default ProtectedRoute;