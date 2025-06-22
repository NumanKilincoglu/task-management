export interface CreateTaskLogDto {
    createdAt: Date;
    taskId: number;
    userId: number;
    action: 'created' | 'updated' | 'completed' | 'deleted';
    changes?: string
  }