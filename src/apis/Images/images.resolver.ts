import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FileService } from '../files/file.service';
import { Image } from './entities/Image.entity';
import { ImageService } from './images.service';

@Resolver()
export class ImageResolver {
  constructor(
    private readonly ImageService: ImageService, //
    private readonly filesService: FileService,
  ) {}

  @Query(() => [Image])
  fetchCrewBoardImages() {
    return this.ImageService.findAll();
  }

  @Query(() => Image)
  fetchBoardImage(
    @Args('ImageId') ImageId: string, //
  ) {
    return this.ImageService.findOne({ ImageId });
  }

  @Mutation(() => String)
  async uploadCrewBoaredImage(
    // @Args('crewBoardId') crewBoardId: string,
    @Args({ name: 'image', type: () => [GraphQLUpload] }) image: FileUpload[],
  ) {
    return await this.ImageService.create({ image });
  }

  // @Mutation((`) => [Image])
  // updateImage(
  //   @Args(' crewBoardId') crewBoardId: string, //
  //   @Args({ name: 'Images', type: () => [String] })
  //   Images: string[],
  // ) {
  //   return this.ImageService.updateImages({ crewBoardId, Images });
  // }
}
