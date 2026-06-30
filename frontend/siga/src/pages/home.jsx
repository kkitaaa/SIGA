import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { usuario, rol, logout } = useAuth();

  const nombreUsuario = usuario?.nombre || "Usuario";
  const emailUsuario = usuario?.email || "usuario@ejemplo.com";
  const rolUsuario = rol || "Sin rol";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && profileRef.current && !profileRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="home-page">
      <header className="home-topbar">
        <div className="home-brand">SIGA</div>
        <div className="home-profile-wrapper" ref={profileRef}>
          <button
            type="button"
            className={`home-profile-btn ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((open) => !open)}
          >
            Ver perfil
            <span className="home-profile-arrow" aria-hidden="true">
              ▼
            </span>
          </button>

          {menuOpen && (
            <div className="home-profile-menu" role="menu">
              <div className="home-profile-card-head">
                <h3>{nombreUsuario}</h3>
                <p className="home-profile-role">{rolUsuario}</p>
                <div className="home-profile-role-line" />
                <p className="home-profile-email">{emailUsuario}</p>
                <p className="home-profile-description">
                  Aquí irá una futura descripción breve del perfil, mostrando el estado actual o información adicional.
                </p>
              </div>

              <div className="home-profile-menu-divider" />

              <div className="home-profile-actions">
                <button type="button" className="home-profile-action home-profile-action-config">
                  Configurar perfil
                </button>
                <button
                  type="button"
                  className="home-profile-action home-profile-action-logout"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="home-main">
        <section className="home-panel home-welcome-panel">
          <div className="home-welcome-title">Bienvenido/a a SIGA</div>
          <p className="home-welcome-subtitle">
            Tu portal de información y gestión eficiente escolar
          </p>
          <div className="home-card home-feed-card">
            <h2>Feed</h2>
            <div className="home-placeholder-line" />
            <div className="home-placeholder-line short" />
            <div className="home-placeholder-line" />
            <div className="home-placeholder-line" />
            <div className="home-placeholder-line long" />
            <div className="home-placeholder-line" />
            <div className="home-placeholder-line short" />
          </div>
        </section>

        <aside className="home-panel home-news-panel">
          <div className="home-aside-card">
            <h2>Novedades</h2>
            <div className="home-placeholder-line" />
            <div className="home-placeholder-line" />
            <div className="home-placeholder-line short" />
            <div className="home-placeholder-line" />
            <div className="home-placeholder-line long" />
            <div className="home-placeholder-line" />
            <div className="home-placeholder-line short" />
            <div className="home-placeholder-line" />
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Home;
