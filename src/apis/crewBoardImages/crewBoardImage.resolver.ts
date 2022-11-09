import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CrewBoardImage } from './entities/crewBoardImage.entity';
import { CrewBoardImageService } from './crewBoardImage.service';

@Resolver()
export class CrewBoardImageResolver {
  constructor(
    private readonly crewBoardImageService: CrewBoardImageService, //
  ) {}

  @Query(() => [CrewBoardImage])
  fetchBoardImage(
    @Args('crewBoardId') crewBoardId: string, //
  ) {
    return this.crewBoardImageService.findByCrewBoardId({ crewBoardId });
  }

  @Query(() => [CrewBoardImage])
  fetchAllCrewBoardImages() {
    return this.crewBoardImageService.findAll();
  }

  @Mutation(() => [CrewBoardImage])
  async uploadCrewBoaredImage(
    @Args({ name: 'imgUrl', type: () => [String] }) imgUrl: string[],
    @Args('crewBoardId') crewBoardId: string,
  ) {
    this.crewBoardImageService.delete({ crewBoardId });
    for (let i = 0; i < imgUrl.length; i++) {
      await this.crewBoardImageService.upload({
        imgUrl: imgUrl[i],
        isMain: i === 0 ? true : false,
        crewBoardId: crewBoardId,
      });
    }
    return await this.crewBoardImageService.findByCrewBoardId({ crewBoardId });
  }
}
