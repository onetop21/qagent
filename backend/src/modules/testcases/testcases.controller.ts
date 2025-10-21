import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { TestCasesService } from './testcases.service';
import {
  CreateTestCaseDto,
  UpdateTestCaseDto,
  TestCaseResponseDto,
  AugmentTestCasesDto,
} from './dto/testcase.dto';

@Controller('test-cases')
export class TestCasesController {
  constructor(private readonly testCasesService: TestCasesService) {}

  /**
   * Generate test cases from PRD
   * POST /api/test-cases/generate/:prdId
   */
  @Post('generate/:prdId')
  async generateFromPrd(
    @Param('prdId') prdId: string,
  ): Promise<TestCaseResponseDto[]> {
    return this.testCasesService.generateFromPrd(prdId);
  }

  /**
   * Augment test cases with AI
   * POST /api/test-cases/augment
   */
  @Post('augment')
  async augment(
    @Body() dto: AugmentTestCasesDto,
  ): Promise<TestCaseResponseDto[]> {
    return this.testCasesService.augment(dto);
  }

  /**
   * Create test case manually
   * POST /api/test-cases
   */
  @Post()
  async create(
    @Body() dto: CreateTestCaseDto,
  ): Promise<TestCaseResponseDto> {
    return this.testCasesService.create(dto);
  }

  /**
   * Get all test cases
   * GET /api/test-cases?prdId=xxx
   */
  @Get()
  async findAll(
    @Query('prdId') prdId?: string,
  ): Promise<TestCaseResponseDto[]> {
    return this.testCasesService.findAll(prdId);
  }

  /**
   * Get test case by ID
   * GET /api/test-cases/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TestCaseResponseDto> {
    return this.testCasesService.findOne(id);
  }

  /**
   * Update test case
   * PUT /api/test-cases/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTestCaseDto,
  ): Promise<TestCaseResponseDto> {
    return this.testCasesService.update(id, dto);
  }

  /**
   * Delete test case
   * DELETE /api/test-cases/:id
   */
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.testCasesService.delete(id);
    return { message: 'Test case deleted successfully' };
  }
}
