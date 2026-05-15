import React, { useState } from 'react';
import '../styles/login.css';

function InicioDeSesion() {
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
          // navigate('/dashboard');
        } else {
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        alert('Error al conectar con el servidor.');
      }
    } else {
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
          setIsLogin(true);
        } else {
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        alert('Error al conectar con el servidor.');
      }
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-page-brand">
        <div className="login-logo">SIGA</div>
        <div className="login-tagline">Sistema de gestion academica</div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <h1>{isLogin ? 'Bienvenido/a' : 'Crea tu cuenta'}</h1>
        </div>

        <div className="toggle-buttons">
          <button
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Iniciar Sesion
          </button>
          <button
            className={!isLogin ? 'active' : ''}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Registrarse
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Nombre completo</label>
              <input
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
            <label>RUT</label>
            <input
              type="text"
              name="rut"
              value={formData.rut}
              onChange={handleChange}
              required
              placeholder="Ej: 12345678-9"
            />
          </div>
          )}

          {!isLogin && (
            <div className="input-group">
              <label>Seleccione su rol</label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
              >
                <option value="Directiva">Directiva</option>
                <option value="Coordinador administrativo">Coordinador administrativo</option>
                <option value="Coordinador PIE">Coordinador PIE</option>
                <option value="Profesor">Profesor</option>
                <option value="Equipo PIE">Equipo PIE</option>
              </select>
            </div>
          )}

          <div className="input-group">
            <label>Correo electronico</label>
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
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="????????"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span
                  className="iconify"
                  data-icon={showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'}
                  data-width="20"
                  data-height="20"
                ></span>
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            {isLogin ? 'Ingresar' : 'Crear cuenta'}
          </button>

          <p className="register-text">
            {isLogin ? 'No tienes cuenta?' : 'Ya tienes cuenta?'}{' '}
            <button
              type="button"
              className="toggle-link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Crea una aqui' : 'Ingresa aqui'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default InicioDeSesion;
