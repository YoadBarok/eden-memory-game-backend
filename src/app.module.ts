import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScoreModule } from './score/score.module';
import { ImagesModule } from './images/images.module';
import { ApiKeyMiddleware } from './api-key/api-key.middleware';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ScoreModule, ImagesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
