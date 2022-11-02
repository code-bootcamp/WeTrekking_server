import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../files/file.service';

import { Image } from './entities/Image.entity';
import { ImageResolver } from './images.resolver';
import { ImageService } from './images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Image, //
    ]),
  ],

  providers: [
    ImageResolver, //
    ImageService,
    FileService,
  ],
})
export class ImageModule {}
