import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { GraphQLISODateTime, GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
  ApolloDriver,
  ApolloDriverConfig,
} from '@nestjs/apollo';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersResolver } from './users.resolver';
import { AuthModule } from '../auth/auth.module';
import { KafkaService } from '../kafka/kafka.service';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [AuthModule, KafkaModule],
  providers: [PrismaService, PostsService, PostsResolver, UsersResolver],
  exports: [PostsService],
})
export class PostsModule {}
