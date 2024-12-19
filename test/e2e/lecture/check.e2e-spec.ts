import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('POST /lectures/check', () => {
  let app: INestApplication;
  let accessToken: string;
  let prisma: PrismaService;

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
      .post('/lectures/check')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ link: 'invalid' });

    // then
    expect(status).toBe(400);
  });

  it('유효한 링크를 보내면 200을 반환한다', async () => {
    // when
    const { status } = await request(app.getHttpServer())
      .post('/lectures/check')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ link: 'https://www.youtube.com/watch?v=aja66pP69b0' });

    // then
    expect(status).toBe(200);
  });

  it('링크는 유효하되 유튜브 링크가 아니어도 400을 반환한다', async () => {
    // when
    const { status } = await request(app.getHttpServer())
      .post('/lectures/check')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ link: 'https://www.google.com' });

    // then
    expect(status).toBe(400);
  });

  it('이미 등록된 강의라면 409를 반환한다', async () => {
    // given
    await prisma.lecture.create({
      data: {
        id: 'aja66pP69b0',
        title: 'test',
        channelName: 'test',
        publishedAt: new Date(),
      },
    });

    // when
    const { status } = await request(app.getHttpServer())
      .post('/lectures/check')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ link: 'https://www.youtube.com/watch?v=aja66pP69b0' });

    // then
    expect(status).toBe(409);
  });
});
