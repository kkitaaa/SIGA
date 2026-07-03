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
              <td>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td>
                {Number(usuario.id_usuario) === Number(currentUserId) ? (
                  <span className="usuarios-role-text">
                    {usuario.rol || "Sin rol"}
                  </span>
                ) : (
                  (() => {
                    const rawRole = usuario.rol || "";
                    const normalizedRole = String(rawRole).trim().toLowerCase().replace(/\s+/g, "");
                    const hasRole = normalizedRole && normalizedRole !== "sinrol";
                    return (
                      <select
                        className="usuarios-role-select"
                        value={hasRole ? rawRole : ""}
                        onChange={(event) => onRoleChangeRequest(usuario, event.target.value)}
                        aria-label={`Cambiar rol de ${usuario.nombre}`}
                      >
                        {roleOptions.length === 0 && <option value="">Sin roles disponibles</option>}
                        {!hasRole && <option value="">- Asignar rol -</option>}
                        {roleOptions
                          .filter((role) => !isCoordinatorAdmin || role.nombre_rol !== "Directiva")
                          .map((role) => (
                            <option key={role.id_rol} value={role.nombre_rol}>
                              {role.nombre_rol}
                            </option>
                          ))}
                      </select>
                    );
                  })()
                )}
              </td>
              <td>
                <div className="usuarios-action-cell">
                  <button
                    type="button"
                    className={`usuarios-action ${
                      selectedUser?.id_usuario === usuario.id_usuario
                        ? "is-active"
                        : ""
                    }`}
                    onClick={() => onToggleDetail(usuario)}
                  >
                    {selectedUser?.id_usuario === usuario.id_usuario
                      ? "Ocultar"
                      : "Ver detalle"}
                  </button>

                  {selectedUser?.id_usuario === usuario.id_usuario && (
                    <div
                      className="usuarios-detail-popover"
                      role="dialog"
                      aria-live="polite"
                    >
                      <h3>Detalle de usuario</h3>
                      <p>
                        <strong>Nombre:</strong> {selectedUser.nombre}
                      </p>
                      <p>
                        <strong>Correo:</strong> {selectedUser.correo}
                      </p>
                      <p>
                        <strong>Rol:</strong>{' '}
                        {(() => {
                          const r = selectedUser.rol || "";
                          const norm = String(r).trim().toLowerCase().replace(/\s+/g, "");
                          return norm && norm !== "sinrol" ? selectedUser.rol : "- asignar rol -";
                        })()}
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
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default UsuariosTable;
