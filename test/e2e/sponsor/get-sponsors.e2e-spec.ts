import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('GET /sponsors', () => {
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
    await prisma.sponsor.deleteMany();
  });

  it('sponsor가 없으면 200과 함께 빈 배열을 반환한다', async () => {
    // when
    const { status, body } = await request(app.getHttpServer()).get(
      '/sponsors',
    );

    // then
    expect(status).toBe(200);
    expect(body).toEqual([]);
  });

  it('200과 함께 sponsor 목록을 반환한다', async () => {
    // given
    await prisma.sponsor.createMany({
      data: [
        {
          name: 'test1',
          amount: 10000,
        },
        {
          name: 'test2',
          amount: 20000,
        },
        {
          name: 'test3',
          amount: 30000,
        },
      ],
    });

    // when
    const { status, body } = await request(app.getHttpServer()).get(
      '/sponsors',
    );

    // then
    expect(status).toBe(200);
    expect(body).toEqual([
      { name: 'test3', amount: 30000 },
      { name: 'test2', amount: 20000 },
      { name: 'test1', amount: 10000 },
    ]);
  });
});
