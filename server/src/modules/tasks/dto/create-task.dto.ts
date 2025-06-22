import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateTaskDto {
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
  @IsBoolean()
  is_completed?: boolean;
}
