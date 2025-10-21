import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '@/prisma/prisma.service';
// Import the module being tested
// import { YourModule } from '../your.module';

/**
 * E2E Test Template for NestJS API Endpoints
 *
 * Replace placeholders:
 * - YourModule: Module containing the endpoints
 * - /your-endpoint: API endpoint path
 *
 * Test Structure:
 * 1. Setup: Create full application context
 * 2. Database: Use test database or mock PrismaService
 * 3. HTTP requests: Test actual HTTP layer
 * 4. Validation: Test DTO validation pipes
 * 5. Cleanup: Clean database after each test
 */
describe('YourModule E2E Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [/* YourModule */],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply global pipes (same as main.ts)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Apply global filters and interceptors if any
    // app.useGlobalFilters(new HttpExceptionFilter());
    // app.useGlobalInterceptors(new LoggingInterceptor());

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Clean up database
    await prisma.$disconnect();
    await app.close();
  });

  afterEach(async () => {
    // Clean up test data after each test
    // await prisma.yourEntity.deleteMany();
  });

  describe('/your-endpoint (POST)', () => {
    const validDto = {
      // ... add valid DTO fields
    };

    describe('Happy Path', () => {
      it('should create a new resource', () => {
        return request(app.getHttpServer())
          .post('/your-endpoint')
          .send(validDto)
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toMatchObject(validDto);
          });
      });
    });

    describe('Validation', () => {
      it('should reject missing required fields', () => {
        return request(app.getHttpServer())
          .post('/your-endpoint')
          .send({})
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain('validation');
          });
      });

      it('should reject invalid data types', () => {
        return request(app.getHttpServer())
          .post('/your-endpoint')
          .send({ ...validDto, fieldName: 123 }) // should be string
          .expect(400);
      });

      it('should reject extra fields when forbidNonWhitelisted', () => {
        return request(app.getHttpServer())
          .post('/your-endpoint')
          .send({ ...validDto, extraField: 'not allowed' })
          .expect(400);
      });
    });

    describe('Business Logic', () => {
      it('should enforce unique constraints', async () => {
        // Create first resource
        await request(app.getHttpServer())
          .post('/your-endpoint')
          .send(validDto)
          .expect(201);

        // Try to create duplicate
        return request(app.getHttpServer())
          .post('/your-endpoint')
          .send(validDto)
          .expect(409); // Conflict
      });
    });
  });

  describe('/your-endpoint (GET)', () => {
    beforeEach(async () => {
      // Seed test data
      // await prisma.yourEntity.create({ data: {...} });
    });

    describe('Happy Path', () => {
      it('should return all resources', () => {
        return request(app.getHttpServer())
          .get('/your-endpoint')
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
          });
      });

      it('should return empty array when no data', async () => {
        // Clean database
        // await prisma.yourEntity.deleteMany();

        return request(app.getHttpServer())
          .get('/your-endpoint')
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual([]);
          });
      });
    });

    describe('Filtering', () => {
      it('should filter by query parameters', () => {
        return request(app.getHttpServer())
          .get('/your-endpoint?status=active')
          .expect(200)
          .expect((res) => {
            expect(res.body.every((item: any) => item.status === 'active')).toBe(true);
          });
      });
    });

    describe('Pagination', () => {
      it('should paginate results', () => {
        return request(app.getHttpServer())
          .get('/your-endpoint?page=1&limit=10')
          .expect(200)
          .expect((res) => {
            expect(res.body.length).toBeLessThanOrEqual(10);
          });
      });
    });
  });

  describe('/your-endpoint/:id (GET)', () => {
    let createdId: string;

    beforeEach(async () => {
      // Create test resource
      const response = await request(app.getHttpServer())
        .post('/your-endpoint')
        .send({ /* valid data */ });
      createdId = response.body.id;
    });

    describe('Happy Path', () => {
      it('should return a single resource', () => {
        return request(app.getHttpServer())
          .get(`/your-endpoint/${createdId}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.id).toBe(createdId);
          });
      });
    });

    describe('Error Handling', () => {
      it('should return 404 for non-existent resource', () => {
        return request(app.getHttpServer())
          .get('/your-endpoint/non-existent-id')
          .expect(404);
      });

      it('should return 400 for invalid ID format', () => {
        return request(app.getHttpServer())
          .get('/your-endpoint/invalid-uuid')
          .expect(400);
      });
    });
  });

  describe('/your-endpoint/:id (PUT)', () => {
    let createdId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/your-endpoint')
        .send({ /* valid data */ });
      createdId = response.body.id;
    });

    describe('Happy Path', () => {
      it('should update a resource', () => {
        const updateDto = { /* updated fields */ };

        return request(app.getHttpServer())
          .put(`/your-endpoint/${createdId}`)
          .send(updateDto)
          .expect(200)
          .expect((res) => {
            expect(res.body.id).toBe(createdId);
            expect(res.body).toMatchObject(updateDto);
          });
      });
    });

    describe('Validation', () => {
      it('should reject invalid updates', () => {
        return request(app.getHttpServer())
          .put(`/your-endpoint/${createdId}`)
          .send({ invalidField: 'value' })
          .expect(400);
      });
    });
  });

  describe('/your-endpoint/:id (DELETE)', () => {
    let createdId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/your-endpoint')
        .send({ /* valid data */ });
      createdId = response.body.id;
    });

    describe('Happy Path', () => {
      it('should delete a resource', async () => {
        await request(app.getHttpServer())
          .delete(`/your-endpoint/${createdId}`)
          .expect(200);

        // Verify deletion
        return request(app.getHttpServer())
          .get(`/your-endpoint/${createdId}`)
          .expect(404);
      });
    });

    describe('Error Handling', () => {
      it('should return 404 when deleting non-existent resource', () => {
        return request(app.getHttpServer())
          .delete('/your-endpoint/non-existent-id')
          .expect(404);
      });
    });
  });

  describe('Complex Workflows', () => {
    it('should handle multi-step workflow', async () => {
      // Step 1: Create resource A
      const responseA = await request(app.getHttpServer())
        .post('/endpoint-a')
        .send({ /* data */ })
        .expect(201);

      // Step 2: Create resource B that depends on A
      const responseB = await request(app.getHttpServer())
        .post('/endpoint-b')
        .send({ relatedId: responseA.body.id })
        .expect(201);

      // Step 3: Verify relationship
      return request(app.getHttpServer())
        .get(`/endpoint-a/${responseA.body.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.relatedItems).toContainEqual(
            expect.objectContaining({ id: responseB.body.id }),
          );
        });
    });
  });

  describe('Error Scenarios', () => {
    it('should handle database errors gracefully', async () => {
      // Simulate database error by disconnecting
      await prisma.$disconnect();

      return request(app.getHttpServer())
        .get('/your-endpoint')
        .expect(500)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
        });
    });
  });
});
