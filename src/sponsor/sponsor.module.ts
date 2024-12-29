import { Module } from '@nestjs/common';
import { SponsorController } from './sponsor.controller';
import { SponsorRepository } from './sponsor.repository';
import { SponsorService } from './sponsor.service';

@Module({
  controllers: [SponsorController],
  providers: [SponsorService, SponsorRepository],
})
export class SponsorModule {}
