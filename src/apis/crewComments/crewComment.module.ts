import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrewBoard } from '../crewBoards/entities/crewBoard.entity';
import { User } from '../users/entities/user.entity';
import { CrewCommentResolver } from './crewComment.resolver';
import { CrewCommentService } from './crewComment.service';
import { CrewComment } from './entities/crewComment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, CrewBoard, CrewComment])],
  providers: [
    CrewCommentResolver, //
    CrewCommentService,
  ],
})
export class CrewCommentModule {}
