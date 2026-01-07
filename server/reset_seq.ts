import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function resetSequence() {
  const maxUser = await prisma.user.aggregate({ _max: { userId: true } });
  const maxId = maxUser._max.userId || 0;
  
  if (maxId > 0) {
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"User"', 'userId'), ${maxId})`);
    console.log(`Reset User sequence to ${maxId}`);
  }
}

resetSequence()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
