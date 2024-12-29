import { Injectable } from '@nestjs/common';
import { SponsorRepository } from './sponsor.repository';

@Injectable()
export class SponsorService {
  constructor(private sponsorRepository: SponsorRepository) {}

  async getMany() {
    return this.sponsorRepository.getMany();
  }
}
