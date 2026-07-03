import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ProfileMenu from '../../components/dashboard/ProfileMenu';
import LogoSIGA from '../../assets/Logo SIGA.svg';
import '../../styles/home.css';
import '../../styles/usuarios.css';

export default function FuncionariosPage({ user }) {
  const navigate = useNavigate();
  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);

  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [especialidadFilter, setEspecialidadFilter] = useState('');

  const especialidades = useMemo(
    () => Array.from(new Set(funcionarios.map((f) => f.tipo_profesional).filter(Boolean))),
    [funcionarios],
  );

  const filteredFuncionarios = useMemo(
    () =>
      funcionarios.filter((f) => {
        const nombre = (f.nombre || '').toLowerCase();
        const matchesSearch = !search || nombre.includes(search.toLowerCase());
        const matchesEspecialidad = !especialidadFilter || f.tipo_profesional === especialidadFilter;
        return matchesSearch && matchesEspecialidad;
      }),
    [funcionarios, search, especialidadFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filteredFuncionarios.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [search, especialidadFilter]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/funcionarios');
        setFuncionarios(res.data || []);
      } catch (error) {
        console.error('Error cargando funcionarios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return (
    <div className="usuarios-page">
      <header className="home-topbar usuarios-topbar">
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
          <span className="home-role-badge">{user?.rol || 'PIE'}</span>
          <ProfileMenu user={user} />
        </div>
      </header>

      <button type="button" className="usuarios-back-link" onClick={() => navigate('/pie')}>← Volver</button>

      <div className="usuarios-header">
        <div>
          <p className="usuarios-eyebrow">PIE</p>
          <h1>Funcionarios PIE</h1>
          <p className="usuarios-subtitle">Lista de profesionales asignados al programa PIE.</p>
        </div>
        <div className="usuarios-header-actions" />
      </div>

      <div className="usuarios-filters">
        <input
          type="text"
          className="usuarios-input"
          placeholder="Buscar por nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="usuarios-select"
          value={especialidadFilter}
          onChange={(e) => setEspecialidadFilter(e.target.value)}
        >
          <option value="">Todas las especialidades</option>
          {especialidades.map((esp) => (
            <option key={esp} value={esp}>
              {esp}
            </option>
          ))}
        </select>
      </div>

      <div className="usuarios-content">
        <div className="usuarios-card">
          {loading ? (
            <div className="usuarios-loading" role="status" aria-live="polite">
              <div className="usuarios-spinner" />
              <span>Cargando funcionarios...</span>
            </div>
          ) : funcionarios.length === 0 ? (
            <div className="usuarios-empty">No hay funcionarios registrados.</div>
          ) : filteredFuncionarios.length === 0 ? (
            <div className="usuarios-empty">No se encontraron funcionarios con esos filtros.</div>
          ) : (
            <>
              <table className="usuarios-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Especialidad</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFuncionarios
                    .slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE)
                    .map((f) => (
                      <tr key={f.id_funcionario}>
                        <td>{f.id_funcionario}</td>
                        <td>{f.nombre}</td>
                        <td>{f.tipo_profesional}</td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div className="usuarios-pagination">
                <button type="button" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Anterior
                </button>
                <span>Página {page} de {totalPages}</span>
                <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                  Siguiente
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
