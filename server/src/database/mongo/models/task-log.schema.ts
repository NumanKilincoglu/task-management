import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class TaskLog {
  @Prop({ required: true })
  taskId: number;

  @Prop({ required: true })
  userId: number;

  @Prop({
    required: true,
    enum: ['created', 'updated', 'completed', 'deleted'],
  })
  action: string;

  @Prop({ required: false })
  changes: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const TaskLogSchema = SchemaFactory.createForClass(TaskLog);
