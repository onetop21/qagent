import { IsNotEmpty, IsString, IsBoolean, IsArray, ValidateNested, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class TestStepDto {
  @IsInt()
  stepNumber: number;

  @IsNotEmpty()
  @IsString()
  action: string;

  @IsNotEmpty()
  @IsString()
  expectedOutcome: string;
}

export class CreateTestCaseDto {
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @IsNotEmpty()
  @IsString()
  testId: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  expectedResult: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestStepDto)
  testSteps: TestStepDto[];

  @IsOptional()
  @IsString()
  prdId?: string;
}

export class UpdateTestCaseDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  expectedResult?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestStepDto)
  testSteps?: TestStepDto[];
}

export class TestCaseResponseDto {
  id: string;
  testId: string;
  description: string;
  expectedResult: string;
  source: 'prd_auto' | 'ai_augmented' | 'user_manual' | 'imported';
  isEdgeCase: boolean;
  createdAt: Date;
  updatedAt: Date;
  testSteps: TestStepDto[];
}

export class AugmentTestCasesDto {
  @IsNotEmpty()
  @IsString()
  prdId: string;

  @IsNotEmpty()
  @IsString()
  type: 'additional' | 'edge_case';
}
