import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('POST /lectures/check', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/authenticate')
      .send({ code: 'test' });

    accessToken = body.accessToken;
  });

  afterEach(async () => {
    await prisma.lecture.deleteMany();
  });

  it('유효하지 않은 링크를 보내면 400 에러를 반환한다', async () => {
    // when
    const { status } = await request(app.getHttpServer())
      .post('/lectures')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ link: 'invalid' });

    // then
    expect(status).toBe(400);
  });

  it('201과 함께 강의를 추가한다', async () => {
    // when
    const { status } = await request(app.getHttpServer())
      .post('/lectures')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        link: 'https://www.youtube.com/watch?v=FQaweORBKII&list=LL&index=9&t=177s',
        positions: [
          'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
          'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
          'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
        ],
      });

    // then
    expect(status).toBe(201);
    const lecture = await prisma.lecture.findFirst();
    expect(lecture).toEqual({
      id: 'FQaweORBKII',
      title:
        '함정이 너무 많다! 꼼수오프닝 끝판왕 "스태포드 갬빗 Stafford Gambit"',
      channelName: '체스프릭김창훈',
      publishedAt: expect.any(Date),
    });

    const positions = await prisma.position.findMany();
    expect(positions).toEqual([
      {
        id: 'FQaweORBKII',
        fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b',
      },
      {
        id: 'FQaweORBKII',
        fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w',
      },
      {
        id: 'FQaweORBKII',
        fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b',
      },
    ]);
  });
});
