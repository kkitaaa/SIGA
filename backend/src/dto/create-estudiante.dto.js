export class CreateEstudianteDTO {
  constructor(data) {
    this.rut = data.rut?.trim();
    this.primer_nombre = data.nombre?.trim() || data.primer_nombre?.trim();
    this.segundo_nombre = data.segundo_nombre?.trim() || null;

    this.primer_apellido = data.primer_apellido?.trim() || "";
    this.segundo_apellido = data.segundo_apellido?.trim() || null;

    this.sexo = data.sexo?.trim() || "";

    this.fecha_nacimiento = data.fecha_nacimiento
      ? new Date(data.fecha_nacimiento)
      : null;

    this.fecha_ingreso = data.fecha_ingreso
      ? new Date(data.fecha_ingreso)
      : new Date();

    this.id_curso = Number(data.curso || data.id_curso);

    // Siempre parte en false.
    // Solo el módulo PIE debería cambiar este valor.
    this.es_nee = false;

    this.validate();
  }

  validate() {
    if (!this.primer_nombre) {
      throw new Error("VALIDATION_ERROR: El nombre es obligatorio");
    }

    if (!this.primer_apellido) {
      throw new Error("VALIDATION_ERROR: El primer apellido es obligatorio");
    }

    if (!this.rut) {
      throw new Error("VALIDATION_ERROR: El RUT es obligatorio");
    }

    if (!this.id_curso) {
      throw new Error("VALIDATION_ERROR: El curso es obligatorio");
    }

    if (!this.fecha_nacimiento || isNaN(this.fecha_nacimiento.getTime())) {
      throw new Error(
        "VALIDATION_ERROR: La fecha de nacimiento es obligatoria",
      );
    }

    if (!this.sexo) {
      throw new Error("VALIDATION_ERROR: El sexo es obligatorio");
    }
  }
}
