import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCrewCommentInput } from './createCrewComment.input';

@InputType()
export class UpdateCrewCommentInput extends PartialType(
  CreateCrewCommentInput,
) {}
