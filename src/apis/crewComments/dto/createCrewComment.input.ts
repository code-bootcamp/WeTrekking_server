import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCrewCommentInput {
  @Field(() => String)
  comment: string;

  @Field(() => String)
  boardId: string;
}
