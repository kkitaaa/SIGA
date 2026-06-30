-- CreateTable
CREATE TABLE "AsignacionPieLog" (
    "id_log" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "accion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AsignacionPieLog_pkey" PRIMARY KEY ("id_log")
);

-- AddForeignKey
ALTER TABLE "AsignacionPieLog" ADD CONSTRAINT "AsignacionPieLog_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionPieLog" ADD CONSTRAINT "AsignacionPieLog_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante"("id_estudiante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionPieLog" ADD CONSTRAINT "AsignacionPieLog_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario"("id_funcionario") ON DELETE RESTRICT ON UPDATE CASCADE;
