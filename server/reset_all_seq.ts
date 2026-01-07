import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function resetAllSequences() {
  const tables = [
    { name: 'User', idCol: 'userId' },
    { name: 'Team', idCol: 'id' },
    { name: 'Project', idCol: 'id' },
    { name: 'ProjectTeam', idCol: 'id' },
    { name: 'Task', idCol: 'id' },
    { name: 'Attachment', idCol: 'id' },
    { name: 'Comment', idCol: 'id' },
    { name: 'TaskAssignment', idCol: 'id' }
  ];

  for (const table of tables) {
    const result: any = await prisma.$queryRawUnsafe(`SELECT MAX("${table.idCol}") as max_id FROM "${table.name}"`);
    const maxId = Number(result[0].max_id) || 0;
    if (maxId > 0) {
      await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"${table.name}"', '${table.idCol}'), ${maxId})`);
      console.log(`Reset ${table.name} sequence to ${maxId}`);
    }
  }
}

resetAllSequences()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
