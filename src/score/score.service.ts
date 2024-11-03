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
      "rank"
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
          ) AS "rank"
        FROM
          "Score"
      )rankQuery
    WHERE
      "rank" <= 10
    ORDER BY
      "boardSize",
      "rank";
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

  async getRank(boardSize: number, value: number) {
    const rankQuery = await this.prisma.$queryRaw<
      { value: number; rank: number }[]
    >`
      SELECT id, value, CAST(RANK() OVER (ORDER BY value DESC) AS INTEGER) as rank
      FROM "Score"
      WHERE "boardSize" = ${boardSize} AND value >= ${value}
      ORDER BY value DESC
    `;

    const rank = rankQuery.find((r) => r.rank && r.value === value);

    return { rank: rank?.rank || rankQuery.length + 1 };
  }
}
