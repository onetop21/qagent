import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrdModule } from './modules/prd/prd.module';
import { TestCasesModule } from './modules/testcases/testcases.module';

@Module({
  imports: [PrdModule, TestCasesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
