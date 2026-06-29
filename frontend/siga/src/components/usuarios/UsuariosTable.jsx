import React from "react";

function UsuariosTable({ usuarios, selectedUser, onSelectUser, page, totalPages, onPageChange }) {
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
              <td>{usuario.rol || "SinRol"}</td>
              <td>
                <button
                  type="button"
                  className="usuarios-action"
                  onClick={() => onSelectUser(usuario)}
                >
                  {selectedUser?.id_usuario === usuario.id_usuario ? "Seleccionado" : "Ver detalle"}
                </button>
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
