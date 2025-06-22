import {
  IsString,
  IsIn,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsBooleanString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsIn(['low', 'medium', 'high'])
  priority: 'low' | 'medium' | 'high';

  @IsNotEmpty()
  @IsDateString()
  end_date: string;

  @IsOptional()
  @IsString()
  attachment?: string;

  @IsOptional()
  @IsString()
  attachment_type?: string;

  @IsOptional()
  @IsString()
  file_path?: string;

  @IsOptional()
  @IsString()
  file_name?: string;

  @IsOptional()
  @IsString()
  attachment_path?: string;

  @IsOptional()
  @IsBooleanString()
  is_completed?: string;
}
