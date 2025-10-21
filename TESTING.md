# 테스트 실행 가이드

이 문서는 Gemini Web QA Tool 프로젝트의 테스트를 실행하는 방법을 설명합니다.

## 목차
1. [초기 설정](#초기-설정)
2. [백엔드 테스트](#백엔드-테스트)
3. [프론트엔드 테스트](#프론트엔드-테스트)
4. [첫 테스트 작성하기](#첫-테스트-작성하기)
5. [문제 해결](#문제-해결)

---

## 초기 설정

### 백엔드 설정

백엔드는 이미 Jest가 설정되어 있습니다:

```bash
cd backend
npm install  # 의존성 설치 (이미 설치되어 있으면 생략 가능)
```

### 프론트엔드 설정

프론트엔드에 테스트 라이브러리를 설치해야 합니다:

```bash
cd frontend

# Jest 및 테스트 라이브러리 설치
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

# package.json에 테스트 스크립트 추가 필요 (아래 참조)
```

`frontend/package.json`에 다음 스크립트를 추가하세요:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## 백엔드 테스트

### 1. 모든 테스트 실행

```bash
cd backend
npm test
```

### 2. 특정 테스트 파일 실행

```bash
npm test -- prd.service.spec.ts
```

### 3. Watch 모드 (코드 변경 시 자동 재실행)

```bash
npm run test:watch
```

### 4. 커버리지 리포트

```bash
npm run test:cov
```

커버리지 리포트는 `backend/coverage/` 디렉토리에 생성됩니다.
HTML 리포트: `backend/coverage/lcov-report/index.html`

### 5. E2E 테스트 실행

```bash
npm run test:e2e
```

**주의:** E2E 테스트 실행 전 PostgreSQL이 실행 중이어야 합니다.

### 6. 디버그 모드

```bash
npm run test:debug
```

그 후 Chrome에서 `chrome://inspect` 접속

---

## 프론트엔드 테스트

### 1. 모든 테스트 실행

```bash
cd frontend
npm test
```

### 2. 특정 테스트 파일 실행

```bash
npm test -- UserCard.test.tsx
```

### 3. Watch 모드

```bash
npm run test:watch
```

### 4. 커버리지 리포트

```bash
npm run test:coverage
```

커버리지 리포트는 `frontend/coverage/` 디렉토리에 생성됩니다.

---

## 첫 테스트 작성하기

### 백엔드 Service 테스트 예제

1. **템플릿 복사:**

```bash
cd backend
cp test/templates/service.spec.template.ts src/modules/prd/prd.service.spec.ts
```

2. **테스트 작성:**

```typescript
// src/modules/prd/prd.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PrdService } from './prd.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('PrdService', () => {
  let service: PrdService;
  let prisma: PrismaService;

  const mockPrisma = {
    prd: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrdService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PrdService>(PrdService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all PRDs', async () => {
      const mockPrds = [{ id: '1', fileName: 'test.md' }];
      mockPrisma.prd.findMany.mockResolvedValue(mockPrds);

      const result = await service.findAll();

      expect(result).toEqual(mockPrds);
      expect(prisma.prd.findMany).toHaveBeenCalledTimes(1);
    });
  });
});
```

3. **테스트 실행:**

```bash
npm test -- prd.service.spec.ts
```

### 프론트엔드 Component 테스트 예제

1. **테스트 파일 생성:**

```bash
cd frontend
mkdir -p src/components/__tests__
cp test/templates/component.test.template.tsx src/components/__tests__/FileUpload.test.tsx
```

2. **테스트 작성:**

```typescript
// src/components/__tests__/FileUpload.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUpload from '@/components/prd/FileUpload';

describe('FileUpload', () => {
  const mockOnUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render upload area', () => {
    render(<FileUpload onUpload={mockOnUpload} />);

    expect(screen.getByText(/drag.*drop/i)).toBeInTheDocument();
  });

  it('should handle file selection', async () => {
    const user = userEvent.setup();
    render(<FileUpload onUpload={mockOnUpload} />);

    const file = new File(['test'], 'test.md', { type: 'text/markdown' });
    const input = screen.getByLabelText(/upload/i);

    await user.upload(input, file);

    expect(mockOnUpload).toHaveBeenCalledWith(file);
  });
});
```

3. **테스트 실행:**

```bash
npm test -- FileUpload.test.tsx
```

---

## TDD 워크플로우

### Red-Green-Refactor

1. **RED: 실패하는 테스트 작성**

```bash
# 테스트 작성
npm test -- your-feature.spec.ts
# 결과: FAIL (예상됨)
```

2. **GREEN: 테스트를 통과하는 최소 코드 작성**

```bash
# 코드 구현 후
npm test -- your-feature.spec.ts
# 결과: PASS
```

3. **REFACTOR: 코드 개선**

```bash
# 리팩토링 후
npm test -- your-feature.spec.ts
# 결과: PASS (여전히 통과해야 함)
```

---

## 자주 사용하는 명령어

### 백엔드

```bash
# 전체 테스트
npm test

# Watch 모드
npm run test:watch

# 커버리지
npm run test:cov

# E2E
npm run test:e2e

# 특정 파일
npm test -- users.service.spec.ts

# 특정 테스트만
npm test -- --testNamePattern="should create user"
```

### 프론트엔드

```bash
# 전체 테스트
npm test

# Watch 모드
npm run test:watch

# 커버리지
npm run test:coverage

# 특정 파일
npm test -- UserCard.test.tsx

# 업데이트 스냅샷
npm test -- -u
```

---

## 문제 해결

### 백엔드

**문제:** `Cannot find module '@/prisma/prisma.service'`

**해결:**
```bash
# tsconfig.json의 paths 설정 확인
# jest.config.js의 moduleNameMapper 확인
```

**문제:** E2E 테스트가 실패함

**해결:**
```bash
# PostgreSQL이 실행 중인지 확인
docker-compose up -d postgres

# Prisma 마이그레이션 실행
npx prisma migrate dev
```

### 프론트엔드

**문제:** `SyntaxError: Cannot use import statement outside a module`

**해결:**
```bash
# jest.config.js에서 transform 설정 확인
# package.json에 "type": "module" 제거
```

**문제:** `Cannot find module '@/components/...'`

**해결:**
```javascript
// jest.config.js에 moduleNameMapper 추가
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

---

## 추가 리소스

- **테스트 템플릿:** `backend/test/templates/`, `frontend/test/templates/`
- **TDD 가이드:** `TEST_GUIDE.md`
- **템플릿 README:** `backend/test/templates/README.md`

### 외부 문서

- [Jest 공식 문서](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Test-Driven Development Guide](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

---

## 테스트 커버리지 목표

- **Services:** 80% 이상
- **Controllers:** 70% 이상
- **Components:** 75% 이상
- **Pages:** 80% 이상

현재 커버리지 확인:
```bash
# 백엔드
cd backend && npm run test:cov

# 프론트엔드
cd frontend && npm run test:coverage
```

---

## CI/CD에서 테스트 실행

GitHub Actions에서 자동으로 테스트가 실행됩니다:

```yaml
# .github/workflows/test.yml (예정)
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Backend Tests
        run: cd backend && npm ci && npm test
      - name: Frontend Tests
        run: cd frontend && npm ci && npm test
```

---

**테스트를 자주 실행하세요!** 🧪

커밋 전에는 항상 테스트를 실행하는 것이 좋습니다:
```bash
# 백엔드
cd backend && npm test

# 프론트엔드
cd frontend && npm test
```
