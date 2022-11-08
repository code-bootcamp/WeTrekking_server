import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReviewComment } from './entities/reviewComment.entity';
import { ReviewCommentService } from './reviewComment.service';

@Resolver()
export class ReviewCommentResolver {
  constructor(
    private readonly reviewCommentService: ReviewCommentService, //
  ) {}

  // 유저 나중에 추가

  @Query(() => [ReviewComment])
  fetchReviewComments(
    @Args('reviewBoardId') reviewBoardId: string, //
    @Args('page', { nullable: true, type: () => Int }) page: number,
  ) {
    return this.reviewCommentService.findAll({ reviewBoardId, page });
  }

  //   @Query(() => ReviewComment)
  //   fetchReviewComment() {
  //     //
  //   }

  @Mutation(() => ReviewComment)
  createReviewComment(
    @Args('reviewBoardId') reviewBoardId: string, //
    @Args('reviewComment') reviewComment: string,
  ) {
    return this.reviewCommentService.create({ reviewBoardId, reviewComment });
  }

  @Mutation(() => ReviewComment)
  updateReviewComment(
    @Args('reviewCommentId') reviewCommentId: string, //
    @Args('updateComment') updateComment: string,
  ) {
    return this.reviewCommentService.update({ reviewCommentId, updateComment });
  }

  @Mutation(() => Boolean)
  deleteReviewComment(
    @Args('reviewCommentId') reviewCommentId: string, //
  ) {
    return this.reviewCommentService.delete({ reviewCommentId });
  }
}
