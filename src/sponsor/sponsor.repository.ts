import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SponsorRepository {
  constructor(private prisma: PrismaService) {}

  async getMany() {
    return this.prisma.sponsor.findMany({
      orderBy: {
        amount: 'desc',
      },
    });
  }
}
