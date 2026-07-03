import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function ProfileMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { usuario, rol, logout } = useAuth();

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
    navigate("/");
  };

  return (
    <div className="home-profile-wrapper" ref={profileRef}>
      <button
        type="button"
        className={`home-profile-btn ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen((open) => !open)}
      >
        Ver perfil{" "}
        <span className="home-profile-arrow" aria-hidden="true">
          ▼
        </span>
      </button>

      {menuOpen && (
        <div className="home-profile-menu" role="menu">
          <div className="home-profile-card-head">
            <h3>{usuario?.nombre || "Usuario"}</h3>
            <p className="home-profile-role">{rol || "Sin rol"}</p>
            <div className="home-profile-role-line" />
            <p className="home-profile-email">{usuario?.email || "usuario@ejemplo.com"}</p>
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
  );
}

export default ProfileMenu;
