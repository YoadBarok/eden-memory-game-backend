import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ScoreService } from './score.service';
import { Prisma } from '@prisma/client';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post()
  create(@Body() createScoreInput: Prisma.ScoreCreateInput) {
    return this.scoreService.create(createScoreInput);
  }

  @Get()
  findAll() {
    return this.scoreService.findAll();
  }

  @Get('top-ten')
  findTopTen() {
    return this.scoreService.findTopTen();
  }

  @Get(':id')
  getRank(@Param('id') id: string) {
    return this.scoreService.getRank(+id);
  }
}
