import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TasksService } from './tasks.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { FileUploadService } from '../files/file-upload.service';
import { multerConfig } from 'src/common/configs/multer.config';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TasksController {
  constructor(
    private readonly taskService: TasksService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Get(':id')
  async getTask(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    return await this.taskService.getTaskById(Number(id), req.user.userId);
  }

  @Get()
  async getTasks(@Query() filter: FilterTaskDto, @Req() req: any) {
    return await this.taskService.findAll(filter, req.user.userId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('attachment', multerConfig))
  async createTask(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateTaskDto,
    @Req() req: any,
  ) {
    if (file) {
      Object.assign(body, this.fileUploadService.handleFileUpload(file));
    }

    return await this.taskService.create(body, req.user.userId);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('attachment', multerConfig))
  async updateTask(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
    @Req() req: any,
  ) {
    if (file) {
      Object.assign(body, this.fileUploadService.handleFileUpload(file));
    }

    return await this.taskService.update(Number(id), body, req.user.userId);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    return await this.taskService.remove(Number(id), req.user.userId);
  }
}
