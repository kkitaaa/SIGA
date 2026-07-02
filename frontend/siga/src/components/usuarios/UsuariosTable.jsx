import React from "react";

function UsuariosTable({
  usuarios,
  selectedUser,
  onToggleDetail,
  page,
  totalPages,
  onPageChange,
  roleOptions,
  onRoleChangeRequest,
  currentUserId,
  isCoordinatorAdmin = false,
  canEditUserInfo = false,
  onEditUser,
  enableRoleSelect = false,
}) {
  return (
    <div className="usuarios-card">
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id_usuario}>
              <td>{usuario.nombre || `${usuario.primer_nombre || ""} ${usuario.primer_apellido || ""}`.trim()}</td>
              <td>{usuario.correo || usuario.email || "—"}</td>
              <td>
                {enableRoleSelect ? (
                  <select
                    className="usuarios-role-select"
                    value={
                      roleOptions.some((role) => role.nombre_rol === usuario.rol)
                        ? usuario.rol || ""
                        : roleOptions[0]?.nombre_rol || ""
                    }
                    onChange={(event) => onRoleChangeRequest(usuario, event.target.value)}
                    aria-label={`Cambiar rol de ${usuario.nombre || `${usuario.primer_nombre || ""} ${usuario.primer_apellido || ""}`.trim()}`}
                  >
                    {roleOptions.length === 0 ? (
                      <option value="">Sin roles disponibles</option>
                    ) : (
                      roleOptions
                        .filter((role) => !isCoordinatorAdmin || role.nombre_rol !== "Directiva")
                        .map((role) => (
                          <option key={role.id_rol} value={role.nombre_rol}>
                            {role.nombre_rol}
                          </option>
                        ))
                    )}
                  </select>
                ) : (
                  <span className="usuarios-role-text">{usuario.rol || "Sin rol"}</span>
                )}
              </td>
              <td>
                <div className="usuarios-action-cell">
                  <button
                    type="button"
                    className={`usuarios-action ${selectedUser?.id_usuario === usuario.id_usuario ? "is-active" : ""}`}
                    onClick={() => onToggleDetail(usuario)}
                  >
                    {selectedUser?.id_usuario === usuario.id_usuario ? "Ocultar" : "Ver detalle"}
                  </button>

                  {canEditUserInfo && (
                    <button type="button" className="usuarios-action" onClick={() => onEditUser(usuario)}>
                      Editar datos
                    </button>
                  )}

                  {selectedUser?.id_usuario === usuario.id_usuario && (
                    <div className="usuarios-detail-popover" role="dialog" aria-live="polite">
                      <h3>Detalle de usuario</h3>
                      <p>
                        <strong>Nombre:</strong> {selectedUser.nombre || `${selectedUser.primer_nombre || ""} ${selectedUser.primer_apellido || ""}`.trim()}
                      </p>
                      <p>
                        <strong>Correo:</strong> {selectedUser.correo || selectedUser.email || "—"}
                      </p>
                      <p>
                        <strong>Rol:</strong> {selectedUser.rol || "Sin rol"}
                      </p>
                      <p>
                        <strong>RUT:</strong> {selectedUser.rut || "—"}
                      </p>
                      <p>
                        <strong>Teléfono:</strong> {selectedUser.numero_telefonico || "—"}
                      </p>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="usuarios-pagination">
        <button type="button" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button type="button" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default UsuariosTable;
