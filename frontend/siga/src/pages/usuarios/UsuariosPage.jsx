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
  const { rol, usuario: usuarioAutenticado } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingRoleChange, setPendingRoleChange] = useState(null);
  const [confirmCountdown, setConfirmCountdown] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [feedbackType, setFeedbackType] = useState("success");

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const [usuariosData, rolesData] = await Promise.all([
          usuarioService.listarUsuarios(),
          usuarioService.listarRoles(),
        ]);
        setUsuarios(usuariosData);
        setRoleOptions(rolesData);
      } catch (error) {
        console.error("No se pudieron cargar usuarios", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const roles = useMemo(() => {
    const backendRoles = roleOptions
      .map((role) => role?.nombre_rol)
      .filter(Boolean)
      .map((role) => String(role).trim());

    const existingRoles = usuarios
      .map((usuario) => usuario?.rol)
      .filter(Boolean)
      .map((role) => String(role).trim())
      .filter((role) => role !== "SinRol" && role !== "Sin rol" && role !== "Sin Rol");

    return [...new Set([...backendRoles, ...existingRoles])].sort();
  }, [usuarios, roleOptions]);

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

  const handleRoleChangeRequest = (targetUser, nextRoleName) => {
    if (targetUser.rol === nextRoleName || (!targetUser.rol && nextRoleName === "SinRol")) {
      return;
    }

    const selectedRole = roleOptions.find((role) => role.nombre_rol === nextRoleName);
    const currentUserId = usuarioAutenticado?.id_usuario ?? usuarioAutenticado?.id ?? null;
    const isSelfChange = Number(targetUser.id_usuario) === Number(currentUserId);
    const isDirectivaChange = nextRoleName === "Directiva";
    const needsDoubleConfirm = isSelfChange || isDirectivaChange;

    if (!selectedRole?.id_rol) {
      setFeedbackType("error");
      setFeedbackMessage(`El rol "${nextRoleName}" no tiene un identificador válido en el backend.`);
      return;
    }

    setPendingRoleChange({
      usuario: targetUser,
      nextRoleName,
      nextRoleId: selectedRole.id_rol,
      needsDoubleConfirm,
      isSelfChange,
      isDirectivaChange,
      confirmStep: "initial",
    });
    setConfirmCountdown(0);
  };

  useEffect(() => {
    if (!pendingRoleChange?.needsDoubleConfirm || confirmCountdown <= 0) return;

    const timer = window.setTimeout(() => {
      setConfirmCountdown((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [pendingRoleChange, confirmCountdown]);

  const handleConfirmRoleChange = async () => {
    if (!pendingRoleChange) return;

    if (pendingRoleChange.isSelfChange && confirmCountdown < 10) {
      setConfirmCountdown(10);
      return;
    }

    if (pendingRoleChange.isDirectivaChange && pendingRoleChange.confirmStep === "initial") {
      setPendingRoleChange({ ...pendingRoleChange, confirmStep: "final" });
      return;
    }

    try {
      const response = await usuarioService.cambiarRol(
        pendingRoleChange.usuario.id_usuario,
        pendingRoleChange.nextRoleId,
      );

      if (response?.ok) {
        setUsuarios((currentUsuarios) =>
          currentUsuarios.map((usuario) =>
            usuario.id_usuario === pendingRoleChange.usuario.id_usuario
              ? { ...usuario, rol: pendingRoleChange.nextRoleName }
              : usuario,
          ),
        );
        setSelectedUser((currentUser) =>
          currentUser?.id_usuario === pendingRoleChange.usuario.id_usuario
            ? { ...currentUser, rol: pendingRoleChange.nextRoleName }
            : currentUser,
        );
        setFeedbackType("success");
        setFeedbackMessage(`Rol actualizado correctamente para ${pendingRoleChange.usuario.nombre}.`);
      } else {
        const backendMessage = response?.mensaje || response?.error || "No se pudo actualizar el rol.";
        setFeedbackType("error");
        setFeedbackMessage(backendMessage);
      }
    } catch (error) {
      console.error("No se pudo actualizar el rol", error);
      const backendMessage =
        error?.response?.data?.mensaje ||
        error?.response?.data?.error ||
        error?.message ||
        "No se pudo actualizar el rol.";
      setFeedbackType("error");
      setFeedbackMessage(backendMessage);
    } finally {
      setPendingRoleChange(null);
      setConfirmCountdown(0);
    }
  };

  const handleToggleDetail = (usuario) => {
    setSelectedUser((currentUser) =>
      currentUser?.id_usuario === usuario.id_usuario ? null : usuario,
    );
  };

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

      {feedbackMessage && (
        <div className={`usuarios-feedback ${feedbackType === "error" ? "is-error" : "is-success"}`} role="status">
          {feedbackMessage}
        </div>
      )}

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
            onToggleDetail={handleToggleDetail}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            roleOptions={roleOptions}
            onRoleChangeRequest={handleRoleChangeRequest}
            currentUserId={usuarioAutenticado?.id_usuario ?? usuarioAutenticado?.id ?? null}
          />
        </>
      )}

      {pendingRoleChange && (
        <div className="usuarios-modal-backdrop" role="presentation">
          <div className="usuarios-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-role-title">
            <h2 id="confirm-role-title">Confirmar cambio de rol</h2>
            <p>
              ¿Está seguro que desea cambiar el rol de <strong>{pendingRoleChange.usuario.nombre}</strong> a <strong>{pendingRoleChange.nextRoleName}</strong>?
            </p>
            {pendingRoleChange.isSelfChange && (
              <p className="usuarios-modal-warning">
                Este cambio afectará su propio acceso. Debe confirmar de forma adicional y el botón se habilitará tras 10 segundos.
              </p>
            )}
            {pendingRoleChange.isDirectivaChange && !pendingRoleChange.isSelfChange && pendingRoleChange.confirmStep === "initial" && (
              <p className="usuarios-modal-warning">
                Este cambio otorga acceso de Directiva. Confirme esta acción antes de continuar.
              </p>
            )}
            {pendingRoleChange.isDirectivaChange && !pendingRoleChange.isSelfChange && pendingRoleChange.confirmStep === "final" && (
              <p className="usuarios-modal-warning">
                Está a punto de otorgar acceso de Directiva. Confirme esta acción una segunda vez.
              </p>
            )}
            <div className="usuarios-modal-actions">
              <button type="button" className="usuarios-modal-cancel" onClick={() => { setPendingRoleChange(null); setConfirmCountdown(0); }}>
                Cancelar
              </button>
              <button
                type="button"
                className="usuarios-modal-confirm"
                onClick={handleConfirmRoleChange}
                disabled={pendingRoleChange.isSelfChange && confirmCountdown > 0}
              >
                {pendingRoleChange.isSelfChange
                  ? `Confirmar (${confirmCountdown > 0 ? confirmCountdown : 10})`
                  : pendingRoleChange.isDirectivaChange && pendingRoleChange.confirmStep === "initial"
                    ? "Confirmar"
                    : "Sí, cambiar rol"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsuariosPage;
