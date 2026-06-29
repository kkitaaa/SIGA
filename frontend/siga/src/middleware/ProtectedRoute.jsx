import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, rolesPermitidos = [] }) {
  const { estaAutenticado, cargando, rol } = useAuth();

  if (cargando) {
    return <p>Cargando...</p>;
  }

  if (!estaAutenticado()) {
    // Si no tiene token, se va al login
    return <Navigate to="/" replace />;
  }

  // Ahora sí lee correctamente los roles permitidos
  if (
    rolesPermitidos.length > 0 &&
    !rolesPermitidos.includes(rol)
  ) {
    // Si el usuario no tiene el rol necesario, lo mandamos al inicio
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default ProtectedRoute;