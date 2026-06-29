import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileMenu from "../../components/dashboard/ProfileMenu";
import { dashboardService } from "../../services/dashboardService";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard({ user }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [metrics, setMetrics] = useState({
    estudiantes: 0,
    funcionarios: 0,
    documentos: 0,
    pie: 0,
  });

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await dashboardService.getMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("No se pudieron cargar las métricas del dashboard", error);
      }
    };

    loadMetrics();
  }, []);

  const documentos = [
    "Acta de reunión mensual",
    "Planificación anual 2026",
    "Informe de cumplimiento",
    "Normativa institucional",
  ];

  const tareas = [
    "Revisión de expedientes",
    "Asignación de roles pendientes",
    "Seguimiento de documentos",
  ];

  return (
    <div className="home-page">
      <header className="home-topbar">
        <div className="home-brand">SIGA</div>
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
            <button
              type="button"
              className="usuarios-action"
              style={{ marginTop: "1rem" }}
              onClick={() => navigate("/admin/usuarios")}
            >
              Ver usuarios y asignar roles
            </button>
          </div>
        </section>

        <aside className="home-panel home-news-panel">
          <div className="home-aside-card">
            <h2>Documentos recientes</h2>
            <ul className="home-list">
              {documentos.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default AdminDashboard;
