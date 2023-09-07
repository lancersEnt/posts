import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { UsersResolver } from './users.resolver';
import { AuthModule } from '../auth/auth.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { PrismaService } from 'prisma/prisma.service';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [AuthModule, KafkaModule, SearchModule],
  providers: [PrismaService, PostsService, PostsResolver, UsersResolver],
  exports: [PostsService],
})
export class PostsModule {}
