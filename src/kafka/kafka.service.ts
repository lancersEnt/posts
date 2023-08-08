import { Injectable } from '@nestjs/common';
import { log } from 'console';
import { Kafka, logLevel } from 'kafkajs';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class KafkaService {
  private kafka;
  private producer;

  constructor(private readonly prisma: PrismaService) {
    this.kafka = new Kafka({
      clientId: 'MyKlad',
      brokers: ['localhost:9092'],
      logLevel: logLevel.ERROR,
    });

    this.producer = this.kafka.producer();
  }

  async subscribeToPost(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    const subscribers = post.subscribersIds;
    if (!post) throw new Error('post not found');
    if (subscribers.includes(userId)) return undefined;
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
    if (!subscribers.includes(userId)) return undefined;
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

  async produce(topic: string, message: string): Promise<void> {
    await this.producer.connect();
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
    await this.producer.disconnect();
  }

  async consume(topics: string[]): Promise<void> {
    const consumer = this.kafka.consumer({ groupId: 'post-subs' });

    await consumer.connect();
    await Promise.all(topics.map((topic) => consumer.subscribe({ topic })));

    await consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat }) => {
        const payload = JSON.parse(message.value.toString());
        if (payload.type === 'subscribe')
          this.subscribeToPost(payload.payload.id, payload.payload.postId);
        if (payload.type === 'unsubscribe')
          this.unsubscribeFromPost(payload.payload.id, payload.payload.postId);
      },
    });
  }
  async onModuleInit() {
    await this.consume(['posts_subs']);
  }
}
