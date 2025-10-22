import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PlaywrightService } from './playwright.service';
import { WebServicesService } from '../webservices/webservices.service';
import { CreateSessionDto, SessionResponseDto } from './dto/session.dto';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);
  private readonly prisma: PrismaClient;
  private activeSessions: Map<string, boolean> = new Map();

  constructor(
    private readonly playwrightService: PlaywrightService,
    private readonly webServicesService: WebServicesService,
  ) {
    this.prisma = new PrismaClient();
  }

  /**
   * Create and start test session
   * FR-021: Enforce project-level session lock and global concurrent session limit
   */
  async create(dto: CreateSessionDto): Promise<SessionResponseDto> {
    // Check for active session in this project (project-level lock)
    const projectActiveSession = await this.prisma.testSession.findFirst({
      where: {
        projectId: dto.projectId,
        status: 'running',
      },
    });

    if (projectActiveSession) {
      throw new BadRequestException(
        `This project already has a running test session (${projectActiveSession.sessionId}). Please wait for it to complete or cancel it.`,
      );
    }

    // Check global concurrent session limit (max 3)
    const globalRunningSessions = await this.prisma.testSession.count({
      where: {
        status: 'running',
      },
    });

    if (globalRunningSessions >= 3) {
      throw new BadRequestException(
        'Maximum concurrent sessions (3) reached. Please wait for an existing session to complete or cancel one.',
      );
    }

    this.logger.log(`Creating new test session for project: ${dto.projectId}...`);

    // Generate session ID
    const sessionId = `SESSION-${Date.now()}`;

    // Calculate expiration date (30 days from now - FR-023)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create session
    const session = await this.prisma.testSession.create({
      data: {
        sessionId,
        status: 'running',
        expiresAt,
        projectId: dto.projectId,
        webServiceId: dto.webServiceId,
      },
    });

    this.logger.log(`Created test session: ${session.sessionId}`);

    // Start test execution in background
    this.executeTests(session.id, dto.webServiceId, dto.testCaseIds).catch(
      (error) => {
        this.logger.error(`Test execution failed: ${error.message}`, error.stack);
      },
    );

    return this.mapToResponseDto(session);
  }

  /**
   * Execute tests for a session
   */
  private async executeTests(
    sessionId: string,
    webServiceId: string,
    testCaseIds: string[],
  ): Promise<void> {
    this.logger.log(`Starting test execution for session: ${sessionId}`);
    this.activeSessions.set(sessionId, true);

    try {
      // Initialize browser
      await this.playwrightService.initBrowser();

      // Get web service credentials
      const credentials = await this.webServicesService.getCredentials(webServiceId);
      const webService = await this.webServicesService.findOne(webServiceId);

      // Login
      const loginSuccess = await this.playwrightService.login(
        webService.url,
        credentials.username,
        credentials.password,
      );

      if (!loginSuccess) {
        throw new Error('Login failed');
      }

      // Execute each test case
      for (const testCaseId of testCaseIds) {
        // Check if session was cancelled
        if (!this.activeSessions.get(sessionId)) {
          this.logger.log('Session cancelled, stopping execution');
          break;
        }

        await this.executeTestCase(sessionId, testCaseId);
      }

      // Mark session as completed
      await this.prisma.testSession.update({
        where: { id: sessionId },
        data: {
          status: 'completed',
          completedAt: new Date(),
        },
      });

      this.logger.log('Test execution completed');
    } catch (error) {
      this.logger.error(`Test execution error: ${error.message}`, error.stack);

      await this.prisma.testSession.update({
        where: { id: sessionId },
        data: {
          status: 'failed',
          completedAt: new Date(),
        },
      });
    } finally {
      await this.playwrightService.closeBrowser();
      this.activeSessions.delete(sessionId);
    }
  }

  /**
   * Execute single test case
   */
  private async executeTestCase(
    sessionId: string,
    testCaseId: string,
  ): Promise<void> {
    const startTime = Date.now();

    this.logger.log(`Executing test case: ${testCaseId}`);

    try {
      // Get test case with steps
      const testCase = await this.prisma.testCase.findUnique({
        where: { id: testCaseId },
        include: {
          testSteps: {
            orderBy: { stepNumber: 'asc' },
          },
        },
      });

      if (!testCase) {
        throw new Error(`Test case ${testCaseId} not found`);
      }

      // Execute steps
      let allStepsSuccess = true;
      let failureReason: string | null = null;

      for (const step of testCase.testSteps) {
        const stepResult = await this.playwrightService.executeStep({
          stepNumber: step.stepNumber,
          action: step.action,
          expectedOutcome: step.expectedOutcome,
        });

        if (stepResult.status !== 'success') {
          allStepsSuccess = false;
          failureReason = stepResult.failureReason || 'Step failed';
          break;
        }
      }

      const executionTime = Date.now() - startTime;

      // Capture screenshot if failed (FR-007)
      let screenshotPath: string | null = null;
      if (!allStepsSuccess) {
        const session = await this.prisma.testSession.findUnique({
          where: { id: sessionId },
        });
        screenshotPath = await this.playwrightService.captureScreenshot(
          session.sessionId,
          testCase.testId,
        );
      }

      // Save test result
      await this.prisma.testResult.create({
        data: {
          status: allStepsSuccess ? 'success' : 'failed',
          failureReason,
          screenshotPath,
          executionTime,
          testSessionId: sessionId,
          testCaseId,
        },
      });

      this.logger.log(
        `Test case ${testCase.testId} ${allStepsSuccess ? 'passed' : 'failed'}`,
      );
    } catch (error) {
      const executionTime = Date.now() - startTime;

      this.logger.error(`Test case execution error: ${error.message}`);

      // Save failed result
      await this.prisma.testResult.create({
        data: {
          status: 'failed',
          failureReason: error.message,
          executionTime,
          testSessionId: sessionId,
          testCaseId,
        },
      });
    }
  }

  /**
   * Get session by ID
   */
  async findOne(id: string): Promise<SessionResponseDto> {
    const session = await this.prisma.testSession.findUnique({
      where: { id },
    });

    if (!session) {
      throw new BadRequestException(`Session with ID ${id} not found`);
    }

    return this.mapToResponseDto(session);
  }

  /**
   * Get all sessions
   */
  async findAll(): Promise<SessionResponseDto[]> {
    const sessions = await this.prisma.testSession.findMany({
      orderBy: {
        startedAt: 'desc',
      },
    });

    return sessions.map(this.mapToResponseDto);
  }

  /**
   * Get active session for a project
   */
  async getActiveSession(projectId: string): Promise<SessionResponseDto | null> {
    const session = await this.prisma.testSession.findFirst({
      where: {
        projectId,
        status: 'running',
      },
    });

    if (!session) {
      return null;
    }

    return this.mapToResponseDto(session);
  }

  /**
   * Cancel running session (FR-014)
   */
  async cancel(id: string): Promise<void> {
    const session = await this.prisma.testSession.findUnique({
      where: { id },
    });

    if (!session) {
      throw new BadRequestException(`Session with ID ${id} not found`);
    }

    if (session.status !== 'running') {
      throw new BadRequestException('Session is not running');
    }

    // Mark for cancellation
    this.activeSessions.set(id, false);

    // Update status
    await this.prisma.testSession.update({
      where: { id },
      data: {
        status: 'cancelled',
        completedAt: new Date(),
      },
    });

    this.logger.log(`Session ${id} cancelled`);
  }

  /**
   * Map Prisma model to DTO
   */
  private mapToResponseDto(session: any): SessionResponseDto {
    return {
      id: session.id,
      sessionId: session.sessionId,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      status: session.status,
      expiresAt: session.expiresAt,
      webServiceId: session.webServiceId,
    };
  }
}
