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

  // 플라이그라운드 에서 안보이게
  @Column()
  password: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ unique: true })
  @Field(() => String)
  nickname: string;

  @Column()
  @Field(() => String)
  birth: string;

  @Column()
  @Field(() => String)
  phone: string;

  @Column()
  @Field(() => String)
  gender: string;

  // 유저 프로필 이미지 폴더 따로 만들어서 string이 아니라 input으로 가져올지 고민(필수X) 이미지 디폴트
  @Column({
    default:
      'wetrekking-storage/userProfile/04e5b38b-d44a-4863-a04d-82125bc90f75basic-profile.png',
  })
  @Field(() => String)
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
