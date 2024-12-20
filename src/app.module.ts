import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { globalPipe } from './common/pipe/global.pipe';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { LectureModule } from './lecture/lecture.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
      global: true,
    }),
    AuthModule,
    LectureModule,
  ],
  providers: [globalPipe],
})
export class AppModule {}
