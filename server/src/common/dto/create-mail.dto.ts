import { IsString } from 'class-validator';

export class CreateMailDto {
  @IsString()
  recipient: string;

  @IsString()
  subject: string;

  @IsString()
  text: string;
}