-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "rut" TEXT NOT NULL,
    "primer_nombre" TEXT NOT NULL,
    "segundo_nombre" TEXT NOT NULL,
    "primer_apellido" TEXT NOT NULL,
    "segundo_apellido" TEXT NOT NULL,
    "numero_telefonico" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Cuenta" (
    "id_cuenta" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Cuenta_pkey" PRIMARY KEY ("id_cuenta")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre_rol" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "Usuario_rol" (
    "id_usuario" INTEGER NOT NULL,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "Usuario_rol_pkey" PRIMARY KEY ("id_usuario","id_rol")
);

-- CreateTable
CREATE TABLE "Documento" (
    "id_documento" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "fecha_subida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("id_documento")
);

-- CreateTable
CREATE TABLE "Profesor" (
    "id_profesor" SERIAL NOT NULL,
    "especialidad" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Profesor_pkey" PRIMARY KEY ("id_profesor")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id_curso" SERIAL NOT NULL,
    "nivel_educativo" TEXT NOT NULL,
    "nivel_curso" TEXT NOT NULL,
    "letra" TEXT NOT NULL,
    "id_profesor" INTEGER NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id_curso")
);

-- CreateTable
CREATE TABLE "Estudiante" (
    "id_estudiante" SERIAL NOT NULL,
    "rut" TEXT NOT NULL,
    "edad" INTEGER NOT NULL,
    "primer_nombre" TEXT NOT NULL,
    "segundo_nombre" TEXT,
    "primer_apellido" TEXT NOT NULL,
    "segundo_apellido" TEXT,
    "sexo" TEXT NOT NULL,
    "ano_nacimiento" INTEGER NOT NULL,
    "mes_nacimiento" INTEGER NOT NULL,
    "dia_nacimiento" INTEGER NOT NULL,
    "fecha_ingreso" TIMESTAMP(3) NOT NULL,
    "id_curso" INTEGER NOT NULL,
    "id_tipo" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Estudiante_pkey" PRIMARY KEY ("id_estudiante")
);

-- CreateTable
CREATE TABLE "Tipo_estudiante" (
    "id_tipo" SERIAL NOT NULL,
    "nombre_tipo" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Tipo_estudiante_pkey" PRIMARY KEY ("id_tipo")
);

-- CreateTable
CREATE TABLE "Funcionario" (
    "id_funcionario" SERIAL NOT NULL,
    "tipo_funcionario" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id_funcionario")
);

-- CreateTable
CREATE TABLE "Tipo" (
    "id_tipo" SERIAL NOT NULL,
    "nombre_tipo" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Tipo_pkey" PRIMARY KEY ("id_tipo")
);

-- CreateTable
CREATE TABLE "Asignacion" (
    "id_asignacion" SERIAL NOT NULL,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_funcionario" INTEGER NOT NULL,
    "id_estudiante" INTEGER NOT NULL,

    CONSTRAINT "Asignacion_pkey" PRIMARY KEY ("id_asignacion")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cuenta_email_key" ON "Cuenta"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cuenta_id_usuario_key" ON "Cuenta"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Profesor_id_usuario_key" ON "Profesor"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_id_usuario_key" ON "Estudiante"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Tipo_estudiante_id_usuario_key" ON "Tipo_estudiante"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_id_usuario_key" ON "Funcionario"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Tipo_id_usuario_key" ON "Tipo"("id_usuario");

-- AddForeignKey
ALTER TABLE "Cuenta" ADD CONSTRAINT "Cuenta_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario_rol" ADD CONSTRAINT "Usuario_rol_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario_rol" ADD CONSTRAINT "Usuario_rol_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profesor" ADD CONSTRAINT "Profesor_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_id_profesor_fkey" FOREIGN KEY ("id_profesor") REFERENCES "Profesor"("id_profesor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "Curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_id_tipo_fkey" FOREIGN KEY ("id_tipo") REFERENCES "Tipo"("id_tipo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tipo_estudiante" ADD CONSTRAINT "Tipo_estudiante_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tipo" ADD CONSTRAINT "Tipo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_id_funcionario_fkey" FOREIGN KEY ("id_funcionario") REFERENCES "Funcionario"("id_funcionario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "Estudiante"("id_estudiante") ON DELETE RESTRICT ON UPDATE CASCADE;
