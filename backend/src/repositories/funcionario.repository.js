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
}
