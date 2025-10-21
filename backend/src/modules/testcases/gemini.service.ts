import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeneratedTestCase {
  testId: string;
  description: string;
  expectedResult: string;
  steps: {
    stepNumber: number;
    action: string;
    expectedOutcome: string;
  }[];
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  /**
   * Generate test cases from PRD text
   * @param prdText - Parsed PRD text
   * @returns Array of generated test cases
   */
  async generateTestCases(prdText: string): Promise<GeneratedTestCase[]> {
    this.logger.log('Generating test cases from PRD...');

    const prompt = this.buildTestCasePrompt(prdText);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const testCases = this.parseTestCasesFromResponse(text);

      this.logger.log(`Generated ${testCases.length} test cases`);
      return testCases;
    } catch (error) {
      this.logger.error(`Gemini API error: ${error.message}`, error.stack);

      // Fallback: Return basic test cases
      return this.getFallbackTestCases();
    }
  }

  /**
   * Generate edge case test cases
   * @param existingTestCases - Existing test cases for context
   * @returns Array of edge case test cases
   */
  async generateEdgeCases(existingTestCases: GeneratedTestCase[]): Promise<GeneratedTestCase[]> {
    this.logger.log('Generating edge case test cases...');

    const prompt = this.buildEdgeCasePrompt(existingTestCases);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const testCases = this.parseTestCasesFromResponse(text);

      this.logger.log(`Generated ${testCases.length} edge case test cases`);
      return testCases;
    } catch (error) {
      this.logger.error(`Gemini API error: ${error.message}`, error.stack);
      return [];
    }
  }

  /**
   * Build prompt for test case generation
   */
  private buildTestCasePrompt(prdText: string): string {
    return `You are a QA engineer. Generate comprehensive test cases from the following Product Requirements Document (PRD).

PRD:
${prdText}

Generate test cases in JSON format with the following structure:
[
  {
    "testId": "TC-001",
    "description": "Test case description",
    "expectedResult": "Expected outcome",
    "steps": [
      {
        "stepNumber": 1,
        "action": "Action to perform",
        "expectedOutcome": "Expected result of this step"
      }
    ]
  }
]

Requirements:
- Generate 5-10 comprehensive test cases
- Cover main user flows
- Include positive and negative scenarios
- Each test should have 3-7 steps
- Use clear, actionable language
- Return ONLY valid JSON, no additional text

JSON:`;
  }

  /**
   * Build prompt for edge case generation
   */
  private buildEdgeCasePrompt(existingTestCases: GeneratedTestCase[]): string {
    return `You are a QA engineer specializing in edge cases. Given these existing test cases, generate additional edge case test cases.

Existing test cases:
${JSON.stringify(existingTestCases, null, 2)}

Generate edge case test cases that cover:
- Boundary conditions
- Error scenarios
- Unusual user inputs
- Performance edge cases
- Security edge cases

Use the same JSON format as the existing test cases.
Generate 3-5 edge case test cases.
Return ONLY valid JSON, no additional text.

JSON:`;
  }

  /**
   * Parse test cases from Gemini response
   */
  private parseTestCasesFromResponse(text: string): GeneratedTestCase[] {
    try {
      // Extract JSON from response (may have markdown code blocks)
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const testCases = JSON.parse(jsonMatch[0]);

      // Validate structure
      if (!Array.isArray(testCases)) {
        throw new Error('Response is not an array');
      }

      return testCases;
    } catch (error) {
      this.logger.error(`Failed to parse test cases: ${error.message}`);
      return this.getFallbackTestCases();
    }
  }

  /**
   * Get fallback test cases when API fails
   */
  private getFallbackTestCases(): GeneratedTestCase[] {
    this.logger.warn('Using fallback test cases due to API failure');

    return [
      {
        testId: 'TC-001',
        description: 'Basic functionality test',
        expectedResult: 'System should work as expected',
        steps: [
          {
            stepNumber: 1,
            action: 'Navigate to the application',
            expectedOutcome: 'Application loads successfully',
          },
          {
            stepNumber: 2,
            action: 'Perform basic operation',
            expectedOutcome: 'Operation completes without errors',
          },
          {
            stepNumber: 3,
            action: 'Verify results',
            expectedOutcome: 'Results are displayed correctly',
          },
        ],
      },
    ];
  }

  /**
   * Retry with exponential backoff
   */
  async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        this.logger.warn(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}
