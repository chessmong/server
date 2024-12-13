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

  afterAll(async () => {
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
        positions: ['test1', 'test2', 'test3'],
      });

    // then
    expect(status).toBe(201);
    const lecture = await prisma.lecture.findFirst();
    expect(lecture).toEqual({
      link: 'https://www.youtube.com/watch?v=FQaweORBKII',
      title:
        '함정이 너무 많다! 꼼수오프닝 끝판왕 "스태포드 갬빗 Stafford Gambit"',
      image: 'https://i.ytimg.com/vi/FQaweORBKII/hqdefault.jpg',
      channelName: '체스프릭김창훈',
      publishedAt: expect.any(Date),
    });

    const positions = await prisma.position.findMany();
    expect(positions).toEqual([
      { link: 'https://www.youtube.com/watch?v=FQaweORBKII', fen: 'test1' },
      { link: 'https://www.youtube.com/watch?v=FQaweORBKII', fen: 'test2' },
      { link: 'https://www.youtube.com/watch?v=FQaweORBKII', fen: 'test3' },
    ]);
  });
});
