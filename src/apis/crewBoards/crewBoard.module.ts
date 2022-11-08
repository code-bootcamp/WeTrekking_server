import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CrewBoardResolver } from './crewBoard.resolver';
import { CrewBoardService } from './crewBoard.service';
import { CrewBoard } from './entities/crewBoard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CrewBoard, //
      User,
    ]),
  ],
  providers: [
    CrewBoardResolver,
    CrewBoardService, //
  ],
})
export class CrewBoardModule {}
