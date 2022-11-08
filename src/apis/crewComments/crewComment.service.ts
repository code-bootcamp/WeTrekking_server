import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
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
    return await this.crewCommentRepository.find({
      where: {
        crewBoard: { id: boardId },
      },
      relations: ['crewBoard', 'user'],
      order: {
        createdAt: 'ASC',
      },
      take: 9,
      skip: page ? (page - 1) * 9 : 0,
    });
  }

  //   findOne({ userId, boardId }) {
  //     return this.crewCommentRepository.findOne();
  //   }

  async create({ createCrewCommentInput }) {
    const { comment, boardId } = createCrewCommentInput;

    // const findUser = await this.userRepository.findOne({
    //   where: { email: user },
    // });
    const findBoard = await this.crewBoardRepository.findOne({
      where: { id: boardId },
    });

    return await this.crewCommentRepository.save({
      comment,
      // user: { id: findUser.id },
      crewBoard: { id: findBoard.id },
    });
  }

  async update({ commentId, updateCrewCommentInput }) {
    const findComment = await this.crewCommentRepository.findOne({
      where: { id: commentId },
    });

    // const findUser = await this.userRepository.findOne({
    //   where: { email: user },
    // });

    return await this.crewCommentRepository.save({
      ...findComment,
      // user: findUser.id,
      ...updateCrewCommentInput,
    });
  }

  async delete({ commentId, context }) {
    // 오류 코드는 나중에
    const result = await this.crewCommentRepository.softDelete({
      id: commentId,
    });

    return result.affected ? true : false;
  }
  // 대댓글 조회
  async findSubAll({ page, boardId, commentId }) {
    return await this.crewCommentRepository.find({
      where: {
        crewBoard: {
          id: boardId,
        },
        subCrewComment: { id: commentId },
      },
      relations: ['crewBoard', 'user'],
      order: {
        comment: 'ASC',
      },
      take: 9,
      skip: page ? (page - 1) * 9 : 0,
    });
  }

  // 대댓글 생성
  async createSub({ createSubCrewCommentInput }) {
    const { comment, parentId } = createSubCrewCommentInput;

    const board = await this.crewCommentRepository.findOne({
      where: { id: parentId },
      relations: ['crewBoard', 'user'],
    });
    // console.log('a: ', board.crewBoard.id);

    return await this.crewCommentRepository.save({
      ...createSubCrewCommentInput,
      comment: comment,
      subCrewComment: parentId,
      crewBoard: { id: board.crewBoard.id },
    });
  }

  // 대댓글 수정
  async updateSub({ updateSubCrewCommentInput }) {
    const { comment, parentId } = updateSubCrewCommentInput;

    const findSubComment = await this.crewCommentRepository.findOne({
      where: { subCrewComment: { id: parentId } },
      relations: ['crewBoard', 'user'],
    });
    console.log(findSubComment);

    return await this.crewCommentRepository.save({
      ...findSubComment,
      comment: comment,
    });
  }

  // 대댓글 삭제

  async deleteSub({ commentId }) {
    const result = await this.crewCommentRepository.softDelete({
      subCrewComment: commentId,
    });

    return result.affected ? true : false;
  }
}
