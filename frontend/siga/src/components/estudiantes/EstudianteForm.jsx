import React, { useState, useEffect } from "react";

const emptyForm = {
  rut: "",
  primer_nombre: "",
  segundo_nombre: "",
  primer_apellido: "",
  segundo_apellido: "",
  sexo: "M",
  fecha_nacimiento: "",
  fecha_ingreso: "",
  id_curso: "",
  es_nee: false,
};

const toDateInputValue = (value) => {
  if (!value) return "";
  if (typeof value !== "string") return "";
  if (value.includes("/")) {
    const [day, month, year] = value.split("/");
    if (!day || !month || !year) return "";
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return value.split("T")[0];
};

function EstudianteForm({ initialValues, onSubmit, onCancel, submitLabel, cursos = [] }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm({
      ...emptyForm,
      ...(initialValues || {}),
      fecha_nacimiento: toDateInputValue(initialValues?.fecha_nacimiento),
      fecha_ingreso: toDateInputValue(initialValues?.fecha_ingreso),
      id_curso: initialValues?.id_curso ?? "",
    });
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      fecha_nacimiento: form.fecha_nacimiento ? `${form.fecha_nacimiento}T00:00:00.000Z` : null,
      fecha_ingreso: form.fecha_ingreso ? `${form.fecha_ingreso}T00:00:00.000Z` : null,
      id_curso: Number(form.id_curso),
      es_nee: Boolean(form.es_nee),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="usuarios-detail-card">
      <div className="usuarios-filters" style={{ alignItems: "flex-start", flexDirection: "column" }}>
        <label htmlFor="rut" style={{ width: "100%", marginBottom: "0.25rem", fontWeight: 700, color: "#0f172a" }}>
          RUT
        </label>
        <input id="rut" name="rut" value={form.rut || ""} onChange={handleChange} className="usuarios-input" required />

        <label htmlFor="primer_nombre" style={{ width: "100%", marginBottom: "0.25rem", fontWeight: 700, color: "#0f172a" }}>
          Primer nombre
        </label>
        <input id="primer_nombre" name="primer_nombre" value={form.primer_nombre || ""} onChange={handleChange} className="usuarios-input" required />

        <label htmlFor="segundo_nombre" style={{ width: "100%", marginBottom: "0.25rem", fontWeight: 700, color: "#0f172a" }}>
          Segundo nombre
        </label>
        <input id="segundo_nombre" name="segundo_nombre" value={form.segundo_nombre || ""} onChange={handleChange} className="usuarios-input" />

        <label htmlFor="primer_apellido" style={{ width: "100%", marginBottom: "0.25rem", fontWeight: 700, color: "#0f172a" }}>
          Primer apellido
        </label>
        <input id="primer_apellido" name="primer_apellido" value={form.primer_apellido || ""} onChange={handleChange} className="usuarios-input" required />

        <label htmlFor="segundo_apellido" style={{ width: "100%", marginBottom: "0.25rem", fontWeight: 700, color: "#0f172a" }}>
          Segundo apellido
        </label>
        <input id="segundo_apellido" name="segundo_apellido" value={form.segundo_apellido || ""} onChange={handleChange} className="usuarios-input" />

        <label htmlFor="sexo" style={{ width: "100%", marginBottom: "0.25rem", fontWeight: 700, color: "#0f172a" }}>
          Sexo
        </label>
        <select id="sexo" name="sexo" value={form.sexo || "M"} onChange={handleChange} className="usuarios-select">
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="O">Otro</option>
        </select>

        <label htmlFor="fecha_nacimiento" style={{ width: "100%", marginBottom: "0.25rem", fontWeight: 700, color: "#0f172a" }}>
          Fecha de nacimiento
        </label>
        <input id="fecha_nacimiento" name="fecha_nacimiento" type="date" value={form.fecha_nacimiento || ""} onChange={handleChange} className="usuarios-input" required />

        <label htmlFor="fecha_ingreso" style={{ width: "100%", marginBottom: "0.25rem", fontWeight: 700, color: "#0f172a" }}>
          Fecha de ingreso
        </label>
        <input id="fecha_ingreso" name="fecha_ingreso" type="date" value={form.fecha_ingreso || ""} onChange={handleChange} className="usuarios-input" />

        <label htmlFor="id_curso" style={{ width: "100%", marginBottom: "0.25rem", fontWeight: 700, color: "#0f172a" }}>
          Curso
        </label>
        <select id="id_curso" name="id_curso" value={form.id_curso || ""} onChange={handleChange} className="usuarios-select" required>
          <option value="">Selecciona un curso</option>
          {cursos.map((curso) => (
            <option key={curso.id_curso} value={curso.id_curso}>
              {curso.nombre_curso || `Curso ${curso.id_curso}`}
            </option>
          ))}
        </select>

        <label style={{ width: "100%", marginTop: "0.5rem", fontWeight: 700, color: "#0f172a" }}>
          Estudiante NEE
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#334155" }}>
          <input type="checkbox" name="es_nee" checked={Boolean(form.es_nee)} onChange={handleChange} />
          Pertenece a PIE / NEE
        </label>
      </div>

      <div className="usuarios-modal-actions" style={{ marginTop: "1rem" }}>
        <button type="button" className="usuarios-modal-cancel" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="usuarios-modal-confirm">{submitLabel}</button>
      </div>
    </form>
  );
}

export default EstudianteForm;
