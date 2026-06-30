// observers/asignacion.observer.js
import prisma from "../config/prisma.js";

export const registrarAsignacionPIELog = async (evento) => {
  await prisma.asignacionPieLog.create({
    data: {
      usuarioId: evento.usuarioId,
      estudianteId: evento.estudianteId,
      funcionarioId: evento.funcionarioId,
      accion: evento.accion,
      fecha: evento.fecha,
    },
  });
};
