import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('GET /lectures', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterEach(async () => {
    await prisma.lecture.deleteMany();
  });

  it('fen이 없으면 400에러를 반환한다', async () => {
    // when
    const { status } = await request(app.getHttpServer()).get('/lectures');

    // then
    expect(status).toBe(400);
  });

  it('유효하지 않은 fen을 보내면 200과 함께 빈 배열을 반환한다', async () => {
    // when
    const { status, body } = await request(app.getHttpServer()).get(
      '/lectures?fen=invalid',
    );

    // then
    expect(status).toBe(200);
    expect(body).toEqual([]);
  });

  it('200과 함께 강의 목록을 반환한다', async () => {
    // given
    await prisma.lecture.createMany({
      data: [
        {
          link: 'test1',
          title: 'test1',
          image: 'test1',
          channelName: 'test1',
          publishedAt: new Date(),
        },
        {
          link: 'test2',
          title: 'test2',
          image: 'test2',
          channelName: 'test2',
          publishedAt: new Date(),
        },
      ],
    });

    await prisma.position.createMany({
      data: [
        {
          link: 'test1',
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        },
        {
          link: 'test2',
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        },
      ],
    });

    // when
    const { status, body } = await request(app.getHttpServer()).get(
      '/lectures?fen=rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    );

    // then
    expect(status).toBe(200);
    expect(body).toEqual([
      {
        link: 'test1',
        title: 'test1',
        image: 'test1',
        channelName: 'test1',
        publishedAt: expect.any(String),
      },
      {
        link: 'test2',
        title: 'test2',
        image: 'test2',
        channelName: 'test2',
        publishedAt: expect.any(String),
      },
    ]);
  });
});
