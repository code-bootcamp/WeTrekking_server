import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Repository } from 'typeorm';
import { CrewBoardService } from '../crewBoards/crewBoard.service';
import { CrewBoard } from '../crewBoards/entities/crewBoard.entity';
import { User } from '../users/entities/user.entity';
import { ChatService } from './chat.service';
import { ChatRoom } from './entities/chatRoom.entity';
import { Chatting } from './entities/chatting.entity';

// // 웹에서 데이터를 주고 받을 땐 HTTP를 사용함
// // 하지만 HTTP는 요청이 있어야만 응답을 보내주기 때문에 실시간이 안된다
// // 그래서 웹소켓이 필요하고 웹소켓 때문에 서버와 네트워크가 실시간으로 데이터를 주고 받을 수 있다.

// @WebSocketGateway({ namespace: 'chat' }) // namespace는 프론트에서 http://localhost:3000/chat 에서 'chat'에 해당하는 부분
// export class ChatGateway {
//   @WebSocketServer() // 이거는 socket.io의 io 역할
//   server: Server;

//   wsClients = [];

//   @SubscribeMessage('hihi')
//   connectSomeone(@MessageBody() data: string, @ConnectedSocket() client) {
//     const [name, room] = data;
//     console.log(`${name}님이 코드: ${room}방에 입장했습니다.`);
//     const comeOn = `${name}님이 입장했습니다.`;
//     this.server.emit('comeOn' + room, comeOn);
//     this.wsClients.push(client);
//   }

//   broadcast(event, client, message: any) {
//     for (const c of this.wsClients) {
//       if (client.id == c.id) {
//         continue;
//       }
//       c.emit(event, message);
//     }
//   }

//   @SubscribeMessage('send')
//   sendMessage(@MessageBody() data: string, @ConnectedSocket() client) {
//     const [room, name, message] = data;
//     console.log(`${client.id} : ${data}`);
//     this.broadcast(room, client, [name, message]);
//   }
// }

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: 'true',
    credentials: true,
  },
})
export class ChatGateway {
  constructor(
    // 일단 크루보드, 유저 저장소 만들어놓자
    @InjectRepository(CrewBoard)
    private readonly crewBoardRepository: Repository<CrewBoard>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,

    @InjectRepository(Chatting)
    private readonly chattingRepository: Repository<Chatting>,

    private readonly chatService: ChatService,

    private readonly crewBoardService: CrewBoardService,
  ) {}
  @WebSocketServer()
  server: Server;

  wsClients: [];

  @SubscribeMessage('chatting')
  async connetSomeone(
    @MessageBody() data: string,
    @ConnectedSocket() client: never,
  ) {
    const [name, crewBoardId, userId] = data;

    // 채팅방 찾기
    const findRoom = await this.chatService.find({ crewBoardId });

    // 방장 찾기 - 임시
    const bangjang = await this.userRepository.findOne({
      where: { name, id: userId },
    });

    // 참가자들 조회 - 임시
    const users = await this.userRepository.findOne({
      where: { name, id: userId },
    });

    // 크루보드 게시물 조회
    const crewlist = await this.crewBoardService.findOneById({
      crewBoardId,
    });

    let crewBoardChatRoom;

    // 게시물에 채팅창이 없으면 / 근데 게시물이 마감되면 그 후에 채팅창 생성인데 이렇게 해도 될지 고민임
    if (!findRoom) {
      crewBoardChatRoom = await this.chatService.create({
        room: crewBoardId,
        host: bangjang,
        participant: users,
        crewBoard: crewlist,
      });
    } else {
      crewBoardChatRoom = findRoom;
    }

    // 이름이 각각 맞는지에 대한건데 필요한건지는 의문
    if (findRoom.host.name !== name && findRoom.participant.name !== name)
      throw new Error('참여가 불가능합니다.');

    const welcome = `${name}님이 입장하셨습니다.`;

    // 방장이 맞다면
    if (findRoom.host.name === name) {
      const findHostChatting = await this.chattingRepository.find({
        relations: {
          room: true,
          user: true,
        },
        where: {
          room: { id: findRoom.id },
          user: { name: findRoom.host.name },
        },
      });
      // 방장의 채팅이 없으면
      if (findHostChatting.length === 0) {
        const result = await this.userRepository.findOne({
          where: { name: findRoom.host.name },
        });

        this.chattingRepository.save({
          chatting: welcome,
          room: findRoom,
          user: result,
        });

        // 프론트한테 메세지 보내기
        this.server.emit(crewBoardId, [welcome, name]);

        // 일단 never 오류 떠서 타입 never로 지정함
        // 클라이언트 푸시
        this.wsClients.push(client);

        console.log('client: ', client);
        console.log('wsClients: ', this.wsClients);

        return;
      }
    }

    // 참여자들
    if (findRoom.participant.name === name) {
      const findParticipantChatting = await this.chattingRepository.find({
        relations: {
          room: true,
          user: true,
        },
        where: {
          room: { id: findRoom.id },
          user: { name: findRoom.participant.name },
        },
      });

      if (findParticipantChatting.length === 0) {
        const result = await this.userRepository.findOne({
          where: { name: findRoom.participant.name },
        });

        this.chattingRepository.save({
          chatting: welcome,
          room: findRoom,
          user: result,
        });

        this.server.emit(crewBoardId, [welcome, name]);

        this.wsClients.push(client);

        return;
      }
    }
  }

  @SubscribeMessage('send')
  async sendChatting(
    @MessageBody() data: string, //
  ) {
    const [room, name, chatting, userId] = data;

    console.log(room);
    const crewBoardId = room.slice(5);

    // 크루 게시판의 채팅방 조회
    const findChattingRoom = await this.chatService.find({
      crewBoardId,
    });

    if (
      findChattingRoom.host.name !== name &&
      findChattingRoom.participant.name !== name
    )
      throw new Error('오류입니다.');

    const users = await this.userRepository.findOne({
      where: { name: name, id: userId },
    });

    const findRoom = await this.chatRoomRepository.findOne({
      where: { id: room },
      relations: {
        host: true,
        participant: true,
      },
    });

    await this.chattingRepository.save({
      chatting: chatting,
      room: findRoom,
      user: users,
    });

    this.server.emit(room, [name, chatting]);
  }
}
