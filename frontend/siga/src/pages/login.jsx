import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { useAuth } from "../context/AuthContext";

import api from "../services/api";

function InicioDeSesion() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    rut: "",
    rol: "Profesor",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      try {
        const res = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        const data = res.data;

        login(data.token, data.role, {
          nombre: data.nombre || data.usuario?.primer_nombre || "",
          email: data.email || formData.email,
          id_usuario: data.usuario?.id_usuario || data.id_usuario || null,
          id: data.usuario?.id_usuario || data.id_usuario || null,
        });

        alert(data.mensaje);

        if (data.role === "Administrativo") {
          navigate("/asignacion-roles");
        } else {
          navigate("/home");
        }
      } catch (error) {
        alert(error.response?.data?.error || "Error al conectar con el servidor.");
      }
    } else {
      try {
        const res = await api.post("/auth/register", {
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password,
          rut: formData.rut,
          rol: formData.rol,
        });

        const data = res.data;

        alert(data.mensaje);
        setIsLogin(true);
      } catch (error) {
        alert(error.response?.data?.error || "Error al conectar con el servidor.");
      }
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-page-brand">
        <div className="login-logo">SIGA</div>
        <div className="login-tagline">Sistema de gestión académica</div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <h1>{isLogin ? "Bienvenido/a" : "Crea tu cuenta"}</h1>
        </div>

        <div className="toggle-buttons">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Iniciar Sesión
          </button>

          <button
            className={isLogin ? "" : "active"}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Registrarse
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Ej: Ana Perez"
              />
            </div>
          )}

          {!isLogin && (
            <div className="input-group">
              <label htmlFor="rut">RUT</label>
              <input
                id="rut" 
                type="text"
                name="rut"
                value={formData.rut}
                onChange={handleChange}
                required
                placeholder="Ej: 12345678-9"
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="usuario@colegio.cl"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-wrapper">
              <input
                id="password" 
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span
                  className="iconify"
                  data-icon={
                    showPassword ? "heroicons:eye-slash" : "heroicons:eye"
                  }
                  data-width="20"
                  data-height="20"
                ></span>
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            {isLogin ? "Ingresar" : "Crear cuenta"}
          </button>

          <p className="register-text">
            {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              type="button"
              className="toggle-link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Crea una aquí" : "Ingresa aquí"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default InicioDeSesion;