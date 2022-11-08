import { InputType, PartialType } from '@nestjs/graphql';
import { CreateSubCrewCommentInput } from './createSubCrewComment.input';

@InputType()
export class UpdateSubCrewCommentInput extends PartialType(
  CreateSubCrewCommentInput,
) {}
