import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        status: 'active',
      },
    });
  }

  async findAll(status?: string) {
    return this.prisma.project.findMany({
      where: status ? { status } : undefined,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            prds: true,
            webServices: true,
            testCases: true,
            testSessions: true,
            qaReports: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            prds: true,
            webServices: true,
            testCases: true,
            testSessions: true,
            qaReports: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    // Check if project exists
    await this.findOne(id);

    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async remove(id: string) {
    // Check if project exists
    await this.findOne(id);

    // Check if project has active test sessions
    const activeSession = await this.prisma.testSession.findFirst({
      where: {
        projectId: id,
        status: 'running',
      },
    });

    if (activeSession) {
      throw new Error(
        'Cannot delete project with active test sessions. Please wait for them to complete or cancel them first.',
      );
    }

    return this.prisma.project.delete({
      where: { id },
    });
  }
}
