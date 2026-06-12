export class RegisterDTO {
  constructor(data) {
    // Limpieza y normalización de datos
    this.nombre = data.nombre?.trim() || "";
    this.email = data.email?.trim().toLowerCase() || "";
    this.password = data.password || "";
    this.rut = data.rut?.trim() || "";
    this.rol = data.rol?.trim(); // Opcional, puede ser null o undefined

    this.validate();
  }

  validate() {
    if (!this.nombre)
      throw new Error("VALIDATION_ERROR: El nombre es obligatorio");
    if (!this.email)
      throw new Error("VALIDATION_ERROR: El email es obligatorio");

    // Validacion formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email))
      throw new Error("VALIDATION_ERROR: El formato del email no es válido");

    if (!this.password)
      throw new Error("VALIDATION_ERROR: La contraseña es obligatoria");
    if (!this.rut) throw new Error("VALIDATION_ERROR: El RUT es obligatorio");
  }
}
