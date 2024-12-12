import { Injectable, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  authenticate(code: string) {
    if (code !== this.configService.get('CODE')) {
      throw new HttpException('Unauthorized', 401);
    }

    return {
      accessToken: this.jwtService.sign({}),
    };
  }
}
