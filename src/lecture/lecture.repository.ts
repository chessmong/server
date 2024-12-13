import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LectureRepository {
  constructor(private prisma: PrismaService) {}

  async create(createInput: CreateInput) {
    await this.prisma.$transaction([
      this.prisma.lecture.create({
        data: {
          link: createInput.link,
          title: createInput.title,
          image: createInput.image,
          channelName: createInput.channelName,
          publishedAt: createInput.publishedAt,
        },
      }),
      this.prisma.position.createMany({
        data: createInput.positions.map((position) => ({
          link: createInput.link,
          fen: position,
        })),
      }),
    ]);
    return;
  }

  async findOne(link: string) {
    return this.prisma.lecture.findUnique({ where: { link } });
  }
}

export type CreateInput = {
  link: string;
  title: string;
  image: string;
  channelName: string;
  publishedAt: Date;
  positions: string[];
};
