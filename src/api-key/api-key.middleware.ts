import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: any, res: any, next: () => void) {
    const originHeaderValue = req.header('origin');
    const apikeyHeaderValue = req.header('api-key');

    const apiKey = await this.prisma.apiKey.findUnique({
      where: {
        key: apikeyHeaderValue,
      },
    });
    if (
      !originHeaderValue ||
      !apikeyHeaderValue ||
      originHeaderValue !== process.env.FRONTEND_URL ||
      !apiKey
    ) {
      throw new HttpException('Unexpected error', HttpStatus.UNAUTHORIZED);
    }

    next();
  }
}
