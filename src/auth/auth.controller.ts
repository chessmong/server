import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthenticateDto } from './dto/request';
import { JwtDto } from './dto/response';
import { JwtGuard } from 'src/common/guard';

@ApiTags('/auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '관리자 인증' })
  @ApiResponse({ status: 200, type: JwtDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('authenticate')
  @HttpCode(200)
  authenticate(@Body() { code }: AuthenticateDto): JwtDto {
    return this.authService.authenticate(code);
  }

  @ApiOperation({ summary: '토큰 검증t' })
  @ApiBearerAuth()
  @Get('test')
  @UseGuards(JwtGuard)
  test() {
    return 'success';
  }
}
