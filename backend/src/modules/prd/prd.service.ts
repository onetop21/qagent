import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MarkdownParser } from './utils/markdown-parser';
import { PdfParser } from './utils/pdf-parser';
import { CreatePrdDto } from './dto/create-prd.dto';
import { PrdResponseDto } from './dto/prd-response.dto';

@Injectable()
export class PrdService {
  private readonly logger = new Logger(PrdService.name);
  private readonly prisma: PrismaClient;
  private readonly markdownParser: MarkdownParser;
  private readonly pdfParser: PdfParser;

  constructor() {
    this.prisma = new PrismaClient();
    this.markdownParser = new MarkdownParser();
    this.pdfParser = new PdfParser();
  }

  /**
   * Parse uploaded PRD file
   * @param file - Uploaded file
   * @returns Parsed text
   */
  async parseFile(file: Express.Multer.File): Promise<string> {
    const fileFormat = this.detectFileFormat(file.originalname);

    this.logger.log(`Parsing ${fileFormat} file: ${file.originalname}`);

    try {
      if (fileFormat === 'markdown') {
        const content = file.buffer.toString('utf-8');
        return this.markdownParser.parse(content);
      } else if (fileFormat === 'pdf') {
        return await this.pdfParser.parse(file.buffer);
      } else {
        throw new BadRequestException('Unsupported file format. Only Markdown and PDF are supported.');
      }
    } catch (error) {
      this.logger.error(`Failed to parse file: ${error.message}`, error.stack);
      throw new BadRequestException(`File parsing failed: ${error.message}`);
    }
  }

  /**
   * Detect file format from filename
   * @param filename - Original filename
   * @returns File format
   */
  private detectFileFormat(filename: string): 'markdown' | 'pdf' {
    const ext = filename.toLowerCase().split('.').pop();

    if (ext === 'md' || ext === 'markdown') {
      return 'markdown';
    } else if (ext === 'pdf') {
      return 'pdf';
    }

    throw new BadRequestException('Unsupported file extension. Use .md, .markdown, or .pdf');
  }

  /**
   * Create PRD record in database
   * @param file - Uploaded file
   * @returns Created PRD
   */
  async create(file: Express.Multer.File): Promise<PrdResponseDto> {
    const parsedText = await this.parseFile(file);
    const fileFormat = this.detectFileFormat(file.originalname);

    const prd = await this.prisma.prd.create({
      data: {
        fileName: file.originalname,
        fileFormat,
        parsedText,
      },
    });

    this.logger.log(`Created PRD: ${prd.id}`);

    return {
      id: prd.id,
      fileName: prd.fileName,
      fileFormat: prd.fileFormat,
      uploadedAt: prd.uploadedAt,
      parsedText: prd.parsedText,
    };
  }

  /**
   * Get PRD by ID
   * @param id - PRD ID
   * @returns PRD
   */
  async findOne(id: string): Promise<PrdResponseDto> {
    const prd = await this.prisma.prd.findUnique({
      where: { id },
      include: {
        testCases: true,
      },
    });

    if (!prd) {
      throw new BadRequestException(`PRD with ID ${id} not found`);
    }

    return {
      id: prd.id,
      fileName: prd.fileName,
      fileFormat: prd.fileFormat,
      uploadedAt: prd.uploadedAt,
      parsedText: prd.parsedText,
      testCasesGenerated: prd.testCases?.length || 0,
    };
  }

  /**
   * Get all PRDs
   * @returns List of PRDs
   */
  async findAll(): Promise<PrdResponseDto[]> {
    const prds = await this.prisma.prd.findMany({
      include: {
        testCases: true,
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    return prds.map((prd) => ({
      id: prd.id,
      fileName: prd.fileName,
      fileFormat: prd.fileFormat,
      uploadedAt: prd.uploadedAt,
      parsedText: prd.parsedText,
      testCasesGenerated: prd.testCases?.length || 0,
    }));
  }
}
