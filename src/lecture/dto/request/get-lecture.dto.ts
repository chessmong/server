import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class GetLectureDto {
  @IsNotEmpty()
  @IsString()
  fen: string;

  @IsOptional()
  @IsString()
  channelNames: string;
}
