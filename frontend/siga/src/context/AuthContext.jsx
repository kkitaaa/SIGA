import React, { createContext, useEffect, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { setAuthToken } from "../services/api";
import { authService } from "../services/auth.service";
import api from "../services/api";

// Lo exportamos para que el hook pueda consumirlo
export const authContext = createContext();

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

  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");
    const rolGuardado = localStorage.getItem("role");
    const usuarioGuardado = leerUsuarioDesdeStorage();
    const idGuardado = localStorage.getItem("id_usuario");

    if (tokenGuardado) {
      setToken(tokenGuardado);
      setAuthToken(tokenGuardado);
    }

    if (rolGuardado) {
      setRol(rolGuardado);
    }

    if (usuarioGuardado) {
      setUsuario({ ...usuarioGuardado, id_usuario: usuarioGuardado.id_usuario || usuarioGuardado.id || idGuardado });
    }

    setCargando(false);
  }, []);

  // Usamos useCallback para que estas funciones no se recreen en cada render
  const login = useCallback((tokenJWT, rolUsuario, datosUsuario = null) => {
    setToken(tokenJWT);
    setRol(rolUsuario);
    setUsuario(datosUsuario);
    setAuthToken(tokenJWT);

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
  }, []);

  const loginWithCredentials = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    const usuario = data.usuario
      ? {
          ...data.usuario,
          nombre: data.nombre || data.usuario?.primer_nombre || "",
          email: data.email || credentials.email,
        }
      : {
          nombre: data.nombre || "",
          email: data.email || credentials.email,
        };

    login(data.token, data.role, usuario);
    return data;
  }, [login]);

  const logout = useCallback(() => {
    // notify backend to revoke refresh token cookie
    try {
      api.post('/auth/logout');
    } catch (e) {
      // ignore
    }

    setToken(null);
    setRol(null);
    setUsuario(null);
    setAuthToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("usuario");
    localStorage.removeItem("id_usuario");
  }, []);

  const estaAutenticado = useCallback(() => {
    return !!token;
  }, [token]);

  const tieneRol = useCallback((...roles) => {
    return roles.includes(rol);
  }, [rol]);

  const obtenerHeaders = useCallback(() => {
    if (!token) {
      return {
        "Content-Type": "application/json",
      };
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  // SOLUCIÓN SONARQUBE S6481: Memorizamos el objeto 'value'
  const contextValue = useMemo(() => ({
    token,
    rol,
    usuario,
    cargando,
    login,
    loginWithCredentials,
    logout,
    estaAutenticado,
    tieneRol,
    obtenerHeaders,
  }), [token, rol, usuario, cargando, login, logout, estaAutenticado, tieneRol, obtenerHeaders]);

  return (
    <authContext.Provider value={contextValue}>
      {children}
    </authContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
