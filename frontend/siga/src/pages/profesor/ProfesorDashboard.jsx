import React from "react";
import ProfileMenu from "../../components/dashboard/ProfileMenu";
import LogoSIGA from "../../assets/Logo SIGA.svg";
import "../../styles/home.css";

function ProfesorDashboard({ user }) {
  const documentos = [
    "Guía de evaluación 2026",
    "Planificación de curso",
    "Formato de seguimiento",
  ];

  const cursos = ["Lenguaje y Comunicación", "Matemática", "Historia"];

  return (
    <div className="home-page">
      <header className="home-topbar">
        <div className="home-brand">
          <img src={LogoSIGA} alt="SIGA" className="site-logo" />
        </div>
        <div className="home-topbar-actions">
          <span className="home-role-badge">{user?.rol || "Profesor"}</span>
          <ProfileMenu user={user} />
        </div>
      </header>

      <main className="home-main">
        <section className="home-panel home-welcome-panel">
          <div className="home-welcome-title">Bienvenido/a, {user?.nombre || "profesor"}</div>
          <p className="home-welcome-subtitle">
            Tu espacio docente con cursos, documentos y seguimiento académico.
          </p>

          <div className="home-card">
            <h2>Mis cursos</h2>
            <ul className="home-list">
              {cursos.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="home-panel home-news-panel">
          <div className="home-aside-card">
            <h2>Documentos disponibles</h2>
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

export default ProfesorDashboard;
