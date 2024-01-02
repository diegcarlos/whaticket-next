import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

const prisma = new PrismaClient();

async function main() {
  await prisma.settings.upsert({
    where: { key: "userApiToken" },
    update: {},
    create: { key: "userApiToken", value: uuid() },
  });
  await prisma.users.createMany({
    data: [
      {
        name: "Administrador",
        email: "admin@admin.com",
        passwordHash:
          "$2a$08$WaEmpmFDD/XkDqorkpQ42eUZozOqRCPkPcTkmHHMyuTGUOkI8dHsq",
        profile: "admin",
        tokenVersion: 0,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
