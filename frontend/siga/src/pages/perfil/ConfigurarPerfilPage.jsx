import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ProfileMenu from '../../components/dashboard/ProfileMenu';
import LogoSIGA from '../../assets/Logo SIGA.svg';
import api from '../../services/api';
import '../../styles/usuarios.css';

export default function ConfigurarPerfilPage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [form, setForm] = useState({
    nombre: usuario?.nombre || '',
    email: usuario?.email || '',
  });
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(usuario || {});

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Intentamos actualizar vía API; si no existe, al menos no rompe.
      await api.put('/usuarios/me', form);
      // Si la actualización en servidor fue ok, sincronizamos el usuario local
      try {
        const stored = JSON.parse(localStorage.getItem('usuario') || '{}');
        const updated = { ...stored, nombre: form.nombre, email: form.email };
        localStorage.setItem('usuario', JSON.stringify(updated));
      } catch (e) {
        // ignore localStorage errors
      }
      alert('Perfil actualizado');
      navigate(-1);
    } catch (err) {
      console.error('Error actualizando perfil en servidor:', err?.response || err);
      // Fallback: guardamos en localStorage para permitir que el usuario vea sus cambios
      try {
        const stored = JSON.parse(localStorage.getItem('usuario') || '{}');
        const updated = { ...stored, nombre: form.nombre, email: form.email };
        localStorage.setItem('usuario', JSON.stringify(updated));
        alert('No se pudo actualizar en el servidor; los cambios se guardaron localmente.');
        // Recargar para que el AuthProvider vuelva a leer localStorage (opcional)
        window.location.reload();
      } catch (e) {
        alert('No se pudo actualizar el perfil.');
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/usuarios/me');
        const data = res.data.usuario || res.data || res.data.user || res.data;
        setUserData(data || usuario || {});
        setForm((s) => ({ ...s, nombre: data?.nombre || s.nombre, email: data?.email || s.email }));
      } catch (err) {
        // si falla la petición, usamos el usuario del contexto
        setUserData(usuario || {});
      }
    };

    load();
  }, [usuario]);

  return (
    <div className="usuarios-page">
      <header className="home-topbar usuarios-topbar">
        <div className="home-topbar-left">
          <div className="home-brand">
            <img src={LogoSIGA} alt="SIGA" className="site-logo" />
          </div>
        </div>

        <div className="home-topbar-center">
          <div className="home-topbar-nav" aria-label="Navegación principal">
            <button type="button" className="home-nav-button" onClick={() => navigate('/home')}>Inicio</button>
            <button type="button" className="home-nav-button" onClick={() => navigate('/documentos')}>Documentos</button>
          </div>
        </div>

        <div className="home-topbar-actions">
          <span className="home-role-badge">{usuario?.rol || 'Usuario'}</span>
          <ProfileMenu />
        </div>
      </header>

      <main className="home-main">
        <button
          type="button"
          className="usuarios-back-link"
          onClick={() => navigate('/home')}
          aria-label="Volver al dashboard"
        >
          ← Volver
        </button>

        <div className="usuarios-header">
          <div>
            <p className="usuarios-eyebrow">Perfil</p>
            <h1>Configurar Perfil</h1>
            <p className="usuarios-subtitle">Actualiza tu información personal.</p>
          </div>
        </div>

        <div className="usuarios-card usuarios-card--centered">
          <form onSubmit={handleSubmit}>
            <div className="usuarios-form-grid">
              <label>
                <span className="usuarios-label">Nombre</span>
                <input name="nombre" value={form.nombre} onChange={handleChange} className="usuarios-input" />
              </label>

              <label>
                <span className="usuarios-label">Email</span>
                <input name="email" value={form.email} onChange={handleChange} className="usuarios-input" />
              </label>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="usuarios-action is-active" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button type="button" className="usuarios-action" onClick={() => navigate(-1)} disabled={saving}>
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
