import React, { useState } from 'react';
import '../styles/login.css';

function InicioDeSesión() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    rol: 'Profesor'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    const API_URL = 'http://localhost:3000/api/auth'; 

    if (isLogin) {
      // --- LÓGICA DE INICIAR SESIÓN ---
      try {
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          alert(data.mensaje); 
          navigate('/dashboard'); // **Ejemplo de redirección**: 
          // agregar lógica para redirigir al Dashboard
        } else {
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        alert("Error al conectar con el servidor.");
      }

    } else {
      // --- LÓGICA DE REGISTRO ---
      try {
        const response = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: formData.nombre,
            email: formData.email,
            password: formData.password,
            rol: formData.rol
          })
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.mensaje);
          setIsLogin(true); // Cambia automáticamente a la vista de Iniciar Sesión
        } else {
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        alert("Error al conectar con el servidor.");
      }
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <div className="header">
          <h1>SIGA</h1>
          <p>Sistema de Gestión Escolar</p>
        </div>
        <div className="toggle-buttons">
          <button 
            className={isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(true)}
          >
            Iniciar Sesión
          </button>
          <button 
            className={!isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(false)}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="input-group">
                <label>Nombre completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Ana Pérez"
                />
              </div>

              <div className="input-group">
                <label>Seleccione su rol</label>
                <select name="rol" value={formData.rol} onChange={handleChange}>
                  <option value="Directiva">Directiva</option>
                  <option value="Coordinador administrativo">Coordinador administrativo</option>
                  <option value="Coordinador PIE">Coordinador PIE</option>
                  <option value="Profesor">Profesor</option>
                  <option value="Equipo PIE">Equipo PIE</option>
                </select>
              </div>
            </>
          )}

          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="usuario@colegio.cl"
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                <span 
                  className="iconify" 
                  data-icon={showPassword ? "heroicons:eye-slash" : "heroicons:eye"} 
                  data-width="20" 
                  data-height="20"
                ></span>
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            {isLogin ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InicioDeSesión;