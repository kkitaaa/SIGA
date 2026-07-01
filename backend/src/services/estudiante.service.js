import { EstudianteRepository } from "../repositories/estudiante.repository.js";

export class EstudianteService {
  static async registrarEstudiante(dto) {
    const estudianteExistente = await EstudianteRepository.findByRut(dto.rut);

    if (estudianteExistente) {
      throw new Error(
        "BUSINESS_ERROR: Ya existe un estudiante registrado con este RUT",
      );
    }

    return await EstudianteRepository.create({
      rut: dto.rut,
      primer_nombre: dto.primer_nombre,
      segundo_nombre: dto.segundo_nombre,
      primer_apellido: dto.primer_apellido,
      segundo_apellido: dto.segundo_apellido,
      sexo: dto.sexo,
      fecha_nacimiento: dto.fecha_nacimiento,
      fecha_ingreso: dto.fecha_ingreso,
      id_curso: dto.id_curso,
      es_nee: false,
    });
  }

  static async listarEstudiantes() {
    return await EstudianteRepository.findAll();
  }

  static async listarEstudiantesNee() {
    return await EstudianteRepository.findAllNee();
  }

  static async obtenerEstudiantePorId(id) {
    if (!Number.isInteger(Number(id))) {
      throw new TypeError("VALIDATION_ERROR: ID inválido");
    }

    const estudiante = await EstudianteRepository.findById(id);

    if (!estudiante) {
      throw new Error("BUSINESS_ERROR: Estudiante no encontrado");
    }

    return estudiante;
  }

  static async actualizarEstudiante(id, dto) {
    if (!Number.isInteger(Number(id))) {
      throw new TypeError("VALIDATION_ERROR: ID inválido");
    }

    const estudiante = await EstudianteRepository.findById(id);
    if (!estudiante) {
      throw new Error("BUSINESS_ERROR: Estudiante no encontrado");
    }

    return await EstudianteRepository.update(id, {
      primer_nombre: dto.primer_nombre,
      segundo_nombre: dto.segundo_nombre,
      primer_apellido: dto.primer_apellido,
      segundo_apellido: dto.segundo_apellido,
      sexo: dto.sexo,
      fecha_nacimiento: dto.fecha_nacimiento,
      fecha_ingreso: dto.fecha_ingreso,
      id_curso: dto.id_curso,
      es_nee: dto.es_nee,
    });
  }
}