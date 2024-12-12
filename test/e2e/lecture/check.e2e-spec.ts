import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('POST /lectures/check', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('유효하지 않은 링크를 보내면 400 에러를 반환한다', async () => {
    // when
    const { status } = await request(app.getHttpServer())
      .post('/lectures/check')
      .send({ link: 'invalid' });

    // then
    expect(status).toBe(400);
  });

  it('유효한 링크를 보내면 200을 반환한다', async () => {
    // when
    const { status } = await request(app.getHttpServer())
      .post('/lectures/check')
      .send({ link: 'https://www.youtube.com/watch?v=aja66pP69b0' });

    // then
    expect(status).toBe(200);
  });

  it('링크는 유효하되 유튜브 링크가 아니어도 400을 반환한다', async () => {
    // when
    const { status } = await request(app.getHttpServer())
      .post('/lectures/check')
      .send({ link: 'https://www.google.com' });

    // then
    expect(status).toBe(400);
  });
});
