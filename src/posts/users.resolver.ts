import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Post } from '@prisma/client';
import { User } from '../graphql';
import { PostsService } from './posts.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly postsService: PostsService) {}

  @ResolveField()
  posts(@Parent() user: User): Promise<Post[]> {
    return this.postsService.forUser(user.id);
  }
}
