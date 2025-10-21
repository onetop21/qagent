import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { WebServicesService } from './webservices.service';
import { CreateWebServiceDto, WebServiceResponseDto } from './dto/webservice.dto';

@Controller('web-services')
export class WebServicesController {
  constructor(private readonly webServicesService: WebServicesService) {}

  /**
   * Create web service
   * POST /api/web-services
   */
  @Post()
  async create(@Body() dto: CreateWebServiceDto): Promise<WebServiceResponseDto> {
    return this.webServicesService.create(dto);
  }

  /**
   * Get all web services
   * GET /api/web-services
   */
  @Get()
  async findAll(): Promise<WebServiceResponseDto[]> {
    return this.webServicesService.findAll();
  }

  /**
   * Get web service by ID
   * GET /api/web-services/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<WebServiceResponseDto> {
    return this.webServicesService.findOne(id);
  }

  /**
   * Delete web service
   * DELETE /api/web-services/:id
   */
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.webServicesService.delete(id);
    return { message: 'Web service deleted successfully' };
  }
}
