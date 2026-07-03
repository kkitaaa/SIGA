import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ProfileMenu from "../../components/dashboard/ProfileMenu";
import LogoSIGA from "../../assets/Logo SIGA.svg";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

function FuncionarioDashboard() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [recentDocuments, setRecentDocuments] = useState([]);
  const [metricas, setMetricas] = useState({
    estudiantes: 0,
    cursos: 0,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [docsRes, cursosRes] = await Promise.all([
          api.get('/documentos?page=1&limit=5'),
          api.get('/cursos'),
        ]);

        setRecentDocuments(docsRes.data.documentos || []);
        const cursos = cursosRes.data?.cursos || cursosRes.data || [];
        setMetricas({
          estudiantes: cursos.reduce((sum, curso) => sum + (curso._count?.estudiantes ?? curso.estudiantes?.length ?? 0), 0),
          cursos: cursos.length,
        });
      } catch (error) {
        console.error("Error cargando datos de funcionario:", error);
      }
    };

    loadDashboardData();
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
          <span className="home-role-badge">{usuario?.rol || 'Funcionario'}</span>
          <ProfileMenu />
        </div>
      </header>

      <main className="home-main">
        <section className="home-panel home-welcome-panel">
          <div className="home-welcome-title">Bienvenido/a, {usuario?.nombre || 'funcionario'}</div>
          <p className="home-welcome-subtitle">
            Vista del funcionario para gestionar cursos y estudiantes.
          </p>

          <div className="home-card home-feed-card">
            <h2>Resumen rápido</h2>
            <div className="home-stat-row">
              <div className="home-stat-card">
                <strong>{metricas.estudiantes}</strong>
                <span>Estudiantes</span>
              </div>
              <div className="home-stat-card">
                <strong>{metricas.cursos}</strong>
                <span>Cursos</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="usuarios-action"
                onClick={() => navigate('/cursos')}
              >
                Ver cursos
              </button>
              <button
                type="button"
                className="usuarios-action is-active"
                onClick={() => navigate('/admin/estudiantes')}
              >
                Gestionar estudiantes
              </button>
            </div>
          </div>
        </section>

        <aside className="home-panel home-news-panel">
          <div className="home-aside-card">
            <h2>Documentos recientes</h2>
            <ul className="home-list">
              {recentDocuments.length > 0 ? (
                recentDocuments.map((doc) => (
                  <li key={doc.id_documento}>{doc.nombre || `Documento #${doc.id_documento}`}</li>
                ))
              ) : (
                <li style={{ color: '#718096' }}>No hay documentos recientes</li>
              )}
            </ul>
            <button
              type="button"
              className="usuarios-action"
              style={{ marginTop: '1rem', width: '100%' }}
              onClick={() => navigate('/documentos')}
            >
              Ver todo
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default FuncionarioDashboard;
