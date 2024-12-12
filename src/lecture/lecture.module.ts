import { Module } from '@nestjs/common';
import { LectureController } from './lecture.controller';
import { LectureRepository } from './lecture.repository';
import { LectureService } from './lecture.service';

@Module({
  controllers: [LectureController],
  providers: [LectureService, LectureRepository],
})
export class LectureModule {}
