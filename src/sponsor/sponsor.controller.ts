import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SponsorService } from './sponsor.service';
import { SponsorDto } from './dto/response';

@ApiTags('/sponsors')
@Controller('sponsors')
export class SponsorController {
  constructor(private sponsorService: SponsorService) {}

  @ApiOperation({ summary: '후원자 리스트' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: SponsorDto,
    isArray: true,
  })
  @Get()
  async getMany(): Promise<SponsorDto[]> {
    return this.sponsorService.getMany();
  }

  @ApiOperation({ summary: 'invocate error' })
  @Post('error')
  async error() {
    throw new Error('error');
  }
}
