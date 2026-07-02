import React from "react";
import ProfileMenu from "../../components/dashboard/ProfileMenu";
import LogoSIGA from "../../assets/Logo SIGA.svg";
import "../../styles/home.css";

function PendingRoleDashboard({ user }) {
  return (
    <div className="home-page">
      <header className="home-topbar">
        <div className="home-brand">
          <img src={LogoSIGA} alt="SIGA" className="site-logo" />
        </div>
        <div className="home-topbar-actions">
          <span className="home-role-badge">Sin rol</span>
          <ProfileMenu user={user} />
        </div>
      </header>

      <main className="home-main single-column">
        <section className="home-panel home-welcome-panel">
          <div className="home-welcome-title">Tu acceso está pendiente</div>
          <p className="home-welcome-subtitle">
            Tu cuenta aún no tiene un rol asignado. Directiva te asignará un rol pronto y entonces podrás ver el contenido correspondiente.
          </p>

          <div className="home-card">
            <h2>Estado de tu cuenta</h2>
            <p className="home-welcome-subtitle" style={{ margin: 0 }}>
              Mientras tanto, puedes seguir revisando tu perfil y esperar la asignación del rol correspondiente.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PendingRoleDashboard;
