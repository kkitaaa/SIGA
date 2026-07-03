import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ProfileMenu from "../../components/dashboard/ProfileMenu";
import LogoSIGA from "../../assets/Logo SIGA.svg";
import { dashboardService } from "../../services/dashboardService";
import api from "../../services/api";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard({ user }) {
  const navigate = useNavigate();
  
  const [metrics, setMetrics] = useState({
    estudiantes: 0,
    funcionarios: 0,
    documentos: 0,
    pie: 0,
  });

  const [recentDocuments, setRecentDocuments] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await dashboardService.getMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("No se pudieron cargar las métricas del dashboard", error);
      }

      try {
        const docsRes = await api.get('/documentos?page=1&limit=5');
        setRecentDocuments(docsRes.data.documentos || []);
      } catch (error) {
        console.error("No se pudieron cargar los documentos recientes", error);
      }
    };

    loadDashboardData();
  }, []);

  const tareas = [
    "Revisión de expedientes",
    "Asignación de roles pendientes",
    "Seguimiento de documentos",
  ];

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
            <button type="button" className="home-nav-button" onClick={() => navigate("/home")}>Cursos</button>
            <button type="button" className="home-nav-button home-nav-button-home" onClick={() => navigate("/home")} aria-label="Ir al inicio">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 10.2 12 4l8 6.2V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
              </svg>
            </button>
            <button type="button" className="home-nav-button" onClick={() => navigate("/asignacion-roles")}>Asignar roles</button>
          </div>
        </div>

        <div className="home-topbar-actions">
          <span className="home-role-badge">{user?.rol || "Administrativo"}</span>
          <ProfileMenu user={user} />
        </div>
      </header>

      <main className="home-main">
        <section className="home-panel home-welcome-panel">
          <div className="home-welcome-title">Bienvenido/a, {user?.nombre || "administrador"}</div>
          <p className="home-welcome-subtitle">
            Vista administrativa con información clave para el seguimiento institucional.
          </p>

          <div className="home-card home-feed-card">
            <h2>Resumen general</h2>
            <div className="home-stat-row">
              <div className="home-stat-card">
                <strong>{metrics.estudiantes}</strong>
                <span>Estudiantes</span>
              </div>
              <div className="home-stat-card">
                <strong>{metrics.funcionarios}</strong>
                <span>Funcionarios</span>
              </div>
              <div className="home-stat-card">
                <strong>{metrics.documentos}</strong>
                <span>Documentos</span>
              </div>
            </div>
          </div>

          <div className="home-card">
            <h2>Tareas pendientes</h2>
            <ul className="home-list">
              {tareas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
              <button
                type="button"
                className="usuarios-action"
                onClick={() => navigate("/admin/usuarios")}
              >
                Ver usuarios
              </button>
              <button
                type="button"
                className="usuarios-action is-active"
                onClick={() => navigate("/admin/estudiantes")}
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
                <li style={{ color: "#718096" }}>No hay documentos recientes</li>
              )}
            </ul>
            <button
              type="button"
              className="usuarios-action"
              style={{ marginTop: "1rem", width: "100%" }}
              onClick={() => navigate("/documentos")}
            >
              Ver todo
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

AdminDashboard.propTypes = {
  user: PropTypes.shape({
    nombre: PropTypes.string,
    rol: PropTypes.string,
  }),
};

export default AdminDashboard;