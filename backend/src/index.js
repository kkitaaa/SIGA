import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import asignacionRoutes from "./routes/asignacion.routes.js";
import asignacionPieRoutes from "./routes/asignacion-pie.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import documentoRoutes from "./routes/documento.routes.js";
import cursoRoutes from "./routes/curso.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

import { swaggerUi, swaggerSpec } from "./docs/swagger.js";
import estudianteRoutes from "./routes/estudiante.routes.js";
import tipoFuncionarioRoutes from "./routes/tipo-funcionario.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/**
 * ROUTES API
 */
app.use("/api/auth", authRoutes);
app.use("/api/asignacion", asignacionRoutes);
app.use("/api/asignacion-pie", asignacionPieRoutes);
app.use("/api/usuario", usuarioRoutes);
app.use("/api/documento", documentoRoutes);
app.use("/api/documentos", documentoRoutes);
app.use("/api/estudiantes", estudianteRoutes);
app.use("/api/cursos", cursoRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/tipos-funcionarios", tipoFuncionarioRoutes);
/**
 * SWAGGER
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * HEALTH CHECK
 */
app.get("/", (req, res) => {
  res.send("SIGA backend corriendo correctamente");
});

app.listen(3000, () => {
  console.log("Servidor en puerto 3000");
});
