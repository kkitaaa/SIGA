import React from "react";

function UsuarioFilters({ search, onSearchChange, roleFilter, onRoleFilterChange, roles, sortOrder, onSortOrderChange }) {
  const isOldestFirst = sortOrder === "oldest-first";

  return (
    <div className="usuarios-filters">
      <input
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por nombre o correo"
        className="usuarios-input"
      />

      <button
        type="button"
        className={`usuarios-sort-button ${isOldestFirst ? "is-active" : ""}`}
        onClick={onSortOrderChange}
        aria-pressed={isOldestFirst}
        aria-label={isOldestFirst ? "Cambiar a más reciente" : "Cambiar a más antiguo"}
        title={isOldestFirst ? "Cambiar a más reciente" : "Cambiar a más antiguo"}
      >
        {isOldestFirst ? "Más antiguo" : "Más reciente"}
      </button>

      <select
        value={roleFilter}
        onChange={(event) => onRoleFilterChange(event.target.value)}
        className="usuarios-select"
      >
        <option value="">Todos los roles</option>
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
        {!roles.includes("Sin rol") && (
          <option value="Sin rol">Sin rol</option>
        )}
      </select>
    </div>
  );
}

export default UsuarioFilters;
