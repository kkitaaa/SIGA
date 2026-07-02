export class CursoService {
  // El constructor inyecta el repositorio, tal como en tus otros servicios
  constructor(cursoRepository) {
    this.repository = cursoRepository;
  }

  async crearCurso(dto) {
    // Usamos this.repository en lugar de la clase CursoRepository directamente
    const cursoExistente = await this.repository.findByDetalles(
      dto.nivel_educativo,
      dto.nivel_curso,
      dto.letra,
    );

    if (cursoExistente) {
      throw new Error(
        "BUSINESS_ERROR: Ya existe un curso registrado con este nivel y letra",
      );
    }

    return await this.repository.create(dto);
  }

  async obtenerCursos() {
    return await this.repository.findAll();
  }

  async obtenerCursoPorId(id) {
    // Aquí es donde fallaba antes, ahora this.repository existe y es la instancia correcta
    const curso = await this.repository.findById(id);
    
    if (!curso) {
      throw new Error("Curso no encontrado");
    }
    
    return curso;
  }
}