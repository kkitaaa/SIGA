import { CursoRepository } from "../repositories/curso.repository.js";

export class CursoService {
  static async crearCurso(dto) {
    const cursoExistente = await CursoRepository.findByDetalles(
      dto.nivel_educativo,
      dto.nivel_curso,
      dto.letra,
    );

    if (cursoExistente) {
      throw new Error(
        "BUSINESS_ERROR: Ya existe un curso registrado con este nivel y letra",
      );
    }

    return await CursoRepository.create(dto);
  }

  static async obtenerCursos() {
    return await CursoRepository.findAll();
  }
}
