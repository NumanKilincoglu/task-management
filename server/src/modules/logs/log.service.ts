import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskLog } from 'src/database/mongo/models/task-log.schema';
import { MailLog } from '../../database/mongo/models/mail-log.schema';
import { CreateMailLogDto } from './dto/create-mail-log.dto';
import { CreateTaskLogDto } from './dto/create-task-log.dto';
import { FilterLogDto } from './dto/filter-log.dto';

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

  async findAllMailLogs(query: FilterLogDto) {
    const page = parseInt(query.page ?? '1');
    const limit = parseInt(query.limit ?? '10');
    const offset = (page - 1) * limit;
    const filter: any = {};

    if (query.search) filter.recipient = { $regex: query.search };
    if (query.status) filter.status = query.status;

    const total = await this.mailLogModel.countDocuments(filter);

    const logs = await this.mailLogModel
      .find(filter)
      .sort(query.orderBy)
      .skip(offset)
      .limit(limit)
      .exec();

    return {
      success: true,
      logs,
      meta: {
        page,
        total,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  async findAllTaskLogs(query: FilterLogDto) {
    const page = parseInt(query.page ?? '1');
    const limit = parseInt(query.limit ?? '10');
    const offset = (page - 1) * limit;
    const total = await this.taskLogModel.countDocuments();
    const filter: any = {};
    if (query.search) filter.action = { $regex: query.search };
    if (query.action) filter.action = query.action;
    const logs = await this.taskLogModel
      .find(filter)
      .sort(query.orderBy)
      .skip(offset)
      .limit(limit)
      .exec();

    return {
      success: true,
      logs,
      meta: {
        page,
        total,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    };
  }
}
