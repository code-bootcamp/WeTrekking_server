import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CrewBoardModule } from './apis/crewBoards/crewBoard.module';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './apis/users/user.module';
import { AuthModule } from './apis/auth/auth.module';
import { ImageModule } from './apis/Images/image.module';
import { CrewCommentModule } from './apis/crewComments/crewComment.module';
import { ReviewCommentModule } from './apis/reviewComments/reviewComment.module';

@Module({
  imports: [
    CrewBoardModule,
    UserModule,
    AuthModule,
    ImageModule,
    CrewCommentModule,
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
  ],
  // controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
