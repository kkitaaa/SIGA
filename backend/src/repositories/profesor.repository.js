import prisma from "../config/prisma.js";

export class ProfesorRepository {
  async findByUsuarioWithCursosAndEstudiantes(idUsuario) {
    const profesor = await prisma.profesor.findUnique({
      where: { id_usuario: idUsuario },
      include: {
        cursos: {
          include: {
            estudiantes: true,
          },
        },
      },
    });

    console.debug(
      `[ProfesorRepository] findByUsuarioWithCursosAndEstudiantes idUsuario=${idUsuario} profesorFound=${!!profesor}`,
    );
    if (profesor) {
      console.debug(
        `[ProfesorRepository] cursosCount=${(profesor.cursos || []).length}`,
      );
    }

    return profesor;
  }
}
