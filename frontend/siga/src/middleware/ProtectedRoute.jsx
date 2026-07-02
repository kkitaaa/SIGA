import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children, rolesPermitidos = [] }) {
  const { estaAutenticado, cargando, rol } = useAuth();

  if (cargando) {
    return <p>Cargando...</p>;
  }

  if (!estaAutenticado()) {
    return <Navigate to="/" replace />;
  }

  if (
    rolesPermitidos.length > 0 &&
    !rolesPermitidos.includes(rol)
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