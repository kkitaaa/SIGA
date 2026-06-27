import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [rol, setRol] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Cargar sesión almacenada
  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");
    const rolGuardado = localStorage.getItem("role");

    if (tokenGuardado && rolGuardado) {
      setToken(tokenGuardado);
      setRol(rolGuardado);
    }

    setCargando(false);
  }, []);

  const login = (tokenJWT, rolUsuario) => {
    setToken(tokenJWT);
    setRol(rolUsuario);

    localStorage.setItem("token", tokenJWT);
    localStorage.setItem("role", rolUsuario);
  };

  const logout = () => {
    setToken(null);
    setRol(null);

    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  const estaAutenticado = () => {
    return !!token;
  };

  const tieneRol = (...roles) => {
    return roles.includes(rol);
  };

  const obtenerHeaders = () => {
    if (!token) {
      return {
        "Content-Type": "application/json",
      };
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        rol,
        cargando,
        login,
        logout,
        estaAutenticado,
        tieneRol,
        obtenerHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return contexto;
}