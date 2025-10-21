import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrdModule } from './modules/prd/prd.module';
import { TestCasesModule } from './modules/testcases/testcases.module';
import { WebServicesModule } from './modules/webservices/webservices.module';
import { SessionsModule } from './modules/sessions/sessions.module';

@Module({
  imports: [PrdModule, TestCasesModule, WebServicesModule, SessionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
