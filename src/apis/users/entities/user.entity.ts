import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  password: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field(() => String)
  nickname: string;

  @Column({ nullable: true })
  @Field(() => String)
  phone: string;

  @Column({ nullable: true })
  @Field(() => String)
  gender: string;

  // 유저 프로필 이미지 폴더 따로 만들어서 string이 아니라 input으로 가져올지 고민(필수X) 이미지 디폴트
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  profile_img: string;

  // 1,000 point
  @Column({ default: 1000 })
  @Field(() => Int)
  point: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
