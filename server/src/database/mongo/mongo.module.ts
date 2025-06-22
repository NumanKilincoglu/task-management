import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskLog, TaskLogSchema } from './models/task-log.schema';
import { MailLog, MailLogSchema } from './models/mail-log.schema';
import { MongoService } from './mongo.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(
          'MONGODB_URI',
          'mongodb://localhost:27017/project-logs',
        ),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: TaskLog.name, schema: TaskLogSchema },
      { name: MailLog.name, schema: MailLogSchema },
    ]),
  ],
  providers: [MongoService],
  exports: [MongoService, MongooseModule],
})
export class MongoModule {}
