import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskLog } from 'src/database/mongo/models/task-log.schema';
import { MailLog } from '../../database/mongo/models/mail-log.schema';
import { CreateMailLogDto } from './dto/create-mail-log.dto';
import { CreateTaskLogDto } from './dto/create-task-log.dto';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(TaskLog.name) private taskLogModel: Model<TaskLog>,
    @InjectModel(MailLog.name) private mailLogModel: Model<MailLog>,
  ) {}

  async logMailAction(data: CreateMailLogDto) {
    const newLog = new this.mailLogModel(data);
    return await newLog.save();
  }

  async logTaskAction(data: CreateTaskLogDto) {
    const newLog = new this.taskLogModel(data);
    return await newLog.save();
  }
}
