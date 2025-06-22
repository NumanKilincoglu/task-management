import { Expose } from 'class-transformer';
import {
  IsBooleanString,
  IsDateString,
  IsIn,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class FilterTaskDto {
  @IsOptional()
  @Expose({ name: 'searchQuery' })
  searchQuery?: string;

  @IsOptional()
  @IsIn(['completed', 'not_completed'])
  @Expose({ name: 'status' })
  status?: 'completed' | 'not_completed';

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  @Expose({ name: 'priority' })
  priority?: 'low' | 'medium' | 'high';

  @IsOptional()
  @IsDateString()
  @Expose({ name: 'end_date' })
  endDate?: string;

  @IsOptional()
  @IsBooleanString()
  @Expose({ name: 'hasAttachment' })
  hasAttachment?: string;

  @IsOptional()
  @Expose({ name: 'orderBy' })
  orderBy?: string;

  @IsOptional()
  @Expose({ name: 'orderDir' })
  orderDir?: string;

  @IsOptional()
  @IsNumberString()
  @Expose({ name: 'page' })
  page?: string;

  @IsOptional()
  @IsNumberString()
  @Expose({ name: 'limit' })
  limit?: string;
}
