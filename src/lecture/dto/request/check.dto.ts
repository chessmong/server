import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class CheckDto {
  @ApiProperty({
    example: 'https://www.youtube.com/watch?v=12345678901',
    description: '유튜브 링크',
  })
  @IsUrl()
  link: string;
}
