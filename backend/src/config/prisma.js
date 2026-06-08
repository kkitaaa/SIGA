import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// Configura la conexión usando tu variable de entorno
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Crea el adaptador para PostgreSQL
const adapter = new PrismaPg(pool);

// Pasa el adaptador al cliente de Prisma
const prisma = new PrismaClient({ adapter });

export default prisma;
