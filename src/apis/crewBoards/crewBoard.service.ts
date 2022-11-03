import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrewBoard } from './entities/crewBoard.entity';

@Injectable()
export class CrewBoardService {
  constructor(
    @InjectRepository(CrewBoard)
    private readonly crewBoardRepository: Repository<CrewBoard>, //
  ) {}

  findOneById({ crewBoardId }) {
    return this.crewBoardRepository.findOne({
      where: { id: crewBoardId },
    });
  }

  async findAll() {
    const crewBoard = await this.crewBoardRepository.find();
    const newCrewBoard = [];
    console.log(crewBoard);
    while (crewBoard.length > 0) {
      newCrewBoard.push(crewBoard.splice(0, 9));
    }
    return newCrewBoard;
  }

  // async findByDate({ startDate, endDate }) {
  //   // startDate = startDate.split('-');
  //   // endDate = endDate.split('-');
  //   console.log(new Date(2022, 10, 10));
  //   const a = await this.crewBoardRepository.find({
  //     where: {
  //       // date: Between(
  //       //   new Date(
  //       //     Number(endDate[0]),
  //       //     Number(endDate[1] - 1),
  //       //     Number(endDate[2] + 1 ),
  //       //   ),
  //       //   new Date(
  //       //     Number(startDate[0]),
  //       //     Number(startDate[1] - 1),
  //       //     Number(startDate[2] + 1),
  //       //   ),
  //       // ),
  //       // date: new Date(2022, 11)
  //       date: '2022-11-09',
  //     },
  //   });
  //   // console.log(a);
  //   return a;
  // }

  findAllWithDelete() {
    return this.crewBoardRepository.find({
      withDeleted: true,
    });
  }

  create({ createCrewBoardInput }) {
    const { ...crewBoard } = createCrewBoardInput;
    return this.crewBoardRepository.save({ ...crewBoard });
  }

  async update({ crewBoardId, updateCrewBoardInput }) {
    const crewBoard = await this.crewBoardRepository.findOne({
      where: { id: crewBoardId },
    });
    return this.crewBoardRepository.save({
      ...crewBoard,
      id: crewBoardId,
      ...updateCrewBoardInput,
    });
  }

  async delete({ crewBoardId }) {
    const result = await this.crewBoardRepository.softDelete({
      id: crewBoardId,
    });
    return result.affected ? true : false;
  }
}
