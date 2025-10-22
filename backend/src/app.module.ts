import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './modules/projects/projects.module';
import { PrdModule } from './modules/prd/prd.module';
import { TestCasesModule } from './modules/testcases/testcases.module';
import { WebServicesModule } from './modules/webservices/webservices.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ProjectsModule,
    PrdModule,
    TestCasesModule,
    WebServicesModule,
    SessionsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
