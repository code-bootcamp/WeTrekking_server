import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCrewBoardInput {
  @Field(() => String)
  title: string;

  @Field(() => Date)
  date: string;

  @Field(() => String)
  location: string;

  @Field(() => Int)
  dues: number;

  @Field(() => String)
  detail: string;

  @Field(() => String)
  gender: string;

  @Field(() => Int)
  peoples: number;
}
