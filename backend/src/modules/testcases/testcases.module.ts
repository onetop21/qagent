import { Module } from '@nestjs/common';
import { TestCasesController } from './testcases.controller';
import { TestCasesService } from './testcases.service';
import { GeminiService } from './gemini.service';

@Module({
  controllers: [TestCasesController],
  providers: [TestCasesService, GeminiService],
  exports: [TestCasesService],
})
export class TestCasesModule {}
