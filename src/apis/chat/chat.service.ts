import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrewBoard } from '../crewBoards/entities/crewBoard.entity';
import { ChatRoom } from './entities/chatRoom.entity';
import { Chatting } from './entities/chatting.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>, //
    @InjectRepository(Chatting)
    private readonly chattingRepository: Repository<Chatting>,
    // 중간 테이블 조회할거임
    @InjectRepository(CrewBoard)
    private readonly crewBoardRepository: Repository<CrewBoard>,
  ) {}

  // 찾기
  find({ crewBoardId }) {
    const result = this.chatRoomRepository.findOne({
      where: { crewBoard: { id: crewBoardId } },
      relations: {
        crewBoard: true,
        host: true,
        participant: true,
      },
    });
    return result;
  }

  findChatting({}) {
    const result = this.chattingRepository.find();
    return result;
  }

  // 만들기
  async create({ room, host, participant, crewBoard }) {
    const result = await this.chatRoomRepository.save({
      id: room,
      host: host,
      participant: participant,
      crewBoard: crewBoard,
    });
    return result;
  }
}
