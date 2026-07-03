import prisma from "./src/config/prisma.js";

try {
  const roles = await prisma.rol.findMany({
    select: { id_rol: true, nombre_rol: true },
  });
  console.log(JSON.stringify(roles, null, 2));
} finally {
  await prisma.$disconnect();
}
