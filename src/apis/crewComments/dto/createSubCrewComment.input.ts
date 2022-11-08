import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSubCrewCommentInput {
  @Field(() => String)
  comment: string;

  @Field(() => String)
  parentId: string;
}
