import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [KafkaService, PrismaService],
  exports: [KafkaService],
})
export class KafkaModule {}
