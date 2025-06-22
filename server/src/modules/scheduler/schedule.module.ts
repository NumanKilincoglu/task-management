import { Module } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './schedule.service';
import { LogService } from '../logs/log.service';
import { TasksModule } from '../tasks/tasks.module';
import { MongoModule } from 'src/database/mongo/mongo.module';
import { MailModule } from '../mails/mail.module';

@Module({
  imports: [ScheduleModule.forRoot(), TasksModule, MongoModule, MailModule],
  providers: [SchedulerService, TasksService, LogService],
})
export class SchedulerModule {}
