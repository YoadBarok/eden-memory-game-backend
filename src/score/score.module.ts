import { Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ScoreController],
  providers: [ScoreService, PrismaService],
})
export class ScoreModule {}
