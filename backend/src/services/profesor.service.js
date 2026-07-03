export class ProfesorService {
  constructor(profesorRepository) {
    this.repository = profesorRepository;
  }

  async obtenerMetricasProfesorPorUsuario(idUsuario) {
    const profesor =
      await this.repository.findByUsuarioWithCursosAndEstudiantes(idUsuario);

    if (!profesor) return null;

    const cursos = profesor.cursos || [];
    const cursosTotales = cursos.length;
    let estudiantesTotales = 0;
    let estudiantesPie = 0;

    cursos.forEach((curso) => {
      estudiantesTotales += (curso.estudiantes || []).length;

      const alumnosPieDelCurso = (curso.estudiantes || []).filter(
        (estudiante) => estudiante.es_nee === true,
      ).length;

      estudiantesPie += alumnosPieDelCurso;
    });

    return {
      estudiantesTotales,
      estudiantesPie,
      cursosTotales,
    };
  }
}
