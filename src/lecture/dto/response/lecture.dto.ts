import { ApiProperty } from '@nestjs/swagger';

export class LectureDto {
  @ApiProperty({ example: 'https://www.youtube.com/watch?v=videoId' })
  link: string;
  @ApiProperty({ example: 'title' })
  title: string;
  @ApiProperty({ example: 'https://i.ytimg.com/vi/aja66pP69b0/hqdefault.jpg' })
  image: string;
  @ApiProperty({ example: '체스프릭김창훈' })
  channelName: string;
  @ApiProperty({ example: '2021-08-01T00:00:00.000Z' })
  publishedAt: Date;
}
