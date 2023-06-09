import { PrismaClient } from '@prisma/client';
import { log } from 'console';

const prisma = new PrismaClient();

async function main() {
  await prisma.post.deleteMany();
  const post = await prisma.post.create({
    data: {
      content: 'salemou 3alaykom',
      authorId: 'fakroun',
    },
  });

  console.log({ post });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    prisma.$disconnect;
  });
