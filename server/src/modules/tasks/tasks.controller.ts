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
  getTask(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.taskService.getTaskById(Number(id), user);
  }

  @Get()
  getTasks(@Query() filter: FilterTaskDto, @Req() req) {
    const user = req.user;
    return this.taskService.findAll(filter, user);
  }

  @Post()
  @UseInterceptors(FileInterceptor('attachment', multerConfig))
  async createTask(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateTaskDto,
    @Req() req,
  ) {
    const user = req.user;

    if (file) {
      const result = this.fileUploadService.handleFileUpload(file);
      body.file_path = result.relativePath ?? undefined;
      body.attachment_type = result.fileType ?? undefined;
      body.file_name = result.fileName ?? undefined;
    }

    return this.taskService.create(body, user);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('attachment', multerConfig))
  updateTask(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
    @Req() req,
  ) {
    const user = req.user;

    if (file) {
      const result = this.fileUploadService.handleFileUpload(file);
      body.file_path = result.relativePath ?? undefined;
      body.attachment_type = result.fileType ?? undefined;
      body.file_name = result.fileName ?? undefined;
    }

    return this.taskService.update(Number(id), body, user);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.taskService.remove(Number(id), user);
  }
}
