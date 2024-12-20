import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { LectureService } from './lecture.service';
import { CheckDto, CreateLectureDto, GetLectureDto } from './dto/request';
import { LectureDto } from './dto/response';
import { JwtGuard } from 'src/common/guard';

@ApiTags('/lectures')
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 400, description: '유효성 검사 실패' })
@Controller('lectures')
export class LectureController {
  constructor(private lectureService: LectureService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '유튜브 링크 유효성 검사' })
  @ApiResponse({
    status: 200,
    description: '성공 - 따로 response body는 없습니다',
  })
  @ApiResponse({
    status: 409,
    description: '이미 등록된 강의',
  })
  @UseGuards(JwtGuard)
  @Post('check')
  @HttpCode(200)
  async check(@Body() { link }: CheckDto) {
    await this.lectureService.check(link);
    return;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '강의 추가' })
  @ApiResponse({
    status: 201,
    description: '성공',
  })
  @UseGuards(JwtGuard)
  @Post()
  async addLecture(@Body() lecture: CreateLectureDto) {
    await this.lectureService.addLecture(lecture);
    return;
  }

  @ApiOperation({ summary: '강의 목록 조회' })
  @ApiQuery({
    name: 'channelNames',
    type: String,
    required: false,
    description:
      '전체면 비워두시고 체스프릭김창훈 또는 체스프릭김창훈,슥슥이 이렇게 콤마로 구분',
  })
  @ApiQuery({ name: 'fen', type: String })
  @ApiResponse({
    status: 200,
    description: '성공 - 업로드 날짜 최신순 정렬',
    type: LectureDto,
    isArray: true,
  })
  @Get()
  async getLectures(
    @Query() { fen, channelNames }: GetLectureDto,
  ): Promise<LectureDto[]> {
    if (channelNames) {
      return this.lectureService.getLecturesByChannelNames(fen, channelNames);
    }
    return this.lectureService.getLectures(fen);
  }
}
