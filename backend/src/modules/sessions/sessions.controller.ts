import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto, SessionResponseDto } from './dto/session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  /**
   * Create and start test session
   * POST /api/sessions
   */
  @Post()
  async create(@Body() dto: CreateSessionDto): Promise<SessionResponseDto> {
    return this.sessionsService.create(dto);
  }

  /**
   * Get all sessions
   * GET /api/sessions
   */
  @Get()
  async findAll(): Promise<SessionResponseDto[]> {
    return this.sessionsService.findAll();
  }

  /**
   * Get active session for a project
   * GET /api/sessions/active?projectId=xxx
   */
  @Get('active')
  async getActiveSession(
    @Query('projectId') projectId: string,
  ): Promise<SessionResponseDto | null> {
    return this.sessionsService.getActiveSession(projectId);
  }

  /**
   * Get session by ID
   * GET /api/sessions/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SessionResponseDto> {
    return this.sessionsService.findOne(id);
  }

  /**
   * Cancel running session
   * DELETE /api/sessions/:id
   */
  @Delete(':id')
  async cancel(@Param('id') id: string): Promise<{ message: string }> {
    await this.sessionsService.cancel(id);
    return { message: 'Session cancelled successfully' };
  }
}
