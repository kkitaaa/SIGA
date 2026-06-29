/*
  Warnings:

  - You are about to drop the column `tipo_funcionario` on the `Funcionario` table. All the data in the column will be lost.
  - Added the required column `id_tipo_funcionario` to the `Funcionario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Funcionario" DROP COLUMN "tipo_funcionario",
ADD COLUMN     "id_tipo_funcionario" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TipoFuncionario" (
    "id_tipo_funcionario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TipoFuncionario_pkey" PRIMARY KEY ("id_tipo_funcionario")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoFuncionario_nombre_key" ON "TipoFuncionario"("nombre");

-- AddForeignKey
ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_id_tipo_funcionario_fkey" FOREIGN KEY ("id_tipo_funcionario") REFERENCES "TipoFuncionario"("id_tipo_funcionario") ON DELETE RESTRICT ON UPDATE CASCADE;
