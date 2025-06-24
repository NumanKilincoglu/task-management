import { IsOptional } from 'class-validator';
import { BaseFilterDto } from '../../../common/dto/base-filter.dto';

export class FilterLogDto extends BaseFilterDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  action?: string;

  @IsOptional()
  status?: string;
}
