import { FuncionarioRepository } from "../repositories/funcionario.repository.js";

export class FuncionarioService {
  static async listarProfesionales() {
    const funcionarios = await FuncionarioRepository.findAllFuncionarios();

    // Mapeamos para devolver un arreglo plano más fácil de usar en React
    return funcionarios.map(f => ({
      id_funcionario: f.id_funcionario,
      nombre: `${f.usuario.primer_nombre} ${f.usuario.primer_apellido}`,
      tipo_profesional: f.tipoFuncionario.nombre // Ej: "Psicólogo" (por si lo quieres mostrar en el frontend)
    }));
  }
}