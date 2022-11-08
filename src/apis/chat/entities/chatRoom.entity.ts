import { Field, ObjectType } from '@nestjs/graphql';
import { CrewBoard } from 'src/apis/crewBoards/entities/crewBoard.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column(() => String)
  @Field(() => String)
  room: string;

  @ManyToOne(() => User)
  @Field(() => User)
  host: User;

  @ManyToOne(() => User)
  @Field(() => User)
  participant: User;

  @JoinColumn()
  @OneToOne(() => CrewBoard)
  @Field(() => CrewBoard)
  crewBoard: CrewBoard;
}
