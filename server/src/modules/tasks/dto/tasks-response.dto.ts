import { TaskDto } from './task.dto';

export interface TasksResponseDto {
  success: boolean;
  tasks?: TaskDto[];
  meta?: object;
}
