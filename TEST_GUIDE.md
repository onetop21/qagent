# Test-Driven Development Guide

This guide provides quick reference for implementing TDD workflow in the Gemini Web QA Tool project.

## TDD Workflow

### Red-Green-Refactor Cycle

```
1. RED: Write a failing test
2. GREEN: Write minimal code to pass the test
3. REFACTOR: Improve code while keeping tests passing
```

## Quick Start

### Backend Service Development

1. **Copy service test template:**
   ```bash
   cp backend/test/templates/service.spec.template.ts \
      backend/src/modules/your-module/your-service.spec.ts
   ```

2. **Write failing test:**
   ```typescript
   it('should create user', async () => {
     const dto = { name: 'John', email: 'john@test.com' };
     const result = await service.create(dto);
     expect(result).toHaveProperty('id');
   });
   ```

3. **Run test (should fail):**
   ```bash
   npm test -- your-service.spec.ts
   ```

4. **Implement feature:**
   ```typescript
   async create(dto: CreateUserDto) {
     return await this.prisma.user.create({ data: dto });
   }
   ```

5. **Run test (should pass):**
   ```bash
   npm test -- your-service.spec.ts
   ```

### Backend API Development

1. **Copy e2e test template:**
   ```bash
   cp backend/test/templates/e2e.spec.template.ts \
      backend/test/your-module.e2e-spec.ts
   ```

2. **Write failing E2E test:**
   ```typescript
   it('POST /users should create user', () => {
     return request(app.getHttpServer())
       .post('/users')
       .send({ name: 'John', email: 'john@test.com' })
       .expect(201)
       .expect((res) => {
         expect(res.body).toHaveProperty('id');
       });
   });
   ```

3. **Implement controller, service, and DTOs**

4. **Run E2E test:**
   ```bash
   npm run test:e2e -- your-module.e2e-spec.ts
   ```

### Frontend Component Development

1. **Copy component test template:**
   ```bash
   cp frontend/test/templates/component.test.template.tsx \
      frontend/src/components/__tests__/YourComponent.test.tsx
   ```

2. **Write failing test:**
   ```typescript
   it('should render user name', () => {
     render(<UserCard user={{ name: 'John' }} />);
     expect(screen.getByText('John')).toBeInTheDocument();
   });
   ```

3. **Run test (should fail):**
   ```bash
   npm test -- UserComponent.test.tsx
   ```

4. **Implement component:**
   ```tsx
   export default function UserCard({ user }) {
     return <div>{user.name}</div>;
   }
   ```

5. **Run test (should pass):**
   ```bash
   npm test -- UserComponent.test.tsx
   ```

### Frontend Page Development

1. **Copy page test template:**
   ```bash
   cp frontend/test/templates/page.test.template.tsx \
      frontend/app/your-page/__tests__/page.test.tsx
   ```

2. **Write workflow test:**
   ```typescript
   it('should submit form and redirect', async () => {
     const user = userEvent.setup();
     render(<YourPage />);

     await user.type(screen.getByLabelText('Name'), 'John');
     await user.click(screen.getByRole('button', { name: /submit/i }));

     await waitFor(() => {
       expect(mockRouter.push).toHaveBeenCalledWith('/success');
     });
   });
   ```

3. **Implement page component**

## Test Coverage Requirements

### By Layer

- **Services (Backend)**: 80%+ coverage
  - All public methods
  - Error handling
  - Business logic
  - Transactions

- **Controllers (Backend)**: 70%+ coverage
  - Request handling
  - Response formatting
  - Basic error handling

- **Components (Frontend)**: 75%+ coverage
  - Rendering
  - User interactions
  - Props variations
  - Error states

- **Pages (Frontend)**: 80%+ coverage
  - Complete user workflows
  - Data loading
  - Form submissions
  - Navigation

### By Test Type

```
Unit Tests:     70% of total tests
Integration:    20% of total tests
E2E Tests:      10% of total tests
```

## Common Test Scenarios

### 1. CRUD Operations

```typescript
describe('CRUD Operations', () => {
  it('should create', async () => {});
  it('should read all', async () => {});
  it('should read one', async () => {});
  it('should update', async () => {});
  it('should delete', async () => {});
});
```

### 2. Validation

```typescript
describe('Validation', () => {
  it('should accept valid data', async () => {});
  it('should reject missing required fields', async () => {});
  it('should reject invalid format', async () => {});
  it('should reject out of range values', async () => {});
});
```

### 3. Authentication & Authorization

```typescript
describe('Auth', () => {
  it('should allow authenticated users', async () => {});
  it('should reject unauthenticated users', async () => {});
  it('should reject unauthorized users', async () => {});
});
```

### 4. Error Handling

```typescript
describe('Error Handling', () => {
  it('should handle not found', async () => {});
  it('should handle database errors', async () => {});
  it('should handle validation errors', async () => {});
  it('should handle timeout', async () => {});
});
```

### 5. Edge Cases

```typescript
describe('Edge Cases', () => {
  it('should handle empty array', async () => {});
  it('should handle null values', async () => {});
  it('should handle very long strings', async () => {});
  it('should handle concurrent requests', async () => {});
});
```

## Testing Commands Cheatsheet

### Backend

```bash
# Run all tests
npm test

# Run specific test file
npm test -- users.service.spec.ts

# Run tests matching pattern
npm test -- --testNamePattern="should create"

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage

# E2E tests
npm run test:e2e

# Specific E2E test
npm run test:e2e -- users.e2e-spec.ts

# Debug tests
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Frontend

```bash
# Run all tests
npm test

# Run specific test file
npm test -- UserCard.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage

# Update snapshots
npm test -- -u

# Debug tests
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Mock Strategies

### Backend

```typescript
// Mock PrismaService
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

// Mock external services
const mockEmailService = {
  send: jest.fn(),
};

// Mock Gemini API
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: jest.fn(),
    })),
  })),
}));
```

### Frontend

```typescript
// Mock API client
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock SWR
const mockSwrConfig = {
  fetcher: jest.fn(),
  provider: () => new Map(),
};
```

## CI/CD Integration

### Pre-commit Hook

```bash
# .husky/pre-commit
npm test -- --bail --findRelatedTests
```

### GitHub Actions

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: |
    cd backend && npm test -- --coverage
    cd frontend && npm test -- --coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Debugging Failed Tests

### 1. Read the error message
```
Expected: "John Doe"
Received: "Jane Doe"
```

### 2. Check test data
```typescript
console.log('Mock data:', mockUser);
console.log('Actual result:', result);
```

### 3. Verify mocks
```typescript
console.log('Mock called with:', mockService.create.mock.calls);
```

### 4. Use debugger
```typescript
it('should work', async () => {
  debugger; // Add breakpoint
  const result = await service.method();
  expect(result).toBe('expected');
});
```

Run with: `node --inspect-brk node_modules/.bin/jest --runInBand`

## Best Practices Summary

1. **Write tests first** (TDD)
2. **One assertion per test** (when possible)
3. **Use descriptive test names** (`should create user when valid data provided`)
4. **Follow AAA pattern** (Arrange-Act-Assert)
5. **Keep tests independent** (no shared state)
6. **Mock external dependencies**
7. **Test behavior, not implementation**
8. **Maintain test code quality** (refactor tests too)
9. **Run tests before committing**
10. **Aim for high coverage** (80%+)

## Resources

- Test Templates: `backend/test/templates/`, `frontend/test/templates/`
- Template README: `backend/test/templates/README.md`
- Jest Docs: https://jestjs.io/
- Testing Library: https://testing-library.com/
- NestJS Testing: https://docs.nestjs.com/fundamentals/testing
