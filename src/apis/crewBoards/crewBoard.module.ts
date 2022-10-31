import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrewBoardResolver } from './crewBoard.resolver';
import { CrewBoardService } from './crewBoard.service';
import { CrewBoard } from './Entities/crewBoard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CrewBoard, //
    ]),
  ],
  providers: [
    CrewBoardResolver,
    CrewBoardService, //
  ],
})
export class CrewBoardModule {}
