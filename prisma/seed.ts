import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.post.deleteMany();
  await prisma.post.create({
    data: {
      content: 'salemou 3alaykom',
      authorId: 'fakroun',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    prisma.$disconnect;
  });
