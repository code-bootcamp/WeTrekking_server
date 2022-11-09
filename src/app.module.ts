import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CrewBoardModule } from './apis/crewBoards/crewBoard.module';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './apis/users/user.module';
import { AuthModule } from './apis/auth/auth.module';
import { PhoneModule } from './apis/phone/phone.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { FileModule } from './apis/files/file.module';
import { CrewBoardImageModule } from './apis/crewBoardImages/crewBoardImage.module';
import { ReviewBoardModule } from './apis/reviewBoards/reviewBoard.module';
import { CrewCommentModule } from './apis/crewComments/crewComment.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './apis/chat/chat.modeult';
import { ReviewCommentModule } from './apis/reviewComments/reviewComment.module';
import { PointPaymentModule } from './apis/pointsPayments/pointsPayments.module';
import { PickModule } from './apis/pick/pick.module';

@Module({
  imports: [
    PointPaymentModule,
    PickModule,
    AuthModule,
    CrewBoardModule,
    CrewBoardImageModule,
    CrewUserListModule,
    FileModule,
    PhoneModule,
    ReviewBoardModule,
    UserModule,
    CrewCommentModule,
    ChatModule,
    ReviewCommentModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graghql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: ['http://localhost:3000', 'https://develop.wetrekking/graphql'],
        credentials: true,
        exposedHeaders: ['Set-Cookie', 'Cookie'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: [
          'Access-Control-Allow-Headers',
          'Authorization',
          'X-Requested-With',
          'Content-Type',
          'Accept',
        ],
      },
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://my-redis:6379',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedToPology: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  // controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
