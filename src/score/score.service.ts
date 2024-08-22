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
    const getQuery = (boardSize: number) => {
      return this.prisma.$queryRaw`
      SELECT
        id,
        value,
        name,
        "boardSize",
        -- have to cast the rank to integer because by default it is a bigint
        CAST(RANK() OVER (ORDER BY value DESC) AS INTEGER) as rank
      FROM "Score"
      where "boardSize" = ${boardSize}
      ORDER BY value DESC
      LIMIT 10;
    `;
    };
    const [fourOnFour, sixOnSix] = await Promise.all([
      getQuery(4),
      getQuery(6),
    ]);

    return { four: fourOnFour, six: sixOnSix };
  }

  async getRank(id: number) {
    const score = await this.prisma.score.findUnique({ where: { id: id } });

    if (!score) {
      throw new Error(`Score with id ${id} not found`);
    }

    const { boardSize } = score;

    const rankQuery = await this.prisma.$queryRaw<
      { id: number; rank: number }[]
    >`
      SELECT id, CAST(RANK() OVER (ORDER BY value DESC) AS INTEGER) as rank
      FROM "Score"
      WHERE "boardSize" = ${boardSize}
      AND id = ${id}
      ORDER BY value DESC
    `;

    return { rank: rankQuery[0].rank };
  }
}
