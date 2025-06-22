import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class SchedulerService {
  constructor(private readonly taskService: TasksService) {}

  //Schedule ile her dakika kontrol edip mail gonderimini sagliyoruz
  //Gostermek icin 1 dakika olarak ayarladim
  @Cron(CronExpression.EVERY_MINUTE)
  handleReminderMails() {
    this.taskService.sendReminderMails();
  }
}
