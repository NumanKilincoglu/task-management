import { Expose } from 'class-transformer';
import {
  IsBooleanString,
  IsDateString,
  IsIn,
  IsOptional,
} from 'class-validator';
import { BaseFilterDto } from 'src/common/dto/base-filter.dto';

export class FilterTaskDto extends BaseFilterDto {
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
}
