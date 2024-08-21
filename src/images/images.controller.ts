import { Controller, Get } from '@nestjs/common';
import { images } from './constants';

@Controller('images')
export class ImagesController {
  @Get()
  findAll() {
    return images;
  }
}
