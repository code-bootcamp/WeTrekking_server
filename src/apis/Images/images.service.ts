import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Image } from './entities/Image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from '../files/file.service';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    protected readonly ImageRepository: Repository<Image>,

    private readonly fileService: FileService,
  ) {}

  async findOne({ ImageId }) {
    return await this.ImageRepository.findOne({
      where: { id: ImageId },
    });
  }

  async findAll() {
    return await this.ImageRepository.find({});
  }

  async create({ image }) {
    console.log(image);

    const url = await this.fileService.upload({
      file: image,
      type: 'crewBoard',
    });
    // const url = this.ImageRepository.save({ image });

    return url.toString();
  }
}

// async updateImages({ crewBoardId, Images }) {
//   this.ImagesRepository.delete({ crewBoardId });
//   const Img = [];
//   for (let i = 0; i < Images.length; i++) {
//     const result = await this.ImagesRepository.save({
//       Images: Images[i],
//       isMain: i === 0 ? true : false,
//       crewBoardId,
//     });
//     Img.push(result);
//   }
//   console.log(Img);

//   return Img;
// }
