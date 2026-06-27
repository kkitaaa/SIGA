import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, roles = [] }) {
  const { estaAutenticado, cargando, rol } = useAuth();

  if (cargando) {
    return <p>Cargando...</p>;
  }

  if (!estaAutenticado()) {
    return <Navigate to="/" replace />;
  }

  if (
    roles.length > 0 &&
    !roles.includes(rol)
  ) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default ProtectedRoute;