import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePrdDto {
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @IsNotEmpty()
  @IsString()
  fileName: string;

  @IsNotEmpty()
  @IsString()
  fileFormat: 'markdown' | 'pdf';

  @IsNotEmpty()
  @IsString()
  parsedText: string;
}
