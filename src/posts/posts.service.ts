import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { KafkaService } from '../kafka/kafka.service';
import { Notification } from '../utils/interfaces/notification.interface';
import getSender from '../utils/getSender';
import capitalize from '../utils/capitalize';
import followingIds from 'src/utils/followingIds';
import { log } from 'console';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService, private kafka: KafkaService) {}

  async create(createPostInput: Prisma.PostCreateInput) {
    log(createPostInput.postId);
    if (createPostInput.postId !== undefined)
      await this.prisma.post.update({
        where: { id: createPostInput.postId },
        data: {
          shares: { increment: 1 },
        },
      });
    return this.prisma.post.create({
      data: createPostInput,
    });
  }

  findAll() {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(postWhereUniqueInput: Prisma.PostWhereUniqueInput) {
    try {
      if (postWhereUniqueInput.id !== null)
        return this.prisma.post.findUniqueOrThrow({
          where: postWhereUniqueInput,
        });
      else return null;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  update(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
    updatePostInput: Prisma.PostUpdateInput,
  ) {
    updatePostInput.updatedAt = new Date();
    return this.prisma.post.update({
      where: postWhereUniqueInput,
      data: updatePostInput,
    });
  }

  remove(postWhereUniqueInput: Prisma.PostWhereUniqueInput) {
    return this.prisma.post.delete({
      where: postWhereUniqueInput,
    });
  }

  async likePost(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    const likers = post.likersIds;
    if (!post) throw new Error('post not found');
    if (likers.includes(userId)) throw new Error('already liked');
    likers.push(userId);
    try {
      const liked = await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likersIds: likers,
        },
      });

      const sender = await getSender(userId);

      const PostLikedNotification: Notification = {
        payload: {
          title: `Post Liked - ${post.id}`,
          body: `${capitalize(sender.firstname)} ${capitalize(
            sender.lastname,
          )} a aimé votre publication`,
          createdBy: userId,
          targetUserId: post.authorId,
          action: `/publication/${post.id}`,
        },
      };
      this.kafka.produce(
        'notifications',
        JSON.stringify(PostLikedNotification),
      );
      return liked;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async unlikePost(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    let likers = post.likersIds;
    if (!post) throw new Error('post not found');
    if (!likers.includes(userId)) throw new Error('already not liked');
    likers = likers.filter((id) => {
      return id !== userId;
    });
    try {
      return await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likersIds: likers,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async feed(userId: string, page: number) {
    const ids: string[] = await followingIds(userId);
    const posts = await this.prisma.post.findMany({
      where: {
        authorId: { in: ids },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      skip: page * 5,
    });
    let count = await this.prisma.post.count({
      where: {
        authorId: { in: ids },
      },
    });

    count = Math.ceil(count / 5);

    return { posts, count };
  }

  forUser(authorId: string) {
    return this.prisma.post.findMany({
      where: {
        authorId: authorId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
