export interface CreateMailLogDto {
  recipient: string;
  subject: string;
  taskId: number;
  status: 'sent' | 'failed';
  sentAt: Date;
  error?: Record<string, any>;
}
