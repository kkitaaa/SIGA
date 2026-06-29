import { TipoFuncionarioRepository } from "../repositories/tipo-funcionario.repository.js";
import prisma from "../config/prisma.js";

const repo = new TipoFuncionarioRepository();

export class TipoFuncionarioService {
  async registrarTipo({ nombre, descripcion }) {
    if (!nombre) throw new Error("El nombre es obligatorio");

    const existente = await repo.buscarPorNombre(nombre);
    if (existente && existente.activo) {
      throw new Error("Ya existe un tipo de funcionario con ese nombre");
    }
    if (existente && !existente.activo) {
      throw new Error("El tipo existe pero está desactivado. Reactívalo primero.");
    }

    return repo.crear({ nombre, descripcion });
  }

  async listarTipos() {
    return repo.listar();
  }

  async obtenerDetalle(id) {
    const tipo = await repo.obtenerPorId(id);
    if (!tipo) throw new Error("Tipo de funcionario no encontrado");
    return tipo;
  }

  async actualizarTipo(id, data) {
    return repo.actualizar(id, data);
  }

  async desactivarTipo(id) {
    return repo.desactivar(id);
  }
}
