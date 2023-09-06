import { Module } from '@nestjs/common';
import { GraphQLISODateTime, GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
  ApolloDriver,
  ApolloDriverConfig,
} from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { KafkaModule } from './kafka/kafka.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      typePaths: ['./**/*.graphql'],
      resolvers: {
        DateTime: GraphQLISODateTime,
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      path: '/graphql',
      typePaths: ['./**/*.normal.graphql'],
      resolvers: {
        DateTime: GraphQLISODateTime,
      },
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
    }),
    AuthModule,
    PostsModule,
    KafkaModule,
    SearchModule,
  ],
  providers: [],
})
export class AppModule {}
