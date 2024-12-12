import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LectureService } from './lecture.service';
import { CheckDto } from './dto/request';

@ApiTags('/lectures')
@Controller('lectures')
export class LectureController {
  constructor(private lectureService: LectureService) {}

  @ApiOperation({ summary: '유튜브 링크 유효성 검사' })
  @ApiResponse({
    status: 200,
    description: '성공 - 따로 response body는 없습니다',
  })
  @ApiResponse({
    status: 400,
    description: '실패 - 유효하지 않은 링크입니다',
  })
  @Post('check')
  @HttpCode(200)
  async check(@Body() { link }: CheckDto) {
    await this.lectureService.check(link);
    return;
  }
}
