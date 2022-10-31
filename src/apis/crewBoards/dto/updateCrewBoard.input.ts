import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCrewBoardInput } from './createCrewBoard.input';

@InputType()
export class UpdateCrewBoardInput extends PartialType(CreateCrewBoardInput) {}
