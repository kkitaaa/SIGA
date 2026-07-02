import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";

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
    return <Navigate to="/" replace />;
  }

  // Ahora sí lee correctamente los roles permitidos
  const normalizedRole = normalizeRole(rol);
  const normalizedAllowedRoles = rolesPermitidos.map(normalizeRole);

  if (
    rolesPermitidos.length > 0 &&
    !normalizedAllowedRoles.includes(normalizedRole)
  ) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, 
  rolesPermitidos: PropTypes.arrayOf(PropTypes.string), 
};

export default ProtectedRoute;