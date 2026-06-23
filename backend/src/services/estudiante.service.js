import { EstudianteRepository } from '../repositories/estudiante.repository.js';

export class EstudianteService {
  static async registrarEstudiante(dto) {
    // Evitar estudiantes duplicados por RUT
    const estudianteExistente = await EstudianteRepository.findByRut(dto.rut);
    
    if (estudianteExistente) {
      throw new Error("BUSINESS_ERROR: Ya existe un estudiante registrado con este RUT");
    }

    // Si no existe, lo creamos
    return await EstudianteRepository.create(dto);
  }
}