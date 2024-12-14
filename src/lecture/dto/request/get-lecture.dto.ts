import { IsNotEmpty, IsString } from 'class-validator';

export class GetLectureDto {
  @IsNotEmpty()
  @IsString()
  fen: string;
}
