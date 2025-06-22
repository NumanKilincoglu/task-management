export class TaskDto {
  id?: number;
  user_id?: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  end_date: string;
  file_path?: string;
  file_name?: string;
  attachment_type?: Date;
  is_completed: boolean;
  created_at: Date;
  updated_at: Date;
  attachment_url?: string;
}
