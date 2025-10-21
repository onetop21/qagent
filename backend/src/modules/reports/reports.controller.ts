import { Controller, Get, Post, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { QaReportResponseDto } from './dto/report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * Generate report for session
   * POST /api/reports/:sessionId
   */
  @Post(':sessionId')
  async generateReport(
    @Param('sessionId') sessionId: string,
  ): Promise<QaReportResponseDto> {
    return this.reportsService.generateReport(sessionId);
  }

  /**
   * Get report by session ID
   * GET /api/reports/:sessionId
   */
  @Get(':sessionId')
  async getReport(@Param('sessionId') sessionId: string): Promise<QaReportResponseDto> {
    return this.reportsService.findBySessionId(sessionId);
  }

  /**
   * Get all reports
   * GET /api/reports
   */
  @Get()
  async getAllReports(): Promise<QaReportResponseDto[]> {
    return this.reportsService.findAll();
  }
}
