import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function check() {
  const teams = await prisma.team.findMany();
  console.log("Teams count:", teams.length);
  console.log("Teams:", JSON.stringify(teams, null, 2));
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
