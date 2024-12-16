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
    const parsedLink = this.parseLink(link);
    await this.getLectureInfo(parsedLink);
    const lecture = await this.lectureRepository.findOne(parsedLink);
    if (lecture) {
      throw new HttpException('이미 등록된 강의입니다.', 409);
    }
  }

  parseLink(link: string) {
    const parsedUrl = new URL(link);
    const videoId = parsedUrl.searchParams.get('v');
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  async getLectureInfo(link: string) {
    const apiUrl = 'https://www.googleapis.com/youtube/v3/videos';
    const apiKey = this.configService.get<string>('YOUTUBE_API_KEY');
    const parsedUrl = new URL(link);
    const videoId = parsedUrl.searchParams.get('v');
    const param = `?part=snippet` + `&id=${videoId}` + `&key=${apiKey}`;

    const response = await fetch(apiUrl + param);
    const data = (await response.json()) as YoutubeResponse;

    if (response.status !== 200 || data.items.length === 0) {
      throw new HttpException('유효하지 않은 링크입니다.', 400);
    }
    return data.items[0];
  }

  async addLecture(lecture: { link: string; positions: string[] }) {
    const youtubeItem = await this.getLectureInfo(lecture.link);

    const set = new Set<string>();
    for (const position of lecture.positions) {
      const [board, turn] = position.split(' ');
      set.add(`${board} ${turn}`);
    }

    await this.lectureRepository.create({
      link: this.parseLink(lecture.link),
      title: youtubeItem.snippet.title,
      image: youtubeItem.snippet.thumbnails.high.url,
      channelName: youtubeItem.snippet.channelTitle,
      publishedAt: youtubeItem.snippet.publishedAt,
      positions: Array.from(set),
    });
    return;
  }

  async getLectures(fen: string) {
    const [board, turn] = fen.split(' ');
    return this.lectureRepository.findManyByFen(`${board} ${turn}`);
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
