import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { FileUploadModule } from '../files/file-upload.module';
import { LogModule } from '../logs/log.module';
import { MailModule } from '../mails/mail.module';

@Module({
  imports: [FileUploadModule, LogModule, MailModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
