export class UpdateEstudianteDTO {
  constructor(data) {
    this.primer_nombre = data.primer_nombre;
    this.segundo_nombre = data.segundo_nombre;
    this.primer_apellido = data.primer_apellido;
    this.segundo_apellido = data.segundo_apellido;
    this.sexo = data.sexo;
    this.fecha_nacimiento = data.fecha_nacimiento;
    this.fecha_ingreso = data.fecha_ingreso;
    this.id_curso = data.id_curso;
    this.es_nee = data.es_nee;

    this.validate();
  }

  validate() {
    if (this.primer_nombre && typeof this.primer_nombre !== "string") {
      throw new Error("VALIDATION_ERROR: primer_nombre debe ser string");
    }
    if (this.primer_apellido && typeof this.primer_apellido !== "string") {
      throw new Error("VALIDATION_ERROR: primer_apellido debe ser string");
    }
    if (this.sexo && typeof this.sexo !== "string") {
      throw new Error("VALIDATION_ERROR: sexo debe ser string");
    }
    if (this.fecha_nacimiento && Number.isNaN(Date.parse(this.fecha_nacimiento))) {
      throw new Error("VALIDATION_ERROR: fecha_nacimiento inválida");
    }
    if (this.fecha_ingreso && Number.isNaN(Date.parse(this.fecha_ingreso))) {
      throw new Error("VALIDATION_ERROR: fecha_ingreso inválida");
    }
    if (this.id_curso && !Number.isInteger(Number(this.id_curso))) {
      throw new Error("VALIDATION_ERROR: id_curso debe ser entero");
    }
    if (this.es_nee !== undefined && typeof this.es_nee !== "boolean") {
      throw new Error("VALIDATION_ERROR: es_nee debe ser boolean");
    }
  }
}
