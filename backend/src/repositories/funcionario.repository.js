import prisma from "../config/prisma.js";

export class FuncionarioRepository {
  async findPieMemberByUserId(idFuncionario, tx = prisma) {
    return tx.funcionario.findUnique({
      where: { id_funcionario: Number(idFuncionario) },
      include: {
        usuario: true,
      },
    });
  }

  static async findAllFuncionarios() {
    return await prisma.funcionario.findMany({
      include: {
        usuario: {
          select: {
            primer_nombre: true,
            primer_apellido: true
          }
        },
        tipoFuncionario: {
          select: {
            nombre: true
          }
        }
      }
    });
  }
}