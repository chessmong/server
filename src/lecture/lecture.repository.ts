import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Lecture } from '@prisma/client';

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

  async findManyByFen(fen: string) {
    return (await this.prisma.$queryRaw`
      select
        l.link,
        l.title,
        l.image,
        l."channelName",
        l."publishedAt"
      from "Lecture" l
      join "Position" p on l.link = p.link
      where p.fen = ${fen}
      order by l."publishedAt" desc
    `) as Lecture[];
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
