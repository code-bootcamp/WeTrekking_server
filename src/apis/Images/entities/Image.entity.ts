import { Field, ObjectType } from '@nestjs/graphql';
import { CrewBoard } from 'src/apis/crewBoards/entities/crewBoard.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  url: string;

  @Column()
  @Field(() => Boolean)
  isMain: boolean;

  @Column()
  // @ManyToOne(() => ReviewBoard)
  @Field(() => String)
  reviewBoardId: string;

  @ManyToOne(() => CrewBoard)
  @Field(() => CrewBoard)
  crewBoardId: CrewBoard;
}
