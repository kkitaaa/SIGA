import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ProfileMenu from "../../components/dashboard/ProfileMenu";
import LogoSIGA from "../../assets/Logo SIGA.svg";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

function ProfesorDashboard() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [recentDocuments, setRecentDocuments] = useState([]);
  
  const [metricas, setMetricas] = useState({
    estudiantesTotales: 0,
    estudiantesPie: 0,
    cursosTotales: 0,
  });

  const [misCursos, setMisCursos] = useState([]);

  const normalizedRole = String(usuario?.rol || "").trim().toLowerCase();
  const isFuncionario = normalizedRole === "funcionario";
  const primaryRoute = isFuncionario ? "/cursos" : "/mis-cursos";
  const primaryLabel = isFuncionario ? "Cursos" : "Mis Cursos";
  const actionLabel = isFuncionario ? "Ver cursos" : "Ver mis cursos";
  const coursesPanelTitle = isFuncionario ? "Cursos disponibles" : "Mis Cursos";
  const coursesPanelRoute = isFuncionario ? "/cursos" : "/mis-cursos";

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const docsRes = await api.get('/documentos?page=1&limit=5');
        setRecentDocuments(docsRes.data.documentos || []);

        if (isFuncionario) {
          const cursosRes = await api.get('/cursos');
          setMetricas({
            estudiantesTotales: 0,
            estudiantesPie: 0,
            cursosTotales: cursosRes.data?.length || 0,
          });
          setMisCursos(cursosRes.data?.cursos || cursosRes.data || []);
          return;
        }

        const [metricasRes, cursosRes] = await Promise.all([
          api.get('/dashboard/profesor'),
          api.get('/cursos/mis-cursos'),
        ]);

        setMetricas(metricasRes.data);
        setMisCursos(cursosRes.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadDashboardData();
  }, [isFuncionario]);

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
            <button type="button" className="home-nav-button" onClick={() => navigate(primaryRoute)}>{primaryLabel}</button>
            <button type="button" className="home-nav-button home-nav-button-home" onClick={() => navigate("/home")} aria-label="Ir al inicio">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 10.2 12 4l8 6.2V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
              </svg>
            </button>
            <button type="button" className="home-nav-button" onClick={() => navigate("/documentos")}>Documentos</button>
          </div>
        </div>

        <div className="home-topbar-actions">
          <span className="home-role-badge">{usuario?.rol || (isFuncionario ? "Funcionario" : "Profesor")}</span>
          <ProfileMenu />
        </div>
      </header>

      <main className="home-main">
        <section className="home-panel home-welcome-panel">
          <div className="home-welcome-title">Bienvenido/a, {usuario?.nombre || "profesor"}</div>
          <p className="home-welcome-subtitle">
            Tu espacio docente con cursos, documentos y seguimiento académico.
          </p>

          <div className="home-card home-feed-card">
            <h2>Resumen Académico</h2>
            
            <div className="home-stat-row">
              <div className="home-stat-card">
                <strong>{metricas.estudiantesTotales}</strong>
                <span>Estudiantes</span>
              </div>
              <div className="home-stat-card">
                <strong>{metricas.estudiantesPie}</strong>
                <span>Alumnos PIE</span>
              </div>
              <div className="home-stat-card">
                <strong>{metricas.cursosTotales}</strong>
                <span>Cursos Asignados</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
              <button
                type="button"
                className="usuarios-action"
                onClick={() => navigate(primaryRoute)}
              >
                {actionLabel}
              </button>
              {isFuncionario && (
                <button
                  type="button"
                  className="usuarios-action is-active"
                  onClick={() => navigate("/admin/estudiantes")}
                >
                  Gestionar estudiantes
                </button>
              )}
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

      {misCursos.length > 0 && (
        <div className="home-main" style={{ marginTop: "2rem" }}>
          <section className="home-panel home-welcome-panel">
            <div className="home-card home-feed-card">
              <h2>{coursesPanelTitle}</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                      <th style={{ textAlign: "left", padding: "0.5rem", color: "#718096", fontSize: "0.875rem", fontWeight: 600 }}>Nivel</th>
                      <th style={{ textAlign: "left", padding: "0.5rem", color: "#718096", fontSize: "0.875rem", fontWeight: 600 }}>Curso</th>
                      <th style={{ textAlign: "left", padding: "0.5rem", color: "#718096", fontSize: "0.875rem", fontWeight: 600 }}>Letra</th>
                      <th style={{ textAlign: "center", padding: "0.5rem", color: "#718096", fontSize: "0.875rem", fontWeight: 600 }}>Estudiantes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misCursos.map((curso) => (
                      <tr key={curso.id_curso} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "0.75rem 0.5rem" }}>{curso.nivel_educativo}</td>
                        <td style={{ padding: "0.75rem 0.5rem" }}>{curso.nivel_curso}</td>
                        <td style={{ padding: "0.75rem 0.5rem", fontWeight: "bold" }}>{curso.letra}</td>
                        <td style={{ padding: "0.75rem 0.5rem", textAlign: "center" }}>
                          {curso._count?.estudiantes ?? curso.estudiantes?.length ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                className="usuarios-action"
                style={{ marginTop: "1rem" }}
                onClick={() => navigate(coursesPanelRoute)}
              >
                Ver todo
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default ProfesorDashboard;
