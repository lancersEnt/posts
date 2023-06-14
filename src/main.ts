import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { PostsModule } from './posts.module';

async function bootstrap() {
  const app = await NestFactory.create(PostsModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(9119);
}
bootstrap();
