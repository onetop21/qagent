import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { CreateWebServiceDto } from './dto/webservice.dto';
import { WebServiceResponseDto } from './dto/webservice.dto';

@Injectable()
export class WebServicesService {
  private readonly logger = new Logger(WebServicesService.name);
  private readonly prisma: PrismaClient;

  constructor(private readonly authService: AuthService) {
    this.prisma = new PrismaClient();
  }

  /**
   * Create web service with encrypted credentials
   * @param dto - Web service data
   * @returns Created web service
   */
  async create(dto: CreateWebServiceDto): Promise<WebServiceResponseDto> {
    this.logger.log(`Creating web service: ${dto.name}`);

    // Encrypt credentials
    const encryptedUsername = this.authService.encrypt(dto.loginUsername);
    const encryptedPassword = this.authService.encrypt(dto.loginPassword);

    const webService = await this.prisma.webService.create({
      data: {
        name: dto.name,
        url: dto.url,
        loginUsername: encryptedUsername,
        loginPassword: encryptedPassword,
      },
    });

    this.logger.log(`Created web service: ${webService.id}`);

    return {
      id: webService.id,
      name: webService.name,
      url: webService.url,
      createdAt: webService.createdAt,
      updatedAt: webService.updatedAt,
    };
  }

  /**
   * Get all web services
   * @returns List of web services
   */
  async findAll(): Promise<WebServiceResponseDto[]> {
    const webServices = await this.prisma.webService.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return webServices.map((ws) => ({
      id: ws.id,
      name: ws.name,
      url: ws.url,
      createdAt: ws.createdAt,
      updatedAt: ws.updatedAt,
    }));
  }

  /**
   * Get web service by ID
   * @param id - Web service ID
   * @returns Web service
   */
  async findOne(id: string): Promise<WebServiceResponseDto> {
    const webService = await this.prisma.webService.findUnique({
      where: { id },
    });

    if (!webService) {
      throw new BadRequestException(`Web service with ID ${id} not found`);
    }

    return {
      id: webService.id,
      name: webService.name,
      url: webService.url,
      createdAt: webService.createdAt,
      updatedAt: webService.updatedAt,
    };
  }

  /**
   * Get decrypted credentials (internal use only)
   * @param id - Web service ID
   * @returns Decrypted credentials
   */
  async getCredentials(id: string): Promise<{ username: string; password: string }> {
    const webService = await this.prisma.webService.findUnique({
      where: { id },
    });

    if (!webService) {
      throw new BadRequestException(`Web service with ID ${id} not found`);
    }

    return {
      username: this.authService.decrypt(webService.loginUsername),
      password: this.authService.decrypt(webService.loginPassword),
    };
  }

  /**
   * Delete web service
   * @param id - Web service ID
   */
  async delete(id: string): Promise<void> {
    await this.prisma.webService.delete({
      where: { id },
    });

    this.logger.log(`Deleted web service: ${id}`);
  }
}
