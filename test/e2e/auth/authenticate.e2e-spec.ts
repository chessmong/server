import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('POST /auth/authenticate', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('인증코드와 맞지 않으면 401 에러를 반환한다', async () => {
    // when
    const { status } = await request(app.getHttpServer())
      .post('/auth/authenticate')
      .send({ code: 'invalid' });

    // then
    expect(status).toBe(401);
  });

  it('인증코드와 맞으면 200과 함께 accessToken을 반환한다', async () => {
    // when
    const { status, body } = await request(app.getHttpServer())
      .post('/auth/authenticate')
      .send({ code: 'test' });

    // then
    expect(status).toBe(200);
    expect(body.accessToken).toBeDefined();
  });
});
