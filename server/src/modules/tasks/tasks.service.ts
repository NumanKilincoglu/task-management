import { Injectable, NotFoundException } from '@nestjs/common';
import { KnexService } from 'src/database/knex/knex.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { LogService } from '../logs/log.service';
import { MailService } from '../mails/mail.service';
import { TaskResponseDto } from './dto/task-response.dto';
import { TasksResponseDto } from './dto/tasks-response.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';

//cache timing
const secondsTenRedis = 10;
const secondsOneRedis = 1;

@Injectable()
export class TasksService {
  constructor(
    private readonly knexService: KnexService,
    private readonly logService: LogService,
    private readonly mailService: MailService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getTaskById(id: number, userId: number): Promise<TaskResponseDto> {
    const cacheKey = `task:${userId}:${id}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) return { success: true, task: JSON.parse(cached) };

    const knex = this.knexService.getKnex();

    const task = await knex('tasks')
      .select('*')
      .where({ id, user_id: userId })
      .first();

    if (!task) {
      throw new NotFoundException('Task not found or not authorized');
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    if (task.file_path) {
      task.attachment_url = `${baseUrl}/${task.file_path}`;
    }

    await this.redis.set(cacheKey, JSON.stringify(task), 'EX', secondsTenRedis);

    return { success: true, task: task };
  }

  async findAll(
    query: FilterTaskDto,
    userId: number,
  ): Promise<TasksResponseDto> {
    const cacheKey = `tasks:${userId}:${JSON.stringify(query)}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const knex = this.knexService.getKnex();
    const page = parseInt(query.page ?? '1');
    const limit = parseInt(query.limit ?? '10');
    const offset = (page - 1) * limit;

    let q = knex('tasks').where({ user_id: userId });

    if (query.searchQuery) {
      q = q.andWhereILike('title', query.searchQuery);
    }

    if (query.status) {
      const isCompleted = query.status === 'completed';
      q = q.andWhere('is_completed', isCompleted);
    }

    if (query.priority) {
      q = q.andWhere('priority', query.priority);
    }

    if (query.hasAttachment) {
      q = q.whereNotNull('file_path');
    }

    if (query.endDate) {
      q = q.andWhere('end_date', '<=', query.endDate);
    }

    if (query.orderBy) {
      const direction =
        query.orderDir?.toLowerCase() === 'desc' ? 'desc' : 'asc';
      q = q.orderBy(query.orderBy, direction);
    }

    const total = await q.clone().count({ count: '*' }).first();
    const tasks = await q.offset(offset).limit(limit).select('*');

    const result = {
      success: true,
      tasks: tasks,
      meta: {
        page,
        total: Number(total?.count || 0),
        totalPages: Math.ceil(Number(total?.count || 0) / limit),
        limit,
      },
    };

    await this.redis.set(
      cacheKey,
      JSON.stringify(result),
      'EX',
      secondsOneRedis,
    );
    return result;
  }

  async create(body: CreateTaskDto, userId: number): Promise<BaseResponseDto> {
    const knex = this.knexService.getKnex();
    const [id] = await knex('tasks').insert({
      ...body,
      user_id: userId,
    });

    await this.logService.logTaskAction({
      taskId: id,
      userId: userId,
      action: 'created',
      changes: 'Task created',
      createdAt: new Date(),
    });

    return { success: true, id };
  }

  async update(
    id: number,
    body: UpdateTaskDto,
    userId: number,
  ): Promise<BaseResponseDto> {
    const knex = this.knexService.getKnex();

    const affected = await knex('tasks')
      .where({ id, user_id: userId })
      .update({
        ...body,
        is_completed: body.is_completed == 'true',
      });

    if (!affected) {
      throw new NotFoundException('Task not found or not authorized');
    }

    const cacheKey = `task:${userId}:${id}`;
    await this.redis.del(cacheKey);

    await this.logService.logTaskAction({
      taskId: id,
      userId: userId,
      action: 'updated',
      changes: 'Task updated',
      createdAt: new Date(),
    });

    return { success: true, id: id };
  }

  async remove(id: number, userId: number): Promise<BaseResponseDto> {
    const knex = this.knexService.getKnex();

    const affected = await knex('tasks')
      .where({ id, user_id: userId })
      .delete();

    if (!affected) {
      throw new NotFoundException('Task not found or not authorized');
    }

    const cacheKey = `task:${userId}:${id}`;
    await this.redis.del(cacheKey);

    await this.logService.logTaskAction({
      taskId: id,
      userId: userId,
      action: 'deleted',
      changes: 'Task deleted',
      createdAt: new Date(),
    });

    return { success: true, id: id };
  }

  async sendReminderMails() {
    const knex = this.knexService.getKnex();
    const todayDate = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    const tasks = await knex('tasks')
      .where('is_completed', false)
      .whereBetween('end_date', [todayDate, tomorrowDate])
      .join('users', 'users.id', 'tasks.user_id')
      .select(
        'tasks.id as taskId',
        'tasks.title',
        'tasks.end_date',
        'users.email as userEmail',
      );

    for (const task of tasks) {
      const localDate = new Date(task.end_date).toLocaleDateString();
      const text = `Reminder Mail to ${task.userEmail} - Task Title: ${task.title}, Due Date: ${localDate}\n`;
      const subject = `Task "${task.title}" is due soon`;

      await this.mailService.sendMail({
        recipient: task.userEmail,
        subject,
        text,
      });

      await this.logService.logMailAction({
        recipient: task.userEmail,
        subject: `Reminder: Task "${task.title}" is due soon`,
        sentAt: new Date(),
        taskId: task.taskId,
        status: 'sent',
      });
    }

    return { success: true, sentCount: tasks.length };
  }
}
