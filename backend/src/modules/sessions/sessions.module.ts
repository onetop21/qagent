import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { PlaywrightService } from './playwright.service';
import { SessionsCleanupService } from './sessions.cleanup.service';
import { WebServicesModule } from '../webservices/webservices.module';

@Module({
  imports: [WebServicesModule],
  controllers: [SessionsController],
  providers: [SessionsService, PlaywrightService, SessionsCleanupService],
  exports: [SessionsService],
})
export class SessionsModule {}
