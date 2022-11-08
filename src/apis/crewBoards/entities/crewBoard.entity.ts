import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  //   ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class CrewBoard {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  dateStandard: Date;

  @Column()
  @Field(() => String)
  date: string;

  @Column()
  @Field(() => String)
  dateTime: string;

  @Column()
  @Field(() => String)
  addressDetail: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column()
  @Field(() => String)
  gender: string;

  @Column()
  @Field(() => Int)
  dues: number;

  @Column()
  @Field(() => Int)
  peoples: number;

  //   @ManyToOne(()=>Mountain)
  //   @Field(() => String)
  //   mountainId: string;

  @ManyToOne(() => User)
  @Field(() => String)
  user: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // @JoinTable()
  // @ManyToMany(() => User, (users) => users.crewBoards)
  // users: CrewBoard[];
}
