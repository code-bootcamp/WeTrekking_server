import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrewBoardImage } from '../crewBoardImages/entities/crewBoardImage.entity';
import { CrewUserList } from '../crewUserList/entities/crewUserListList.entity';
// import { CrewUserList } from '../crewUserList/entities/crewUserListList.entity';
import { User } from '../users/entities/user.entity';
import { CrewBoard } from './entities/crewBoard.entity';

@Injectable()
export class CrewBoardService {
  constructor(
    @InjectRepository(CrewBoard)
    private readonly crewBoardRepository: Repository<CrewBoard>, //

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(CrewBoardImage)
    private readonly crewBoardImageRepository: Repository<CrewBoardImage>,

    @InjectRepository(CrewUserList)
    private readonly crewUserListRepository: Repository<CrewUserList>,

    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  findOneById({ crewBoardId }) {
    return this.crewBoardRepository.findOne({
      where: { id: crewBoardId },
      relations: ['user', 'mountain'],
    });
  }

  findAllByUserId({ userId }) {
    return this.crewBoardRepository.find({
      where: { user: { id: userId } },
    });
  }

  findAll() {
    return this.crewBoardRepository.find({
      relations: ['user', 'mountain'],
    });
  }

  findAllWithDeleted() {
    return this.crewBoardRepository.find({
      withDeleted: true,
      relations: ['user', 'mountain'],
    });
  }

  async findAllDivideNineForTest() {
    const crewBoard = await this.findAll();
    const newCrewBoard = [];

    this.divideNine(crewBoard, newCrewBoard);
    return newCrewBoard;
  }

  divideNine(array, newArray) {
    while (array.length > 0) {
      newArray.push(array.splice(0, 9));
    }
  }

  cutAlreadyDone(array, today, newArray) {
    array.map((x) =>
      Number(x.deadline) > Number(today) ? newArray.push(x) : x,
    );
  }

  changeDateTimeTo24h(dateTimeAMPM) {
    if (
      dateTimeAMPM.split(' ')[1] === 'pm' &&
      dateTimeAMPM.split(' ')[0].split(':')[0] === '12'
    ) {
      return dateTimeAMPM.split(' ')[0];
    }

    if (
      dateTimeAMPM.split(' ')[1] === 'am' &&
      dateTimeAMPM.split(' ')[0].split(':')[0] === '12'
    ) {
      const hour = Number(dateTimeAMPM.split(' ')[0].split(':')[0]) - 12;
      return `${hour}:${dateTimeAMPM.split(' ')[0].split(':')[1]}`;
    }
    const hour =
      dateTimeAMPM.split(' ')[1] === 'pm'
        ? Number(dateTimeAMPM.split(' ')[0].split(':')[0]) + 12
        : String(Number(dateTimeAMPM.split(' ')[0].split(':')[0])).padStart(
            2,
            '0',
          );
    return `${hour}:${dateTimeAMPM.split(' ')[0].split(':')[1]}`;
  }

  // changeDateTimeToAMPM(dateTime24h) {
  //   const AMPM = dateTime24h.split(':')[0] / 12 >= 1 ? 'pm' : 'am';
  //   return (
  //     `${String(Number(dateTime24h.split(':')[0]) % 12).padStart(2, '0')}:` +
  //     `${String(dateTime24h.split(':')[1]).padStart(2, '0')} ${AMPM}`
  //   );
  // }

  // findAppliedCrewUserList() {
  //   this.crewUserListRepository.find()
  // }

  // findAcceptedCrewUserList() {}

  async findAllLatestFirst() {
    const newCrewBoard = [];
    const cutAlreadyDone = [];
    const today = new Date();
    const crewBoard = await this.findAll();

    this.cutAlreadyDone(crewBoard, today, cutAlreadyDone);
    cutAlreadyDone.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
    this.divideNine(cutAlreadyDone, newCrewBoard);

    return newCrewBoard;
  }

  async findAllDeadlineFirst() {
    const newCrewBoard = [];
    const cutAlreadyDone = [];
    const today = new Date();
    const crewBoard = await this.findAll();

    this.cutAlreadyDone(crewBoard, today, cutAlreadyDone);

    cutAlreadyDone.sort((a, b) => Number(a.deadline) - Number(b.deadline));

    this.divideNine(cutAlreadyDone, newCrewBoard);

    return newCrewBoard;
  }

  async findBySearch({ region, startDate, endDate, search }) {
    // const newCrewBoard = [];
    // const cutAlreadyDone = [];
    // const pickedDate = [];
    let crewBoard;
    let newCrewBoard;
    const result = [];
    const today = new Date();

    if (search) {
      crewBoard = await this.elasticsearchService.search({
        index: 'myproduct_new',
        query: {
          match_phrase_prefix: {
            name: search,
          },
        },
      });
      console.log(JSON.stringify(crewBoard, null, ' '));
      newCrewBoard = crewBoard.hits.hits.map((el) => {
        return el._source;
      });

      if (!result[0]) {
        throw new Error(`검색어 [${search}]로 조회된 검색결과가 없습니다`);
      }
    } else {
      crewBoard = await this.findAll();
      newCrewBoard = [];
    }

    this.cutAlreadyDone(crewBoard, today, newCrewBoard);

    if (region) {
      newCrewBoard.filter((x) => x.mountain.address[0] === region);
      console.log(newCrewBoard);
    }

    if (startDate) {
      newCrewBoard.filter(
        (x) =>
          Date.parse(startDate) <= Date.parse(x.date) &&
          Date.parse(x.date) < Date.parse(endDate) + 86400000,
      );
      console.log(newCrewBoard);
    }

    this.divideNine(newCrewBoard, result);

    return result;

    // cutAlreadyDone.map((x) =>
    //   Date.parse(startDate) <= Date.parse(x.date) &&
    //   Date.parse(x.date) < Date.parse(endDate) + 86400000
    //     ? pickedDate.push(x)
    //     : x,
    // );
    // pickedDate.sort((a, b) => Number(a.deadline) - Number(b.deadline));
    // this.divideNine(pickedDate, newCrewBoard);
    // return newCrewBoard;
  }

  async create({ userId, mountainId, createCrewBoardInput }) {
    const { ...crewBoard } = createCrewBoardInput;
    const dateTime24h = this.changeDateTimeTo24h(crewBoard.dateTime);
    const deadline = crewBoard.date + ' ' + dateTime24h;

    const checkVaildCrewBoard = await this.findAllByUserId({ userId });
    if (checkVaildCrewBoard.length >= 3) {
      // throw new Error('게시글은 3개까지만 작성 가능합니다!!!!');
      console.log('게시글이 많지만 개발 중이기에 넘어가준다.');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (user.point < 500) {
      // throw new Error('포인트가 부족합니다!!!!!');
      console.log('포인트가 부족하지만 개발 중이기에 넘어가준다.');
    }

    await this.userRepository.update(
      { id: userId },
      // { point: user.point - 500 },
      { point: user.point }, // 개발중으로 아직 포인트 안뻇어감
    );

    const result = await this.crewBoardRepository.save({
      ...crewBoard,
      deadline: deadline,
      user: { id: userId },
      mountain: { id: mountainId },
    });

    const crewBoardId = result.id;
    await this.crewUserListRepository.save({
      user: userId,
      crewBoard: crewBoardId,
      status: '수락',
    });

    return result;
  }

  async createTEST({ createCrewBoardInput }) {
    const { ...crewBoard } = createCrewBoardInput;
    const dateTime24h = this.changeDateTimeTo24h(crewBoard.dateTime);
    const deadline = crewBoard.date + ' ' + dateTime24h;

    return await this.crewBoardRepository.save({
      ...crewBoard,
      deadline: deadline,
    });
  }

  async update({ crewBoardId, updateCrewBoardInput }) {
    const crewBoard = await this.findOneById({ crewBoardId });
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
    this.crewBoardImageRepository.delete({ crewBoard: crewBoardId });
    return result.affected ? true : false;
  }
}
