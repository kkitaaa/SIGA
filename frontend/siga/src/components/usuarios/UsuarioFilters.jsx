import React from "react";

function UsuarioFilters({ search, onSearchChange, roleFilter, onRoleFilterChange, roles }) {
  return (
    <div className="usuarios-filters">
      <input
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por nombre o correo"
        className="usuarios-input"
      />

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
      </select>
    </div>
  );
}

export default UsuarioFilters;
