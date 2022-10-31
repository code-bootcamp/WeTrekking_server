import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CrewBoardService } from './crewBoard.service';
import { CreateCrewBoardInput } from './dto/createCrewBoard.input';
import { CrewBoard } from './Entities/crewBoard.entity';

@Resolver()
export class CrewBoardResolver {
  constructor(
    private readonly crewBoardService: CrewBoardService, //
  ) {}

  @Query(() => [CrewBoard])
  fetchCrewBoards() {
    return this.crewBoardService.findAll();
  }

  @Mutation(() => CrewBoard)
  createCrewBoard(
    @Args('createCrewBoardInput') createCrewBoardInput: CreateCrewBoardInput,
  ) {
    return this.crewBoardService.create({ createCrewBoardInput });
  }

  @Mutation(() => CrewBoard)
  updateCrewBoard({ crewBoardId, updateCrewBoardInput }) {
    return this.crewBoardService.update({ crewBoardId, updateCrewBoardInput });
  }
}
