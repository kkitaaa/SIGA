import React from "react";

function EstudianteFilters({ search, onSearchChange, cursoFilter, onCursoFilterChange, estadoFilter, onEstadoFilterChange, cursos }) {
  return (
    <div className="usuarios-filters">
      <input
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por nombre o RUT"
        className="usuarios-input"
      />

      <select value={cursoFilter} onChange={(event) => onCursoFilterChange(event.target.value)} className="usuarios-select">
        <option value="">Todos los cursos</option>
        {cursos.map((curso) => (
          <option key={curso.id_curso} value={curso.id_curso}>
            {curso.nombre_curso || `Curso ${curso.id_curso}`}
          </option>
        ))}
      </select>

      <select value={estadoFilter} onChange={(event) => onEstadoFilterChange(event.target.value)} className="usuarios-select">
        <option value="">Todos los estados</option>
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>
    </div>
  );
}

export default EstudianteFilters;
