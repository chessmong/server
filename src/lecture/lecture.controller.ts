import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LectureService } from './lecture.service';
import { CheckDto, CreateLectureDto } from './dto/request';
import { JwtGuard } from 'src/common/guard';

@ApiTags('/lectures')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 400, description: '유효성 검사 실패' })
@UseGuards(JwtGuard)
@Controller('lectures')
export class LectureController {
  constructor(private lectureService: LectureService) {}

  @ApiOperation({ summary: '유튜브 링크 유효성 검사' })
  @ApiResponse({
    status: 200,
    description: '성공 - 따로 response body는 없습니다',
  })
  @Post('check')
  @HttpCode(200)
  async check(@Body() { link }: CheckDto) {
    await this.lectureService.getLectureInfo(link);
    return;
  }

  @ApiOperation({ summary: '강의 추가' })
  @ApiResponse({
    status: 201,
    description: '성공',
  })
  @Post()
  async addLecture(@Body() lecture: CreateLectureDto) {
    await this.lectureService.addLecture(lecture);
    return;
  }
}
