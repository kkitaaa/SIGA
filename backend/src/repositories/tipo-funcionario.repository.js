import prisma from "../config/prisma.js";

export class TipoFuncionarioRepository {
  async crear(data) {
    return prisma.tipoFuncionario.create({ data });
  }

  async listar() {
    return prisma.tipoFuncionario.findMany();
  }

  async obtenerPorId(id) {
    return prisma.tipoFuncionario.findUnique({
      where: { id_tipo_funcionario: id },
    });
  }

  async actualizar(id, data) {
    return prisma.tipoFuncionario.update({
      where: { id_tipo_funcionario: id },
      data,
    });
  }

  async desactivar(id) {
    return prisma.tipoFuncionario.update({
      where: { id_tipo_funcionario: id },
      data: { activo: false },
    });
  }

  async buscarPorNombre(nombre) {
    return prisma.tipoFuncionario.findUnique({ where: { nombre } });
  }
}
