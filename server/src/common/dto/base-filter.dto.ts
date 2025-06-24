import { IsOptional, IsNumberString } from 'class-validator';

export class BaseFilterDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  orderBy?: string;

  @IsOptional()
  orderDir?: string;
}
