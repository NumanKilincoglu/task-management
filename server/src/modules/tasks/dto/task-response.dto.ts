import { TaskDto } from './task.dto';

export class TaskResponseDto {
  success: boolean;
  task?: TaskDto;
}
