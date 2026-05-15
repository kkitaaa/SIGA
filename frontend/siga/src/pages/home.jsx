import React from 'react';
import '../styles/home.css';

function Home() {
  return (
    <div className="home-page">
      <header className="home-topbar">
        <div className="home-brand">SIGA</div>
        <button className="home-profile-btn">Ver perfil</button>
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
