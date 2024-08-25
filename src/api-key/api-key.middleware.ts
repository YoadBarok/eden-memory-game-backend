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
    const apikeyHeaderValue = req.header('api-key');
    if (!apikeyHeaderValue) {
      throw new HttpException('API Key is missing', HttpStatus.UNAUTHORIZED);
    }

    const apiKey = await this.prisma.apiKey.findUnique({
      where: {
        key: apikeyHeaderValue,
      },
    });

    if (!apiKey) {
      throw new HttpException('Invalid API Key', HttpStatus.UNAUTHORIZED);
    }

    next();
  }
}
