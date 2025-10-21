export class PrdResponseDto {
  id: string;
  fileName: string;
  fileFormat: string;
  uploadedAt: Date;
  parsedText: string;
  testCasesGenerated?: number;
}
