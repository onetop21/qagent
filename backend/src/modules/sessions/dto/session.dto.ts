import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsString()
  webServiceId: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  testCaseIds: string[];
}

export class SessionResponseDto {
  id: string;
  sessionId: string;
  startedAt: Date;
  completedAt: Date | null;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  expiresAt: Date;
  webServiceId: string;
}

export class TestResultResponseDto {
  id: string;
  status: 'success' | 'failed' | 'timeout' | 'skipped';
  failureReason: string | null;
  screenshotPath: string | null;
  executionTime: number;
  executedAt: Date;
  testCaseId: string;
}
