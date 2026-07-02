import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [rol, setRol] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const leerUsuarioDesdeStorage = () => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (!usuarioGuardado) return null;

    try {
      return JSON.parse(usuarioGuardado);
    } catch {
      return null;
    }
  };

  // Cargar sesión almacenada
  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");
    const rolGuardado = localStorage.getItem("role");
    const usuarioGuardado = leerUsuarioDesdeStorage();
    const idGuardado = localStorage.getItem("id_usuario");

    if (tokenGuardado) {
      setToken(tokenGuardado);
    }

    if (rolGuardado) {
      setRol(rolGuardado);
    }

    if (usuarioGuardado) {
      setUsuario({ ...usuarioGuardado, id_usuario: usuarioGuardado.id_usuario || usuarioGuardado.id || idGuardado });
    }

    setCargando(false);
  }, []);

  const login = (tokenJWT, rolUsuario, datosUsuario = null) => {
    setToken(tokenJWT);
    setRol(rolUsuario);
    setUsuario(datosUsuario);

    localStorage.setItem("token", tokenJWT);
    localStorage.setItem("role", rolUsuario);

    if (datosUsuario) {
      localStorage.setItem("usuario", JSON.stringify(datosUsuario));
      if (datosUsuario.id_usuario || datosUsuario.id) {
        localStorage.setItem("id_usuario", String(datosUsuario.id_usuario || datosUsuario.id));
      }
    } else {
      localStorage.removeItem("usuario");
      localStorage.removeItem("id_usuario");
    }
  };

  const logout = () => {
    setToken(null);
    setRol(null);
    setUsuario(null);

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("usuario");
    localStorage.removeItem("id_usuario");
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
        usuario,
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