import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import asignacionRoutes from "./routes/asignacion.routes.js";
import asignacionPieRoutes from "./routes/asignacion-pie.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import documentoRoutes from "./routes/documento.routes.js";
import cursoRoutes from "./routes/curso.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import { authMiddleware } from "./middleware/auth.js";
import { listarUsuariosSinRolController } from "./controllers/usuario.controller.js";
import { swaggerUi, swaggerSpec } from "./docs/swagger.js";
import estudianteRoutes from "./routes/estudiante.routes.js";
import FuncionarioRoutes from "./routes/funcionario.routes.js";
import tipoFuncionarioRoutes from "./routes/tipo-funcionario.routes.js";

dotenv.config();

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/asignacion", asignacionRoutes);
app.use("/api/asignacion-pie", asignacionPieRoutes);
app.use("/api/usuario", usuarioRoutes);
app.get("/api/usuarios-sin-rol", authMiddleware, listarUsuariosSinRolController);
app.use("/api/documentos", documentoRoutes);
app.use("/api/estudiantes", estudianteRoutes);
app.use("/api/cursos", cursoRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/funcionarios", FuncionarioRoutes);
app.use("/api/tipos-funcionarios", tipoFuncionarioRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("SIGA backend corriendo correctamente");
});

export default app;
