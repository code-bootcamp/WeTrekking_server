import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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
  @Field(() => String)
  date: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column({ default: false })
  @Field(() => String)
  addressDetail: string;

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

  // @ManyToOne(()=>User)
  // @Field(() => String)
  // userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
