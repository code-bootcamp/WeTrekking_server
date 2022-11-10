import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrewBoard } from '../crewBoards/entities/crewBoard.entity';
import { User } from '../users/entities/user.entity';
import { CrewComment } from './entities/crewComment.entity';

@Injectable()
export class CrewCommentService {
  constructor(
    @InjectRepository(CrewComment)
    private readonly crewCommentRepository: Repository<CrewComment>, //

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(CrewBoard)
    private readonly crewBoardRepository: Repository<CrewBoard>,
  ) {}

  async findAll({ page, boardId }) {
    // const result = await this.crewCommentRepository.find({
    //   where: {
    //     crewBoard: { id: boardId },
    //     subCrewComment: { id: null },
    //   },
    //   relations: ['crewBoard', 'user'],
    //   order: {
    //     createdAt: 'ASC',
    //   },
    //   take: 9,
    //   skip: page ? (page - 1) * 9 : 0,
    // });
    const result = await this.crewCommentRepository
      .createQueryBuilder('CrewComment')
      .leftJoinAndSelect('CrewComment.user', 'user')
      .leftJoinAndSelect('CrewComment.crewBoard', 'crewBoard')
      .where('CrewComment.crewBoard = :id', { id: boardId })
      .andWhere('CrewComment.subCrewCommentId IS NULL')
      .orderBy('CrewComment.createdAt', 'DESC')
      .take(9)
      .skip(page ? (page - 1) * 9 : 0)
      .getMany();

    console.log(result);
    return result;
  }

  async findUser({ userId, boardId }) {
    const result = await this.crewCommentRepository
      .createQueryBuilder('CrewComment')
      .leftJoinAndSelect('CrewComment.user', 'user')
      .leftJoinAndSelect('CrewComment.crewBoard', 'crewBoard')
      .where('CrewComment.crewBoard = :id', { id: boardId })
      .where('CrewComment.user = :id', { id: userId })
      .andWhere('CrewComment.subCrewCommentId IS NULL')
      .orderBy('CrewComment.createdAt', 'DESC')
      .getMany();

    return result;
  }

  async find({ commentId }) {
    const result = await this.crewCommentRepository.findOne({
      where: { id: commentId },
      relations: ['crewBoard', 'user'],
    });

    return result;
  }

  async create({ createCrewCommentInput, user }) {
    const { comment, boardId } = createCrewCommentInput;

    const findUser = await this.userRepository.findOne({
      where: { email: user },
    });

    const findBoard = await this.crewBoardRepository.findOne({
      where: { id: boardId },
    });

    return await this.crewCommentRepository.save({
      comment,
      user: { id: findUser.id },
      crewBoard: { id: findBoard.id },
    });
  }

  async update({ user, commentId, updateCrewCommentInput }) {
    const findComment = await this.crewCommentRepository.findOne({
      where: { id: commentId },
    });

    const findUser = await this.userRepository.findOne({
      where: { email: user },
    });

    if (user !== findUser.email)
      throw new ConflictException('아이디가 일치하지 않습니다.');

    return await this.crewCommentRepository.save({
      ...findComment,
      user: findUser.id,
      ...updateCrewCommentInput,
    });
  }

  async delete({ commentId, context }) {
    const user = context.req.user.email;
    const comment = await this.find({ commentId });
    const dbUser = comment.user.email;

    if (user !== dbUser) throw new ConflictException('아이디가 다릅니다');

    // await this.crewCommentRepository.removeAll;

    const result = await this.crewCommentRepository.softDelete({
      id: commentId,
    });

    return result.affected ? true : false;
  }
  // 대댓글 조회
  async findSubAll({ page, boardId }) {
    // return await this.crewCommentRepository.find({
    //   where: {
    //     crewBoard: {
    //       id: boardId,
    //     },
    //     subCrewComment: { id: commentId },
    //   },
    //   relations: ['crewBoard', 'user'],
    //   order: {
    //     comment: 'ASC',
    //   },
    //   take: 9,
    //   skip: page ? (page - 1) * 9 : 0,
    // });
    const result = await this.crewCommentRepository
      .createQueryBuilder('CrewComment')
      .leftJoinAndSelect('CrewComment.user', 'user')
      .leftJoinAndSelect('CrewComment.crewBoard', 'crewBoard')
      .where('CrewComment.crewBoard = :id', { id: boardId })
      .andWhere('CrewComment.subCrewCommentId IS NOT NULL')
      .orderBy('CrewComment.createdAt', 'DESC')
      .take(9)
      .skip(page ? (page - 1) * 9 : 0)
      .getMany();

    return result;
  }

  async findSubUser({ userId, boardId }) {
    const result = await this.crewCommentRepository
      .createQueryBuilder('CrewComment')
      .leftJoinAndSelect('CrewComment.user', 'user')
      .leftJoinAndSelect('CrewComment.crewBoard', 'crewBoard')
      .where('CrewComment.crewBoard = :id', { id: boardId })
      .where('CrewComment.user = :id', { id: userId })
      .andWhere('CrewComment.subCrewCommentId IS NOT NULL')
      .orderBy('CrewComment.createdAt', 'DESC')
      .getMany();

    return result;
  }

  // 대댓글 생성
  async createSub({ user, createSubCrewCommentInput }) {
    const { subComment, parentId } = createSubCrewCommentInput;

    const board = await this.crewCommentRepository.findOne({
      where: { id: parentId },
      relations: ['crewBoard', 'user'],
    });

    const findUser = await this.userRepository.findOne({
      where: { email: user },
    });

    return await this.crewCommentRepository.save({
      ...createSubCrewCommentInput,
      comment: subComment,
      subCrewComment: parentId,
      crewBoard: { id: board.crewBoard.id },
      user: { id: findUser.id },
    });
  }

  // 대댓글 수정
  async updateSub({ user, updateSubCrewCommentInput }) {
    const { subComment, parentId } = updateSubCrewCommentInput;

    const findSubComment = await this.crewCommentRepository.findOne({
      where: { subCrewComment: { id: parentId } },
      relations: ['crewBoard', 'user'],
    });
    console.log(findSubComment);

    const findUser = await this.userRepository.findOne({
      where: { email: user },
    });

    if (user !== findUser.email)
      throw new ConflictException('아이디가 일치하지 않습니다.');

    return await this.crewCommentRepository.save({
      ...findSubComment,
      comment: subComment,
      ...updateSubCrewCommentInput,
    });
  }

  // 대댓글 삭제

  async deleteSub({ commentId, context }) {
    const user = context.req.user.email;
    const comment = await this.crewCommentRepository.findOne({
      where: { subCrewComment: { id: commentId } },
      relations: ['crewBoard', 'user'],
    });

    if (user !== comment.user.email)
      throw new ConflictException('아이디가 다릅니다');

    const result = await this.crewCommentRepository.softDelete({
      subCrewComment: commentId,
    });

    return result.affected ? true : false;
  }

  // async removeSubAll({ commentId }) {
  //   const deleteSub = await this.crewCommentRepository.find({
  //     where: { subCrewComment: { id: commentId } },
  //     relations: ['crewBoard', 'user'],
  //   });
  // }
}
