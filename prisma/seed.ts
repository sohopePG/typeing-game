// prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  await prisma.word.deleteMany();
  await prisma.word.createMany({
    data: [
      { japanese: 'りんご', romaji: 'ringo' },
      { japanese: 'ばなな', romaji: 'banana' },
    ]
  });
  console.log('✅ Seeding completed');
  await prisma.$disconnect();
}

seed();
