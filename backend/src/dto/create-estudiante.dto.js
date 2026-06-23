export class CreateEstudianteDTO {
  constructor(data) {
    this.rut = data.rut?.trim();
    this.primer_nombre = data.nombre?.trim() || data.primer_nombre?.trim();
    this.id_curso = data.curso || data.id_curso;

    this.segundo_nombre = data.segundo_nombre?.trim() || null;
    this.primer_apellido = data.primer_apellido?.trim() || "";
    this.segundo_apellido = data.segundo_apellido?.trim() || null;
    this.edad = data.edad;
    this.sexo = data.sexo?.trim() || "";
    this.ano_nacimiento = data.ano_nacimiento;
    this.mes_nacimiento = data.mes_nacimiento;
    this.dia_nacimiento = data.dia_nacimiento;
    this.fecha_ingreso = data.fecha_ingreso
      ? new Date(data.fecha_ingreso)
      : new Date();
    this.id_usuario = data.id_usuario;
    this.id_tipo = data.id_tipo;

    this.validate();
  }

  validate() {
    if (!this.primer_nombre)
      throw new Error("VALIDATION_ERROR: El nombre es obligatorio");
    if (!this.rut) throw new Error("VALIDATION_ERROR: El RUT es obligatorio");
    if (!this.id_curso)
      throw new Error("VALIDATION_ERROR: El curso es obligatorio");
  }
}
