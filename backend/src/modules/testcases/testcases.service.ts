import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { GeminiService } from './gemini.service';
import {
  CreateTestCaseDto,
  UpdateTestCaseDto,
  TestCaseResponseDto,
  AugmentTestCasesDto,
} from './dto/testcase.dto';

@Injectable()
export class TestCasesService {
  private readonly logger = new Logger(TestCasesService.name);
  private readonly prisma: PrismaClient;

  constructor(private readonly geminiService: GeminiService) {
    this.prisma = new PrismaClient();
  }

  /**
   * Generate test cases from PRD
   * @param prdId - PRD ID
   * @returns Generated test cases
   */
  async generateFromPrd(prdId: string): Promise<TestCaseResponseDto[]> {
    // Get PRD
    const prd = await this.prisma.prd.findUnique({
      where: { id: prdId },
    });

    if (!prd) {
      throw new BadRequestException(`PRD with ID ${prdId} not found`);
    }

    this.logger.log(`Generating test cases for PRD: ${prdId}`);

    // Generate test cases using Gemini
    const generatedTestCases = await this.geminiService.retryWithBackoff(
      () => this.geminiService.generateTestCases(prd.parsedText),
      3,
    );

    // Save to database
    const testCases: TestCaseResponseDto[] = [];

    for (const tc of generatedTestCases) {
      const testCase = await this.prisma.testCase.create({
        data: {
          testId: tc.testId,
          description: tc.description,
          expectedResult: tc.expectedResult,
          source: 'prd_auto',
          isEdgeCase: false,
          projectId: prd.projectId,
          prdId,
          testSteps: {
            create: tc.steps.map((step) => ({
              stepNumber: step.stepNumber,
              action: step.action,
              expectedOutcome: step.expectedOutcome,
            })),
          },
        },
        include: {
          testSteps: true,
        },
      });

      testCases.push(this.mapToResponseDto(testCase));
    }

    this.logger.log(`Created ${testCases.length} test cases`);
    return testCases;
  }

  /**
   * Augment test cases with AI
   * @param dto - Augmentation parameters
   * @returns Augmented test cases
   */
  async augment(dto: AugmentTestCasesDto): Promise<TestCaseResponseDto[]> {
    this.logger.log(`Augmenting test cases for PRD: ${dto.prdId}, type: ${dto.type}`);

    // Get PRD to get projectId
    const prd = await this.prisma.prd.findUnique({
      where: { id: dto.prdId },
    });

    if (!prd) {
      throw new BadRequestException(`PRD with ID ${dto.prdId} not found`);
    }

    // Get existing test cases
    const existingTestCases = await this.prisma.testCase.findMany({
      where: { prdId: dto.prdId },
      include: { testSteps: true },
    });

    if (existingTestCases.length === 0) {
      throw new BadRequestException('No existing test cases found for this PRD');
    }

    // Generate augmented test cases
    const mapped = existingTestCases.map((tc) => ({
      testId: tc.testId,
      description: tc.description,
      expectedResult: tc.expectedResult,
      steps: tc.testSteps.map((step) => ({
        stepNumber: step.stepNumber,
        action: step.action,
        expectedOutcome: step.expectedOutcome,
      })),
    }));

    const generatedTestCases = await this.geminiService.retryWithBackoff(
      () => this.geminiService.generateEdgeCases(mapped),
      3,
    );

    // Save to database
    const testCases: TestCaseResponseDto[] = [];
    let counter = existingTestCases.length + 1;

    for (const tc of generatedTestCases) {
      const testCase = await this.prisma.testCase.create({
        data: {
          testId: `TC-${String(counter).padStart(3, '0')}`,
          description: tc.description,
          expectedResult: tc.expectedResult,
          source: 'ai_augmented',
          isEdgeCase: dto.type === 'edge_case',
          projectId: prd.projectId,
          prdId: dto.prdId,
          testSteps: {
            create: tc.steps.map((step) => ({
              stepNumber: step.stepNumber,
              action: step.action,
              expectedOutcome: step.expectedOutcome,
            })),
          },
        },
        include: {
          testSteps: true,
        },
      });

      testCases.push(this.mapToResponseDto(testCase));
      counter++;
    }

    this.logger.log(`Created ${testCases.length} augmented test cases`);
    return testCases;
  }

  /**
   * Create test case manually
   */
  async create(dto: CreateTestCaseDto): Promise<TestCaseResponseDto> {
    const testCase = await this.prisma.testCase.create({
      data: {
        testId: dto.testId,
        description: dto.description,
        expectedResult: dto.expectedResult,
        source: 'user_manual',
        isEdgeCase: false,
        projectId: dto.projectId,
        prdId: dto.prdId,
        testSteps: {
          create: dto.testSteps,
        },
      },
      include: {
        testSteps: true,
      },
    });

    return this.mapToResponseDto(testCase);
  }

  /**
   * Update test case
   */
  async update(id: string, dto: UpdateTestCaseDto): Promise<TestCaseResponseDto> {
    // Delete existing steps if new ones provided
    if (dto.testSteps) {
      await this.prisma.testStep.deleteMany({
        where: { testCaseId: id },
      });
    }

    const testCase = await this.prisma.testCase.update({
      where: { id },
      data: {
        description: dto.description,
        expectedResult: dto.expectedResult,
        testSteps: dto.testSteps
          ? {
              create: dto.testSteps,
            }
          : undefined,
      },
      include: {
        testSteps: true,
      },
    });

    return this.mapToResponseDto(testCase);
  }

  /**
   * Delete test case
   */
  async delete(id: string): Promise<void> {
    await this.prisma.testCase.delete({
      where: { id },
    });

    this.logger.log(`Deleted test case: ${id}`);
  }

  /**
   * Get all test cases
   */
  async findAll(prdId?: string): Promise<TestCaseResponseDto[]> {
    const testCases = await this.prisma.testCase.findMany({
      where: prdId ? { prdId } : undefined,
      include: {
        testSteps: {
          orderBy: { stepNumber: 'asc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return testCases.map(this.mapToResponseDto);
  }

  /**
   * Get test case by ID
   */
  async findOne(id: string): Promise<TestCaseResponseDto> {
    const testCase = await this.prisma.testCase.findUnique({
      where: { id },
      include: {
        testSteps: {
          orderBy: { stepNumber: 'asc' },
        },
      },
    });

    if (!testCase) {
      throw new BadRequestException(`Test case with ID ${id} not found`);
    }

    return this.mapToResponseDto(testCase);
  }

  /**
   * Map Prisma model to DTO
   */
  private mapToResponseDto(testCase: any): TestCaseResponseDto {
    return {
      id: testCase.id,
      testId: testCase.testId,
      description: testCase.description,
      expectedResult: testCase.expectedResult,
      source: testCase.source,
      isEdgeCase: testCase.isEdgeCase,
      createdAt: testCase.createdAt,
      updatedAt: testCase.updatedAt,
      testSteps: testCase.testSteps.map((step) => ({
        stepNumber: step.stepNumber,
        action: step.action,
        expectedOutcome: step.expectedOutcome,
      })),
    };
  }
}
