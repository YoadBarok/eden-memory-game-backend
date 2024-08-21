import { Injectable } from '@nestjs/common';
import { Prisma, Score } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ScoreService {
  constructor(private prisma: PrismaService) {}
  async create(createScoreInput: Prisma.ScoreCreateInput): Promise<Score> {
    return this.prisma.score.create({ data: createScoreInput });
  }

  async findAll() {
    return this.prisma.score.findMany();
  }

  async findTopTen() {
    return this.prisma.$queryRaw`
      SELECT
        id,
        value,
        name,
        -- have to cast the rank to integer because by default it is a bigint
        CAST(RANK() OVER (ORDER BY value DESC) AS INTEGER) as rank
      FROM "Score"
      ORDER BY value DESC
      LIMIT 10;
    `;
  }

  async findOne(id: number) {
    return this.prisma.score.findUnique({ where: { id: id } });
  }

  async update(id: number, updateScoreInput: Prisma.ScoreUpdateInput) {
    return this.prisma.score.update({
      where: { id: id },
      data: updateScoreInput,
    });
  }

  async remove(id: number) {
    return this.prisma.score.delete({ where: { id: id } });
  }
}
