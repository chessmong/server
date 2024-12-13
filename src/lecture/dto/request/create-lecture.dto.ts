import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUrl, IsString, IsNotEmpty } from 'class-validator';

export class CreateLectureDto {
  @ApiProperty()
  @IsUrl()
  link: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  positions: string[];
}
