# Test Templates

This directory contains test templates for the Gemini Web QA Tool project. These templates provide a standardized approach to testing across the codebase following TDD (Test-Driven Development) principles.

## Available Templates

### Backend Templates

#### 1. Service Unit Test Template (`service.spec.template.ts`)

Use for testing NestJS service classes with business logic.

**When to use:**
- Testing service methods with mocked dependencies
- Testing business logic and data transformations
- Testing transaction handling
- Testing error handling

**Key features:**
- Mocked PrismaService
- Test organization by method
- Happy path, edge cases, and error scenarios
- Transaction testing examples

**Usage:**
```typescript
// Copy template and replace:
// - YourService → Actual service name
// - yourEntity → Prisma model name
// - yourMethod → Method being tested
```

#### 2. Controller Unit Test Template (`controller.spec.template.ts`)

Use for testing NestJS controller classes.

**When to use:**
- Testing HTTP request/response handling
- Testing controller method calls to services
- Testing route handler logic

**Key features:**
- Mocked service dependencies
- Test organization by HTTP method/endpoint
- Request validation testing (note: actual validation in e2e tests)
- Error response testing

**Usage:**
```typescript
// Copy template and replace:
// - YourController → Actual controller name
// - YourService → Service dependency name
// - /endpoint → API endpoint path
```

#### 3. E2E Integration Test Template (`e2e.spec.template.ts`)

Use for testing complete API workflows with real HTTP requests.

**When to use:**
- Testing full request/response cycle
- Testing DTO validation with ValidationPipe
- Testing database interactions
- Testing complex multi-step workflows

**Key features:**
- Full NestJS application context
- Real HTTP requests using supertest
- Database setup/cleanup
- Validation testing with actual ValidationPipe
- Multi-step workflow testing

**Usage:**
```typescript
// Copy template and replace:
// - YourModule → Module being tested
// - /your-endpoint → API endpoint path
// - yourEntity → Prisma model name
```

### Frontend Templates

#### 4. Component Unit Test Template (`component.test.template.tsx`)

Use for testing React components in isolation.

**When to use:**
- Testing component rendering
- Testing user interactions
- Testing component state
- Testing props and conditional rendering

**Key features:**
- React Testing Library setup
- SWR mocking
- User event simulation
- Accessibility testing
- Form validation testing

**Usage:**
```tsx
// Copy template and replace:
// - YourComponent → Component name
// - YourProps → Props interface
```

#### 5. Page Test Template (`page.test.template.tsx`)

Use for testing NextJS page components with routing and data fetching.

**When to use:**
- Testing complete page workflows
- Testing SWR data fetching
- Testing navigation and routing
- Testing form submissions and API calls

**Key features:**
- NextJS router mocking
- API client mocking
- SWR configuration
- Multi-step workflow testing
- Navigation testing

**Usage:**
```tsx
// Copy template and replace:
// - YourPage → Page component name
// - /your-endpoint → API endpoint
```

## Testing Best Practices

### 1. Test Organization

```typescript
describe('ComponentName', () => {
  describe('MethodOrFeature', () => {
    describe('Happy Path', () => {
      it('should do expected behavior', () => {
        // Arrange
        // Act
        // Assert
      });
    });

    describe('Edge Cases', () => {
      it('should handle edge case', () => {});
    });

    describe('Error Handling', () => {
      it('should handle error', () => {});
    });
  });
});
```

### 2. AAA Pattern

Always follow Arrange-Act-Assert pattern:

```typescript
it('should create a user', async () => {
  // Arrange: Set up test data and mocks
  const createDto = { name: 'John', email: 'john@example.com' };
  mockService.create.mockResolvedValue(mockUser);

  // Act: Execute the code being tested
  const result = await controller.create(createDto);

  // Assert: Verify the results
  expect(result).toEqual(mockUser);
  expect(mockService.create).toHaveBeenCalledWith(createDto);
});
```

### 3. Mock Management

```typescript
beforeEach(() => {
  jest.clearAllMocks(); // Clear mock history
});

afterEach(() => {
  jest.resetAllMocks(); // Reset mock implementations
});
```

### 4. Async Testing

```typescript
// Use async/await
it('should fetch data', async () => {
  const result = await service.getData();
  expect(result).toBeDefined();
});

// Use waitFor for React components
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### 5. Test Coverage Goals

- **Unit Tests**: Aim for 80%+ coverage
- **Integration Tests**: Cover critical user workflows
- **E2E Tests**: Cover happy paths and major error scenarios

### 6. What to Test

**DO test:**
- Public API methods
- Business logic
- Error handling
- User interactions
- Data transformations
- Validation logic

**DON'T test:**
- Third-party libraries
- Framework internals
- Private methods (test through public API)
- Generated code

### 7. Test Data Management

```typescript
// Use factories for complex test data
const createMockUser = (overrides = {}) => ({
  id: 'test-id',
  name: 'Test User',
  email: 'test@example.com',
  ...overrides,
});

// Use constants for test data
const VALID_EMAIL = 'test@example.com';
const INVALID_EMAIL = 'invalid-email';
```

## Running Tests

### Backend Tests

```bash
# Unit tests
cd backend
npm test

# Specific test file
npm test -- service.spec.ts

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# E2E tests
npm run test:e2e
```

### Frontend Tests

```bash
# Unit tests
cd frontend
npm test

# Specific test file
npm test -- component.test.tsx

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

## Continuous Integration

Tests should run automatically on:
- Every commit (via pre-commit hook)
- Every pull request (via CI pipeline)
- Before deployment (via CI/CD pipeline)

## Common Patterns

### Testing Exceptions

```typescript
// Backend
await expect(service.method('invalid')).rejects.toThrow(NotFoundException);

// Frontend
expect(() => component.method()).toThrow();
```

### Testing Async Operations

```typescript
// Promise-based
const result = await service.asyncMethod();
expect(result).toBeDefined();

// Callback-based (rare in modern code)
service.callbackMethod((err, result) => {
  expect(err).toBeNull();
  expect(result).toBeDefined();
});
```

### Testing Timers

```typescript
jest.useFakeTimers();

// Execute code with timer
service.scheduleTask();

// Fast-forward time
jest.advanceTimersByTime(1000);

expect(mockCallback).toHaveBeenCalled();

jest.useRealTimers();
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Supertest](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
