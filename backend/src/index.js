import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import asignacionRoutes from "./routes/asignacion.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";

import { swaggerUi, swaggerSpec } from "./docs/swagger.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/**
 * ROUTES API
 */
app.use("/api/auth", authRoutes);
app.use("/api/asignacion", asignacionRoutes);
app.use("/api/usuario", usuarioRoutes);

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
