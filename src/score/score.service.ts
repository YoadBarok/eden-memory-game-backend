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
    const query = this.prisma.$queryRaw`
     SELECT
      id,
      value,
      name,
      "boardSize",
      ranking
    FROM
      (
        SELECT
          id,
          value,
          name,
          "boardSize",
          CAST(
            RANK() OVER (
              PARTITION BY "boardSize"
            ORDER BY
              value DESC
            ) AS INTEGER
          ) AS "ranking"
        FROM
          "Score"
      )rankQuery
    WHERE
      ranking <= 10
    ORDER BY
      "boardSize",
      "ranking";
    `;

    const results = (await query) as Score[];

    return results.reduce(
      (acc, curr) => {
        if (curr.boardSize === 4) {
          acc.four.push(curr);
        }
        if (curr.boardSize === 6) {
          acc.six.push(curr);
        }
        return acc;
      },
      { four: [], six: [] },
    );
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
      ORDER BY value DESC
    `;

    const rank = rankQuery.find((r) => r.id === score.id);

    return { rank: rank?.rank };
  }
}
