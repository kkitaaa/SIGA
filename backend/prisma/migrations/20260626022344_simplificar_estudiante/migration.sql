/*
  Warnings:

  - You are about to drop the column `ano_nacimiento` on the `Estudiante` table. All the data in the column will be lost.
  - You are about to drop the column `dia_nacimiento` on the `Estudiante` table. All the data in the column will be lost.
  - You are about to drop the column `edad` on the `Estudiante` table. All the data in the column will be lost.
  - You are about to drop the column `id_tipo` on the `Estudiante` table. All the data in the column will be lost.
  - You are about to drop the column `id_usuario` on the `Estudiante` table. All the data in the column will be lost.
  - You are about to drop the column `mes_nacimiento` on the `Estudiante` table. All the data in the column will be lost.
  - You are about to drop the `Tipo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tipo_estudiante` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fecha_nacimiento` to the `Estudiante` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Estudiante" DROP CONSTRAINT "Estudiante_id_tipo_fkey";

-- DropForeignKey
ALTER TABLE "Estudiante" DROP CONSTRAINT "Estudiante_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Tipo" DROP CONSTRAINT "Tipo_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Tipo_estudiante" DROP CONSTRAINT "Tipo_estudiante_id_usuario_fkey";

-- DropIndex
DROP INDEX "Estudiante_id_usuario_key";

-- AlterTable
ALTER TABLE "Estudiante" DROP COLUMN "ano_nacimiento",
DROP COLUMN "dia_nacimiento",
DROP COLUMN "edad",
DROP COLUMN "id_tipo",
DROP COLUMN "id_usuario",
DROP COLUMN "mes_nacimiento",
ADD COLUMN     "es_nee" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fecha_nacimiento" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Tipo";

-- DropTable
DROP TABLE "Tipo_estudiante";
