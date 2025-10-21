import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SessionsCleanupService {
  private readonly logger = new Logger(SessionsCleanupService.name);
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Clean up expired sessions (30 days old)
   * Runs daily at 2 AM
   * FR-023, FR-024: 30-day data retention
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupExpiredSessions(): Promise<void> {
    this.logger.log('Starting cleanup of expired sessions...');

    const now = new Date();

    try {
      // Find expired sessions
      const expiredSessions = await this.prisma.testSession.findMany({
        where: {
          expiresAt: {
            lt: now,
          },
        },
        select: {
          id: true,
          sessionId: true,
        },
      });

      if (expiredSessions.length === 0) {
        this.logger.log('No expired sessions found');
        return;
      }

      this.logger.log(`Found ${expiredSessions.length} expired sessions`);

      // Delete expired sessions (cascade will delete related data)
      const result = await this.prisma.testSession.deleteMany({
        where: {
          expiresAt: {
            lt: now,
          },
        },
      });

      this.logger.log(`Deleted ${result.count} expired sessions`);

      // Log deleted session IDs
      expiredSessions.forEach((session) => {
        this.logger.log(`Cleaned up session: ${session.sessionId}`);
      });
    } catch (error) {
      this.logger.error(`Cleanup failed: ${error.message}`, error.stack);
    }
  }

  /**
   * Manual cleanup trigger (for testing)
   */
  async triggerCleanup(): Promise<number> {
    this.logger.log('Manual cleanup triggered');
    await this.cleanupExpiredSessions();

    const count = await this.prisma.testSession.count({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return count;
  }
}
