import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../../components/dashboard/ProfileMenu";
import LogoSIGA from "../../assets/Logo SIGA.svg";
import api from "../../services/api";
import "../../styles/home.css";

function PieDashboard({ user }) {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({ estudiantesNee: 0, funcionarios: 0, asignaciones: 0 });
  const [recentDocuments, setRecentDocuments] = useState([]);


  const areas = ["Estudiantes PIE", "Funcionarios", "Cursos especializados"];

  useEffect(() => {
    const load = async () => {
      try {
        const [estsRes, funcsRes, asigsRes] = await Promise.all([
          api.get('/estudiantes/nee'),
          api.get('/funcionarios'),
          api.get('/asignacion-pie'),
        ]);

        const estudiantesNee = (estsRes.data?.estudiantes || []).length;
        const funcionarios = (funcsRes.data || []).length;
        const asignaciones = (asigsRes.data?.asignaciones || []).length;

        setMetrics({ estudiantesNee, funcionarios, asignaciones });
      } catch (error) {
        console.error('Error cargando métricas PIE:', error);
      }
    };

    const loadDocs = async () => {
      try {
        const docsRes = await api.get('/documentos?page=1&limit=5');
        setRecentDocuments(docsRes.data.documentos || []);
      } catch (err) {
        console.error('Error cargando documentos PIE:', err);
      }
    };

    load();
    loadDocs();
  }, []);

  return (
    <div className="home-page">
      <header className="home-topbar">
        <div className="home-topbar-left">
          <div className="home-brand">
            <img src={LogoSIGA} alt="SIGA" className="site-logo" />
          </div>
        </div>

        <div className="home-topbar-center">
          <div className="home-topbar-nav" aria-label="Navegación principal">
            <button type="button" className="home-nav-button" onClick={() => navigate('/cursos')}>Cursos</button>
            <button type="button" className="home-nav-button home-nav-button-home" onClick={() => navigate('/home')} aria-label="Ir al inicio">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 10.2 12 4l8 6.2V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
              </svg>
            </button>
            <button type="button" className="home-nav-button" onClick={() => navigate('/documentos')}>Documentos</button>
          </div>
        </div>

        <div className="home-topbar-actions">
          <span className="home-role-badge">{user?.rol || 'PIE'}</span>
          <ProfileMenu user={user} />
        </div>
      </header>

      <main className="home-main">
        <section className="home-panel home-welcome-panel">
          <div className="home-welcome-title">Bienvenido/a, {user?.nombre || 'Usuario'}</div>
          <p className="home-welcome-subtitle">Panel de seguimiento y gestión para PIE.</p>

          <div className="home-card home-feed-card">
            <h2>Resumen general</h2>
            <div className="home-stat-row">
              <div className="home-stat-card">
                <strong>{metrics.estudiantesNee}</strong>
                <span>Estudiantes PIE</span>
              </div>
              <div className="home-stat-card">
                <strong>{metrics.funcionarios}</strong>
                <span>Funcionarios PIE</span>
              </div>
              <div className="home-stat-card">
                <strong>{metrics.asignaciones}</strong>
                <span>Asignaciones PIE</span>
              </div>
            </div>
          </div>

          <div className="home-card" style={{ marginTop: '1rem' }}>
            <h2>Áreas prioritarias</h2>
            <ul className="home-list">
              {areas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#374151' }}>Acciones</h3>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button type="button" className="usuarios-action" onClick={() => navigate('/pie/estudiantes')}>
                  Ver estudiantes PIE
                </button>
                {user?.rol === 'Coordinador PIE' && (
                  <button type="button" className="usuarios-action" onClick={() => navigate('/asignacion-pie')}>
                    Asignar Estudiantes (PIE)
                  </button>
                )}
                <button type="button" className="usuarios-action" onClick={() => navigate('/funcionarios')}>
                  Ver Funcionarios
                </button>
              </div>
            </div>
          </div>
        </section>

        <aside className="home-panel home-news-panel">
          <div className="home-aside-card">
            <h2>Documentos del PIE</h2>
            <ul className="home-list">
              {recentDocuments.length > 0 ? (
                recentDocuments.map((doc) => (
                  <li key={doc.id_documento}>{doc.nombre || `Documento #${doc.id_documento}`}</li>
                ))
              ) : (
                <li style={{ color: '#718096' }}>No hay documentos recientes</li>
              )}
            </ul>
            <button type="button" className="usuarios-action" style={{ marginTop: '1rem', width: '100%' }} onClick={() => navigate('/documentos')}>
              Ver todo
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default PieDashboard;
