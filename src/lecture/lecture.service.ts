import { Injectable, HttpException } from '@nestjs/common';
import { LectureRepository } from './lecture.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LectureService {
  constructor(
    private lectureRepository: LectureRepository,
    private configService: ConfigService,
  ) {}

  async check(link: string) {
    const apiUrl = 'https://www.googleapis.com/youtube/v3/videos';
    const apiKey = this.configService.get<string>('YOUTUBE_API_KEY');
    const videoId = link.split('v=')[1];
    const param = `?part=snippet` + `&id=${videoId}` + `&key=${apiKey}`;

    const response = await fetch(apiUrl + param);
    const data = (await response.json()) as YoutubeResponse;

    if (response.status !== 200 || data.items.length === 0) {
      throw new HttpException('유효하지 않은 링크입니다.', 400);
    }
    return;
  }
}

export type YoutubeResponse = {
  kind: string;
  etag: string;
  items: YoutubeItem[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
};

export type YoutubeItem = {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: Thumbnail;
      medium: Thumbnail;
      high: Thumbnail;
      standard: Thumbnail;
      maxres: Thumbnail;
    };
    channelTitle: string;
    tags: string[];
    categoryId: string;
    liveBroadcastContent: string;
  };
};

export type Thumbnail = {
  url: string;
  width: number;
  height: number;
};
