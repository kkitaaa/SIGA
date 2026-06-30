import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [rol, setRol] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Cargar sesión al iniciar
  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");
    const rolGuardado = localStorage.getItem("role");
    const usuarioGuardado = localStorage.getItem("usuario");

    if (tokenGuardado) setToken(tokenGuardado);
    if (rolGuardado) setRol(rolGuardado);
    if (usuarioGuardado) setUsuario(JSON.parse(usuarioGuardado));

    setCargando(false);
  }, []);

  const login = (tokenJWT, rolUsuario, datosUsuario = null) => {
    setToken(tokenJWT);
    setRol(rolUsuario);
    setUsuario(datosUsuario);

    localStorage.setItem("token", tokenJWT);
    localStorage.setItem("role", rolUsuario);
    if (datosUsuario) localStorage.setItem("usuario", JSON.stringify(datosUsuario));
  };

  const logout = () => {
    setToken(null);
    setRol(null);
    setUsuario(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider value={{ token, rol, usuario, cargando, login, logout, estaAutenticado: () => !!token, tieneRol: (...roles) => roles.includes(rol) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return contexto;
}