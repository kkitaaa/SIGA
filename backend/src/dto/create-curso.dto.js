export class CreateCursoDTO {
  constructor(data) {
    this.nivel_educativo = data.nivel_educativo?.trim();
    this.nivel_curso = data.nivel_curso?.trim();
    this.letra = data.letra?.trim().toUpperCase();
    this.id_profesor = data.id_profesor || data.profesor_id;

    this.validate();
  }

  validate() {
    if (!this.nivel_educativo)
      throw new Error(
        "VALIDATION_ERROR: El nivel educativo es obligatorio (ej: Básica, Media)",
      );
    if (!this.nivel_curso)
      throw new Error(
        "VALIDATION_ERROR: El nivel del curso es obligatorio (ej: Primero, Segundo)",
      );
    if (!this.letra)
      throw new Error(
        "VALIDATION_ERROR: La letra del curso es obligatoria (ej: A, B)",
      );
    if (!this.id_profesor)
      throw new Error(
        "VALIDATION_ERROR: Se debe asignar un ID de profesor al curso",
      );
  }
}
