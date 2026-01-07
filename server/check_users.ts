import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany();
  console.log("Users count:", users.length);
  if (users.length > 0) {
    console.log("First user:", JSON.stringify(users[0], null, 2));
  }
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
