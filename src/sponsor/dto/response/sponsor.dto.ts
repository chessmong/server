import { ApiProperty } from '@nestjs/swagger';

export class SponsorDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  amount: number;
}
