import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { KafkaService } from './kafka/kafka.service';
import { Notification } from './utils/interfaces/notification.interface';
import getSender from './utils/getSender';
import capitalize from './utils/capitalize';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService, private kafka: KafkaService) {}

  async create(createPostInput: Prisma.PostCreateInput) {
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
      return this.prisma.post.findUniqueOrThrow({
        where: postWhereUniqueInput,
      });
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

  async subscribeToPost(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    const subscribers = post.subscribersIds;
    if (!post) throw new Error('post not found');
    if (subscribers.includes(userId)) throw new Error('already subscribed');
    subscribers.push(userId);
    try {
      return this.prisma.post.update({
        where: { id: postId },
        data: {
          subscribersIds: subscribers,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async unsubscribeFromPost(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    let subscribers = post.subscribersIds;
    if (!post) throw new Error('post not found');
    if (!subscribers.includes(userId)) throw new Error('already unsubscribed');
    subscribers = subscribers.filter((id) => {
      return id !== userId;
    });
    try {
      return this.prisma.post.update({
        where: { id: postId },
        data: {
          subscribersIds: subscribers,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  forUser(authorId: string) {
    return this.prisma.post.findMany({
      where: {
        authorId: authorId,
      },
    });
  }
}
