import React from "react";

function EstudianteCard({ estudiante, onBack }) {
  return (
    <div className="usuarios-detail-card">
      <h2 style={{ marginTop: 0 }}>Detalle de estudiante</h2>
      <p><strong>Nombre:</strong> {`${estudiante.primer_nombre || ""} ${estudiante.primer_apellido || ""}`.trim()}</p>
      <p><strong>RUT:</strong> {estudiante.rut || "—"}</p>
      <p><strong>Curso:</strong> {estudiante.curso?.nombre_curso || estudiante.id_curso || "—"}</p>
      <p><strong>Sexo:</strong> {estudiante.sexo || "—"}</p>
      <p><strong>Estado:</strong> {estudiante.activo === false ? "Inactivo" : "Activo"}</p>
      <p><strong>PIE:</strong> {estudiante.es_nee ? "Sí" : "No"}</p>
      <button type="button" className="usuarios-modal-cancel" onClick={onBack} style={{ marginTop: "1rem" }}>
        Volver
      </button>
    </div>
  );
}

export default EstudianteCard;
