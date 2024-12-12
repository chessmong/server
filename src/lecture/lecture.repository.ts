import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LectureRepository {
  constructor(private prisma: PrismaService) {}
}
