export class FailedTestDetailDto {
  testId: string;
  description: string;
  reason: string;
  screenshotPath: string | null;
}

export class QaReportResponseDto {
  id: string;
  totalTests: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  failedTestDetails: FailedTestDetailDto[];
  generatedAt: Date;
  testSessionId: string;
}
