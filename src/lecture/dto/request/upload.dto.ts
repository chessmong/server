import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class UploadDto {
  @ApiProperty()
  @IsUrl()
  link: string;
}
