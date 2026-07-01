import React from "react";
import ProfileMenu from "../../components/dashboard/ProfileMenu";
import "../../styles/home.css";

function PieDashboard({ user }) {
  const documentos = [
    "Informe PIE 2026",
    "Seguimiento de estudiantes NEE",
    "Plan de apoyo individual",
  ];

  const areas = ["Estudiantes NEE", "Funcionarios", "Cursos especializados"];

  return (
    <div className="home-page">
      <header className="home-topbar">
        <div className="home-brand">SIGA</div>
        <div className="home-topbar-actions">
          <span className="home-role-badge">{user?.rol || "Equipo PIE"}</span>
          <ProfileMenu user={user} />
        </div>
      </header>

      <main className="home-main">
        <section className="home-panel home-welcome-panel">
          <div className="home-welcome-title">Bienvenido/a, {user?.nombre || "equipo PIE"}</div>
          <p className="home-welcome-subtitle">
            Panel de seguimiento y gestión para el equipo PIE.
          </p>

          <div className="home-card">
            <h2>Áreas prioritarias</h2>
            <ul className="home-list">
              {areas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="home-panel home-news-panel">
          <div className="home-aside-card">
            <h2>Documentos del PIE</h2>
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

export default PieDashboard;
