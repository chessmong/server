import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}
