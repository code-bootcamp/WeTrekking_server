import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewBoard } from '../reviewBoards/entities/reviewBoard.entity';
import { User } from '../users/entities/user.entity';
import { ReviewComment } from './entities/reviewComment.entity';
import { ReviewCommentResolver } from './reviewComment.resolver';
import { ReviewCommentService } from './reviewComment.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, ReviewBoard, ReviewComment])],
  providers: [
    ReviewCommentResolver, //
    ReviewCommentService,
  ],
})
export class ReviewCommentModule {}
