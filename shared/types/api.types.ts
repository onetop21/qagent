// Shared TypeScript types for API contracts between frontend and backend

// PRD Types
export interface PrdDto {
  id: string;
  fileName: string;
  fileFormat: 'markdown' | 'pdf';
  uploadedAt: string;
  parsedText: string;
}

export interface CreatePrdDto {
  file: File;
}

// Test Case Types
export interface TestStepDto {
  id: string;
  stepNumber: number;
  action: string;
  expectedOutcome: string;
}

export interface TestCaseDto {
  id: string;
  testId: string;
  description: string;
  expectedResult: string;
  source: 'prd_auto' | 'ai_augmented' | 'user_manual' | 'imported';
  isEdgeCase: boolean;
  createdAt: string;
  updatedAt: string;
  testSteps: TestStepDto[];
}

export interface CreateTestCaseDto {
  testId: string;
  description: string;
  expectedResult: string;
  testSteps: Omit<TestStepDto, 'id'>[];
}

export interface UpdateTestCaseDto {
  description?: string;
  expectedResult?: string;
  testSteps?: Omit<TestStepDto, 'id'>[];
}

export interface AugmentTestCasesDto {
  prdId: string;
  type: 'additional' | 'edge_case';
}

// Web Service Types
export interface WebServiceDto {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWebServiceDto {
  name: string;
  url: string;
  loginUsername: string;
  loginPassword: string;
}

// Session Types
export interface TestSessionDto {
  id: string;
  sessionId: string;
  startedAt: string;
  completedAt: string | null;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  expiresAt: string;
  webService: WebServiceDto;
}

export interface CreateSessionDto {
  webServiceId: string;
  testCaseIds: string[];
}

export interface TestResultDto {
  id: string;
  status: 'success' | 'failed' | 'timeout' | 'skipped';
  failureReason: string | null;
  screenshotPath: string | null;
  executionTime: number;
  executedAt: string;
  testCase: TestCaseDto;
}

// Report Types
export interface FailedTestDetail {
  testId: string;
  description: string;
  reason: string;
  screenshotPath: string | null;
}

export interface QaReportDto {
  id: string;
  totalTests: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  failedTestDetails: FailedTestDetail[];
  generatedAt: string;
}

// WebSocket Events
export type SessionStatus = 'running' | 'completed' | 'failed' | 'cancelled';
export type TestStatus = 'success' | 'failed' | 'timeout' | 'skipped';

export interface SessionStartedEvent {
  sessionId: string;
  totalTests: number;
}

export interface TestStartedEvent {
  sessionId: string;
  testCaseId: string;
  testId: string;
  currentIndex: number;
  totalTests: number;
}

export interface TestStepStartedEvent {
  sessionId: string;
  testCaseId: string;
  stepNumber: number;
  action: string;
}

export interface TestStepCompletedEvent {
  sessionId: string;
  testCaseId: string;
  stepNumber: number;
  status: TestStatus;
  failureReason?: string;
}

export interface TestCompletedEvent {
  sessionId: string;
  testCaseId: string;
  status: TestStatus;
  executionTime: number;
  screenshotPath?: string;
}

export interface ProgressUpdateEvent {
  sessionId: string;
  completedTests: number;
  totalTests: number;
  percentage: number;
}

export interface SessionCompletedEvent {
  sessionId: string;
  totalTests: number;
  successCount: number;
  failureCount: number;
  successRate: number;
}

export interface ErrorEvent {
  sessionId: string;
  message: string;
  error: string;
}
