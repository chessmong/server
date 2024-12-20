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
    const id = this.parseId(link);
    await this.getLectureInfo(id);
    const lecture = await this.lectureRepository.findOne(id);
    if (lecture) {
      throw new HttpException('이미 등록된 강의입니다.', 409);
    }
  }

  parseId(link: string) {
    const parsedUrl = new URL(link);
    const id = parsedUrl.searchParams.get('v');
    if (!id) {
      throw new HttpException('유효하지 않은 링크입니다.', 400);
    }
    return id;
  }

  createLink(id: string) {
    return `https://www.youtube.com/watch?v=${id}`;
  }

  createThumbnail(id: string) {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  }

  async getLectureInfo(id: string) {
    const apiUrl = 'https://www.googleapis.com/youtube/v3/videos';
    const apiKey = this.configService.get<string>('YOUTUBE_API_KEY');
    const param = `?part=snippet` + `&id=${id}` + `&key=${apiKey}`;

    const response = await fetch(apiUrl + param);
    const data = (await response.json()) as YoutubeResponse;

    if (response.status !== 200 || data.items.length === 0) {
      throw new HttpException('유효하지 않은 링크입니다.', 400);
    }
    return data.items[0];
  }

  async addLecture(lecture: { link: string; positions: string[] }) {
    const id = this.parseId(lecture.link);
    const youtubeItem = await this.getLectureInfo(id);

    const set = new Set<string>();
    for (const position of lecture.positions) {
      const [board, turn] = position.split(' ');
      set.add(`${board} ${turn}`);
    }

    await this.lectureRepository.create({
      id: id,
      title: youtubeItem.snippet.title,
      channelName: youtubeItem.snippet.channelTitle,
      publishedAt: youtubeItem.snippet.publishedAt,
      positions: Array.from(set),
    });
    return;
  }

  async getLectures(fen: string) {
    const [board, turn] = fen.split(' ');
    const lectures = await this.lectureRepository.findManyByFen(
      `${board} ${turn}`,
    );
    return lectures.map((lecture) => {
      return {
        link: this.createLink(lecture.id),
        title: lecture.title,
        channelName: lecture.channelName,
        image: this.createThumbnail(lecture.id),
        publishedAt: lecture.publishedAt,
      };
    });
  }

  async getLecturesByChannelNames(fen: string, channelName: string) {
    const [board, turn] = fen.split(' ');
    const names = channelName.split(',');
    const lectures = await this.lectureRepository.findManyByFenAndNames(
      `${board} ${turn}`,
      names,
    );
    return lectures.map((lecture) => {
      return {
        link: this.createLink(lecture.id),
        title: lecture.title,
        channelName: lecture.channelName,
        image: this.createThumbnail(lecture.id),
        publishedAt: lecture.publishedAt,
      };
    });
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
