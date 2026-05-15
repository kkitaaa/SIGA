import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import asignacionRoutes from "./routes/asignacion.routes.js";
import { swaggerUi, swaggerSpec } from "./docs/swagger.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/", asignacionRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("SIGA backend corriendo correctamente");
});

app.listen(3000, () => {
  console.log("Servidor en puerto 3000");
});