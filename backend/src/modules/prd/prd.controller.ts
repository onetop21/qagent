import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrdService } from './prd.service';
import { PrdResponseDto } from './dto/prd-response.dto';

@Controller('prds')
export class PrdController {
  constructor(private readonly prdService: PrdService) {}

  /**
   * Upload and parse PRD file
   * POST /api/prds
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadPrd(
    @UploadedFile() file: Express.Multer.File,
    @Body('projectId') projectId: string,
  ): Promise<PrdResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (!projectId) {
      throw new BadRequestException('projectId is required');
    }

    return this.prdService.create(file, projectId);
  }

  /**
   * Get all PRDs
   * GET /api/prds
   */
  @Get()
  async getAllPrds(): Promise<PrdResponseDto[]> {
    return this.prdService.findAll();
  }

  /**
   * Get PRD by ID
   * GET /api/prds/:id
   */
  @Get(':id')
  async getPrdById(@Param('id') id: string): Promise<PrdResponseDto> {
    return this.prdService.findOne(id);
  }
}
