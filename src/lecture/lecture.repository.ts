import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Lecture, Prisma } from '@prisma/client';

@Injectable()
export class LectureRepository {
  constructor(private prisma: PrismaService) {}

  async create(createInput: CreateInput) {
    await this.prisma.$transaction([
      this.prisma.lecture.create({
        data: {
          id: createInput.id,
          title: createInput.title,
          channelName: createInput.channelName,
          publishedAt: createInput.publishedAt,
        },
      }),
      this.prisma.position.createMany({
        data: createInput.positions.map((position) => ({
          id: createInput.id,
          fen: position,
        })),
      }),
    ]);
    return;
  }

  async findOne(id: string) {
    return this.prisma.lecture.findUnique({ where: { id } });
  }

  async findManyByFen(fen: string) {
    return (await this.prisma.$queryRaw`
      select
        l.id,
        l.title,
        l."channelName",
        l."publishedAt"
      from "Lecture" l
      join "Position" p on l.id = p.id
      where p.fen = ${fen}
      order by l."publishedAt" desc
    `) as Lecture[];
  }

  async findManyByFenAndNames(fen: string, names: string[]) {
    return (await this.prisma.$queryRaw`
      select
        l.id,
        l.title,
        l."channelName",
        l."publishedAt"
      from "Lecture" l
      join "Position" p on l.id = p.id
      where p.fen = ${fen}
      and l."channelName" = any(${names})
      order by l."publishedAt" desc
    `) as Lecture[];
  }

  async createRequest(id: string) {
    try {
      await this.prisma.request.create({
        data: { id },
      });
      return;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return;
      }
      throw error;
    }
  }
}

export type CreateInput = {
  id: string;
  title: string;
  channelName: string;
  publishedAt: Date;
  positions: string[];
};
