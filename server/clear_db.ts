import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function clear() {
  await prisma.taskAssignment.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.attachment.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.projectTeam.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.team.deleteMany({});
  console.log("All data cleared");
}

clear()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
