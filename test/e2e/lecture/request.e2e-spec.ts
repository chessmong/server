import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('POST /lectures/upload-request', () => {
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
    await prisma.request.deleteMany();
  });

  it('url형식이 아니면 400 에러를 반환한다', async () => {
    // when
    const { status } = await request(app.getHttpServer())
      .post('/lectures/upload-request')
      .send({ link: 'invalid' });

    // then
    expect(status).toBe(400);
  });

  it('201을 반환하고 request를 생성한다', async () => {
    // when
    const { status } = await request(app.getHttpServer())
      .post('/lectures/upload-request')
      .send({ link: 'https://www.youtube.com/watch?v=test1' });

    // then
    expect(status).toBe(201);
    const lectureRequest = await prisma.request.findFirst();
    expect(lectureRequest!.id).toBe('test1');
  });

  it('이미 요청된 강의를 등록해도 201을 반환한다', async () => {
    // given
    await prisma.request.create({ data: { id: 'test1' } });

    // when
    const { status } = await request(app.getHttpServer())
      .post('/lectures/upload-request')
      .send({ link: 'https://www.youtube.com/watch?v=test1' });

    // then
    expect(status).toBe(201);
  });
});
