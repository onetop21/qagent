import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { QaReportResponseDto } from './dto/report.dto';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Generate QA report for a test session
   * @param sessionId - Test session ID
   * @returns Generated report
   */
  async generateReport(sessionId: string): Promise<QaReportResponseDto> {
    this.logger.log(`Generating report for session: ${sessionId}`);

    // Get session
    const session = await this.prisma.testSession.findUnique({
      where: { id: sessionId },
      include: {
        testResults: {
          include: {
            testCase: true,
          },
        },
      },
    });

    if (!session) {
      throw new BadRequestException(`Session with ID ${sessionId} not found`);
    }

    if (session.status === 'running') {
      throw new BadRequestException('Cannot generate report for running session');
    }

    // Calculate statistics
    const totalTests = session.testResults.length;
    const successCount = session.testResults.filter(
      (r) => r.status === 'success',
    ).length;
    const failureCount = totalTests - successCount;
    const successRate = totalTests > 0 ? (successCount / totalTests) * 100 : 0;

    // Get failed test details
    const failedTestDetails = session.testResults
      .filter((r) => r.status !== 'success')
      .map((r) => ({
        testId: r.testCase.testId,
        description: r.testCase.description,
        reason: r.failureReason || 'Unknown failure',
        screenshotPath: r.screenshotPath,
      }));

    // Check if report already exists
    let report = await this.prisma.qaReport.findUnique({
      where: { testSessionId: sessionId },
    });

    if (report) {
      // Update existing report
      report = await this.prisma.qaReport.update({
        where: { id: report.id },
        data: {
          totalTests,
          successCount,
          failureCount,
          successRate,
          failedTestDetails: failedTestDetails as any,
        },
      });
    } else {
      // Create new report
      report = await this.prisma.qaReport.create({
        data: {
          totalTests,
          successCount,
          failureCount,
          successRate,
          failedTestDetails: failedTestDetails as any,
          testSessionId: sessionId,
        },
      });
    }

    this.logger.log(`Report generated: ${report.id}`);

    return {
      id: report.id,
      totalTests: report.totalTests,
      successCount: report.successCount,
      failureCount: report.failureCount,
      successRate: report.successRate,
      failedTestDetails: failedTestDetails,
      generatedAt: report.generatedAt,
      testSessionId: report.testSessionId,
    };
  }

  /**
   * Get report by session ID
   * @param sessionId - Test session ID
   * @returns Report
   */
  async findBySessionId(sessionId: string): Promise<QaReportResponseDto> {
    const report = await this.prisma.qaReport.findUnique({
      where: { testSessionId: sessionId },
    });

    if (!report) {
      // Generate report if not exists
      return this.generateReport(sessionId);
    }

    const failedTestDetails = Array.isArray(report.failedTestDetails)
      ? report.failedTestDetails
      : [];

    return {
      id: report.id,
      totalTests: report.totalTests,
      successCount: report.successCount,
      failureCount: report.failureCount,
      successRate: report.successRate,
      failedTestDetails: failedTestDetails as any,
      generatedAt: report.generatedAt,
      testSessionId: report.testSessionId,
    };
  }

  /**
   * Get all reports
   * @returns List of reports
   */
  async findAll(): Promise<QaReportResponseDto[]> {
    const reports = await this.prisma.qaReport.findMany({
      orderBy: {
        generatedAt: 'desc',
      },
    });

    return reports.map((report) => ({
      id: report.id,
      totalTests: report.totalTests,
      successCount: report.successCount,
      failureCount: report.failureCount,
      successRate: report.successRate,
      failedTestDetails: (report.failedTestDetails as any) || [],
      generatedAt: report.generatedAt,
      testSessionId: report.testSessionId,
    }));
  }
}
