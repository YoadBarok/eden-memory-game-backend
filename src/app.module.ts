import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScoreModule } from './score/score.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [ScoreModule, ImagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
