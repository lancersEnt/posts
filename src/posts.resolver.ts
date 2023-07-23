import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveReference,
  ResolveField,
  Parent,
  Context,
  Subscription,
} from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Prisma } from '@prisma/client';
import { Post, User } from './graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PubSub } from 'graphql-subscriptions';
import { log } from 'console';

const pubSub = new PubSub();

@Resolver('Post')
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}
  //* Queries
  @UseGuards(JwtAuthGuard)
  @Query('posts')
  findAll() {
    return this.postsService.findAll();
  }

  @Query('post')
  findOne(@Args('id') id: string) {
    return this.postsService.findOne({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Query('userPosts')
  findUserPosts(@Args('id') id: string) {
    return this.postsService.forUser(id);
  }

  //* Mutations
  @Mutation('createPost')
  @UseGuards(JwtAuthGuard)
  async create(
    @Args('createPostInput') createPostInput: Prisma.PostCreateInput,
    @Context() context: any,
  ) {
    const { req: request, res } = context;
    const userId: string = request.user.userId;
    createPostInput.authorId = userId;
    const created = await this.postsService.create(createPostInput);
    pubSub.publish('postCreated', { postCreated: { newPost: created } });
    return created;
  }

  @Mutation('updatePost')
  update(
    @Args('id') id: string,
    @Args('updatePostInput') updatePostInput: Prisma.PostUpdateInput,
  ) {
    return this.postsService.update({ id }, updatePostInput);
  }

  @Mutation('removePost')
  remove(@Args('id') id: string) {
    return this.postsService.remove({ id });
  }

  @Mutation('likePost')
  @UseGuards(JwtAuthGuard)
  async likePost(@Args('postId') postId: string, @Context() context: any) {
    const { req: request, res } = context;
    const userId: string = request.user.userId;
    const postLiked = await this.postsService.likePost(userId, postId);
    pubSub.publish('postLiked', { postLiked: { post: postLiked } });
    return true;
  }

  @Mutation('unlikePost')
  @UseGuards(JwtAuthGuard)
  async unlikePost(@Args('postId') postId: string, @Context() context: any) {
    const { req: request, res } = context;
    const userId: string = request.user.userId;
    const postLiked = await this.postsService.unlikePost(userId, postId);
    pubSub.publish('postUnliked', { postLiked: { post: postLiked } });
    return true;
  }

  //* Subscriptions
  @Subscription()
  postCreated() {
    return pubSub.asyncIterator('postCreated');
  }

  @Subscription()
  postLiked() {
    return pubSub.asyncIterator('postLiked');
  }

  @Subscription()
  postUnliked() {
    return pubSub.asyncIterator('postUnliked');
  }

  //* Fields resolvers
  @ResolveField(() => User)
  user(@Parent() post: Post) {
    return { __typename: 'User', id: post.authorId };
  }

  @ResolveField('likers', (returns) => [User])
  async likers(@Parent() post: Post): Promise<User[]> {
    const { likersIds } = post;
    const likers: User[] = [];
    for (const userId of likersIds) {
      const user = { __typename: 'User', id: userId };
      likers.push(user);
    }
    return likers;
  }

  @ResolveReference()
  resolveReference(reference: {
    __typename: string;
    id: string;
  }): Promise<Post> {
    const id = reference.id;
    return this.postsService.findOne({ id });
  }
}
