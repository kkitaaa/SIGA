import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioFilters from "../../components/usuarios/UsuarioFilters";
import UsuariosTable from "../../components/usuarios/UsuariosTable";
import { useAuth } from "../../hooks/useAuth";
import ProfileMenu from "../../components/dashboard/ProfileMenu";
import { usuarioService } from "../../services/usuario.service";
import "../../styles/usuarios.css";

const PAGE_SIZE = 8;

function UsuariosPage() {
  const navigate = useNavigate();
  const { rol } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const data = await usuarioService.listarUsuarios();
        setUsuarios(data);
      } catch (error) {
        console.error("No se pudieron cargar usuarios", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const roles = useMemo(() => {
    const uniqueRoles = [...new Set(usuarios.map((usuario) => usuario.rol || "SinRol"))];
    return uniqueRoles.filter(Boolean).sort();
  }, [usuarios]);

  const filteredUsuarios = useMemo(() => {
    const query = search.toLowerCase();
    return usuarios.filter((usuario) => {
      const fullName = `${usuario.nombre || ""} ${usuario.correo || ""}`.toLowerCase();
      const matchesSearch = !query || fullName.includes(query);
      const matchesRole = !roleFilter || (usuario.rol || "SinRol") === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [usuarios, search, roleFilter]);

  const paginatedUsuarios = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsuarios.slice(start, start + PAGE_SIZE);
  }, [filteredUsuarios, page]);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsuarios.length / PAGE_SIZE));

  return (
    <div className="usuarios-page">
      <header className="home-topbar usuarios-topbar">
        <div className="home-brand">SIGA</div>
        <div className="home-topbar-actions">
          <span className="home-role-badge">{rol || "Administrativo"}</span>
          <ProfileMenu user={{ nombre: "Usuario", rol: rol || "Administrativo", email: "usuario@ejemplo.com" }} />
        </div>
      </header>

      <button
        type="button"
        className="usuarios-back-link"
        onClick={() => navigate("/home")}
        aria-label="Volver al dashboard"
      >
        <span aria-hidden="true">&lt;</span> Volver
      </button>

      <div className="usuarios-header">
        <div>
          <p className="usuarios-eyebrow">Administración</p>
          <h1>Usuarios</h1>
          <p className="usuarios-subtitle">Busca, filtra y revisa el estado de los usuarios registrados.</p>
        </div>
      </div>

      <UsuarioFilters
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        roles={roles}
      />

      {loading ? (
        <div className="usuarios-loading" role="status" aria-live="polite">
          <div className="usuarios-spinner" />
          <span>Cargando usuarios...</span>
        </div>
      ) : (
        <>
          <UsuariosTable
            usuarios={paginatedUsuarios}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />

          {selectedUser && (
            <div className="usuarios-detail-card">
              <h2>Detalle de usuario</h2>
              <p>
                <strong>Nombre:</strong> {selectedUser.nombre || `${selectedUser.primer_nombre || ""} ${selectedUser.primer_apellido || ""}`.trim()}
              </p>
              <p>
                <strong>Correo:</strong> {selectedUser.correo || selectedUser.email || "—"}
              </p>
              <p>
                <strong>Rol:</strong> {selectedUser.rol || "SinRol"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UsuariosPage;
