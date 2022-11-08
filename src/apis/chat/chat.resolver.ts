import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { ChatRoom } from './entities/chatRoom.entity';
import { Chatting } from './entities/chatting.entity';

@Resolver()
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  // @Query(() => [Chatting])
  // fetchChattings(
  //   @Args('roomId') roomId: string, //
  // ) {
  //   return this.chatService.findChatting();
  // }
}
