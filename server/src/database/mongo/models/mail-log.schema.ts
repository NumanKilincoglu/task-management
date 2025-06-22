import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class MailLog{
  @Prop({ required: true })
  recipient: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  sentAt: Date;

  @Prop({ required: false })
  taskId: number;

  @Prop({ required: true, enum: ['sent', 'failed'] })
  status: string;

  @Prop({ type: Object, required: false })
  error: Record<string, any>;
}

export const MailLogSchema = SchemaFactory.createForClass(MailLog);
