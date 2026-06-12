export class LoginDTO {
  constructor(data) {
    // Limpieza y normalización de datos
    this.email = data.email?.trim().toLowerCase() || "";
    this.password = data.password || "";

    this.validate();
  }

  validate() {
    if (!this.email)
      throw new Error("VALIDATION_ERROR: El email es obligatorio");
    if (!this.password)
      throw new Error("VALIDATION_ERROR: La contraseña es obligatoria");
  }
}
