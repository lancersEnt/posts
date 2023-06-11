import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveReference,
} from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Prisma } from '@prisma/client';
import { Post } from './graphql';

@Resolver('Post')
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation('createPost')
  create(@Args('createPostInput') createPostInput: Prisma.PostCreateInput) {
    return this.postsService.create(createPostInput);
  }

  @Query('posts')
  findAll() {
    return this.postsService.findAll();
  }

  @Query('post')
  findOne(@Args('id') id: string) {
    return this.postsService.findOne({ id });
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

  @ResolveReference()
  resolveReference(reference: {
    __typename: string;
    id: string;
  }): Promise<Post> {
    const id = reference.id;
    return this.postsService.findOne({ id });
  }
}
