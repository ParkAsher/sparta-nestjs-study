import { IsNumber, IsString } from 'class-validator';

export class createArticleDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @IsNumber()
  readonly password: number;
}
