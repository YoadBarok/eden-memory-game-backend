import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
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
  findOne(@Param('id') id: string) {
    return this.scoreService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScoreInput: Prisma.ScoreUpdateInput,
  ) {
    return this.scoreService.update(+id, updateScoreInput);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scoreService.remove(+id);
  }
}
