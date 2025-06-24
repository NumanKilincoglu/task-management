import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { LogService } from './log.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { FilterLogDto } from './dto/filter-log.dto';

@Controller('logs')
@UseGuards(JwtGuard)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('/task')
  async getTaskLogs(@Query() filter: FilterLogDto) {
    return this.logService.findAllTaskLogs(filter);
  }

  @Get('/mail')
  async getMailLogs(@Query() filter: FilterLogDto) {
    return this.logService.findAllMailLogs(filter);
  }
}
