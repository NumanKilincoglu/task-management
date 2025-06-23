import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { LogService } from './log.service';
import { JwtGuard } from '../../common/guards/jwt.guard';

@Controller('logs')
@UseGuards(JwtGuard)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('/task')
  async getTaskLogs(@Query() filter, @Req() req: any) {
    return this.logService.findAllTaskLogs(filter);
  }

  @Get('/mail')
  async getMailLogs(@Query() filter, @Req() req: any) {
    return this.logService.findAllMailLogs(filter);
  }
}
