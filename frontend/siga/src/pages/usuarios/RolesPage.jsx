import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioFilters from "../../components/usuarios/UsuarioFilters";
import UsuariosTable from "../../components/usuarios/UsuariosTable";
import { useAuth } from "../../hooks/useAuth";
import ProfileMenu from "../../components/dashboard/ProfileMenu";
import LogoSIGA from "../../assets/Logo SIGA.svg";
import { usuarioService } from "../../services/usuario.service";
import "../../styles/usuarios.css";

const PAGE_SIZE = 8;

const normalizeRole = (role) => {
  const value = String(role ?? "").trim();
  if (!value || ["SinRol", "Sin rol", "Sin Rol"].includes(value)) {
    return "Sin rol";
  }
  return value;
};

const buildUserSummary = (usuario) => ({
  ...usuario,
  nombre: usuario?.nombre || `${usuario?.primer_nombre || ""} ${usuario?.primer_apellido || ""}`.trim(),
  correo: usuario?.correo || usuario?.email || "sin correo",
  rol: normalizeRole(usuario?.rol),
});

function RolesPage() {
  const navigate = useNavigate();
  const { rol, usuario: usuarioAutenticado } = useAuth();
  const isCoordinatorAdmin = String(rol || "").trim().toLowerCase() === "coordinador administrativo";

  const [usuarios, setUsuarios] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
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
        const [usuariosData, usuariosSinRolData, rolesData] = await Promise.all([
          usuarioService.listarUsuarios(),
          usuarioService.listarUsuariosSinRol(),
          usuarioService.listarRoles(),
        ]);

        const mergedUsuarios = [...(usuariosData || []), ...(usuariosSinRolData || [])];
        const uniqueUsuarios = mergedUsuarios.filter(
          (usuario, index, self) =>
            index === self.findIndex((candidate) => Number(candidate.id_usuario) === Number(usuario.id_usuario)),
        );

        setUsuarios(uniqueUsuarios.map(buildUserSummary));
        setRoleOptions((rolesData || []).filter((role) => String(role?.nombre_rol || "").trim() !== "Alumno"));
      } catch (error) {
        console.error("No se pudieron cargar usuarios para roles", error);
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
      .map((role) => String(role).trim())
      .filter((roleName) => roleName !== "Alumno");

    const existingRoles = usuarios
      .map((usuario) => normalizeRole(usuario?.rol))
      .filter((roleName) => roleName !== "Sin rol" && roleName !== "Alumno");

    const hasPendingRoles = usuarios.some((usuario) => normalizeRole(usuario?.rol) === "Sin rol");

    return [...new Set([...backendRoles, ...existingRoles, ...(hasPendingRoles ? ["Sin rol"] : [])])].sort();
  }, [usuarios, roleOptions]);

  const getUserSortValue = (usuario) => {
    const candidateFields = [
      usuario?.created_at,
      usuario?.createdAt,
      usuario?.fecha_creacion,
      usuario?.fecha_registro,
      usuario?.fecha_ingreso,
      usuario?.fecha,
    ];

    for (const value of candidateFields) {
      if (!value) continue;
      const parsedValue = new Date(value);
      if (!Number.isNaN(parsedValue.getTime())) {
        return parsedValue.getTime();
      }
    }

    return Number(usuario?.id_usuario ?? 0);
  };

  const filteredUsuarios = useMemo(() => {
    const query = search.toLowerCase();
    const users = usuarios.filter((usuario) => {
      const fullName = `${usuario.nombre || ""} ${usuario.correo || ""}`.toLowerCase();
      const matchesSearch = !query || fullName.includes(query);
      const matchesRole = !roleFilter || normalizeRole(usuario?.rol) === roleFilter;
      return matchesSearch && matchesRole;
    });

    if (sortOrder === "oldest-first") {
      return [...users].sort((leftUser, rightUser) => {
        const leftValue = getUserSortValue(leftUser);
        const rightValue = getUserSortValue(rightUser);
        return leftValue - rightValue || Number(leftUser?.id_usuario ?? 0) - Number(rightUser?.id_usuario ?? 0);
      });
    }

    return [...users].sort((leftUser, rightUser) => {
      const leftValue = getUserSortValue(leftUser);
      const rightValue = getUserSortValue(rightUser);
      return rightValue - leftValue || Number(rightUser?.id_usuario ?? 0) - Number(leftUser?.id_usuario ?? 0);
    });
  }, [usuarios, search, roleFilter, sortOrder]);

  const paginatedUsuarios = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsuarios.slice(start, start + PAGE_SIZE);
  }, [filteredUsuarios, page]);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredUsuarios.length / PAGE_SIZE));

  const handleRoleChangeRequest = (targetUser, nextRoleName) => {
    if (targetUser.rol === nextRoleName || (!targetUser.rol && nextRoleName === "SinRol")) {
      return;
    }

    const selectedRole = roleOptions.find((role) => role.nombre_rol === nextRoleName);
    const currentUserId = usuarioAutenticado?.id_usuario ?? usuarioAutenticado?.id ?? null;
    const isSelfChange = Number(targetUser.id_usuario) === Number(currentUserId);
    const isDirectivaChange = nextRoleName === "Directiva";
    const isCoordinatorAdminChange = nextRoleName === "Coordinador Administrativo";

    if (isCoordinatorAdmin && (isSelfChange || isDirectivaChange)) {
      setFeedbackType("error");
      setFeedbackMessage("No tienes permisos para asignar Directiva ni para modificar tu propio rol.");
      return;
    }

    const needsDoubleConfirm = isSelfChange || isDirectivaChange || isCoordinatorAdminChange;

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
      isCoordinatorAdminChange,
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

    const requiresSecondConfirm = pendingRoleChange.isDirectivaChange || pendingRoleChange.isCoordinatorAdminChange;

    if (requiresSecondConfirm && pendingRoleChange.confirmStep === "initial") {
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
    setSelectedUser((currentUser) => (currentUser?.id_usuario === usuario.id_usuario ? null : usuario));
  };

  const requiresSecondConfirm = Boolean(
    pendingRoleChange && (pendingRoleChange.isDirectivaChange || pendingRoleChange.isCoordinatorAdminChange),
  );

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
            <button type="button" className="home-nav-button" onClick={() => navigate("/home")}>Cursos</button>
            <button type="button" className="home-nav-button home-nav-button-home" onClick={() => navigate("/home")} aria-label="Ir al inicio">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 10.2 12 4l8 6.2V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
              </svg>
            </button>
            <button type="button" className="home-nav-button" onClick={() => navigate("/admin/roles")}>Asignar roles</button>
          </div>
        </div>

        <div className="home-topbar-actions">
          <span className="home-role-badge">{rol || "Administrativo"}</span>
          <ProfileMenu user={{ nombre: "Usuario", rol: rol || "Administrativo", email: "usuario@ejemplo.com" }} />
        </div>
      </header>

      <button type="button" className="usuarios-back-link" onClick={() => navigate("/home")} aria-label="Volver al dashboard">
        <span aria-hidden="true">&lt;</span> Volver
      </button>

      <div className="usuarios-header">
        <div>
          <p className="usuarios-eyebrow">Administración</p>
          <h1>Asignar roles</h1>
          <p className="usuarios-subtitle">Gestiona únicamente los roles de los usuarios con las mismas verificaciones de seguridad.</p>
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
        sortOrder={sortOrder}
        onSortOrderChange={() => setSortOrder((current) => (current === "oldest-first" ? "default" : "oldest-first"))}
      />

      {loading ? (
        <div className="usuarios-loading" role="status" aria-live="polite">
          <div className="usuarios-spinner" />
          <span>Cargando usuarios...</span>
        </div>
      ) : (
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
          isCoordinatorAdmin={isCoordinatorAdmin}
          enableRoleSelect
        />
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
            {requiresSecondConfirm && !pendingRoleChange.isSelfChange && pendingRoleChange.confirmStep === "initial" && (
              <p className="usuarios-modal-warning">
                Este cambio otorga acceso privilegiado. Confirme esta acción antes de continuar.
              </p>
            )}
            {requiresSecondConfirm && !pendingRoleChange.isSelfChange && pendingRoleChange.confirmStep === "final" && (
              <p className="usuarios-modal-warning">
                Está a punto de otorgar un acceso privilegiado. Confirme esta acción una segunda vez.
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
                  : requiresSecondConfirm && pendingRoleChange.confirmStep === "initial"
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

export default RolesPage;
