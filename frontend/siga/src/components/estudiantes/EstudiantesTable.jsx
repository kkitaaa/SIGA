import React from "react";

function EstudiantesTable({ estudiantes, onVerDetalle, onEditar, onDesactivar }) {
  return (
    <div className="usuarios-card">
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>RUT</th>
            <th>Curso</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((estudiante) => (
            <tr key={estudiante.id_estudiante}>
              <td>{`${estudiante.primer_nombre || ""} ${estudiante.primer_apellido || ""}`.trim()}</td>
              <td>{estudiante.rut || "—"}</td>
              <td>{estudiante.curso?.nombre_curso || estudiante.id_curso || "—"}</td>
              <td>{estudiante.activo === false ? "Inactivo" : "Activo"}</td>
              <td>
                <div className="usuarios-action-cell">
                  <button type="button" className="usuarios-action" onClick={() => onVerDetalle(estudiante)}>
                    Ver detalle
                  </button>
                  <button type="button" className="usuarios-action is-active" onClick={() => onEditar(estudiante)} style={{ marginLeft: "0.5rem" }}>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="usuarios-action"
                    onClick={() => onDesactivar(estudiante)}
                    style={{ marginLeft: "0.5rem", background: "#b91c1c" }}
                  >
                    Desactivar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EstudiantesTable;
