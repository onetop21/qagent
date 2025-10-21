# Gemini Web QA Tool

Gemini AI와 Playwright를 활용한 자동화된 웹 서비스 QA 테스팅 도구

## 주요 기능

- 📝 **PRD 기반 테스트 생성**: Markdown/PDF PRD를 업로드하면 Gemini AI가 자동으로 테스트 케이스 생성
- 🤖 **AI 증강 테스트**: 기존 테스트 케이스를 AI가 분석하여 edge case 추가
- 🎭 **Playwright 자동화**: 실제 브라우저에서 테스트 자동 실행
- 📊 **QA 리포트**: 테스트 결과를 자동으로 분석하여 리포트 생성
- 🔒 **안전한 인증 정보 관리**: AES-256-GCM 암호화로 로그인 정보 보호
- ⏰ **30일 데이터 보관**: 자동 데이터 정리로 스토리지 관리

## 빠른 시작

### 1. 자동 실행 (권장)

```bash
./start.sh
```

### 2. 수동 실행

```bash
# 1. PostgreSQL 시작
docker-compose up -d

# 2. 백엔드 실행
cd backend
npm install
npx prisma migrate dev
npm run start:dev

# 3. 프론트엔드 실행 (새 터미널)
cd frontend
npm install
npm run dev
```

### 3. 접속

- **프론트엔드**: http://localhost:3001
- **백엔드 API**: http://localhost:3000/api

## 사전 요구사항

- Node.js 20.x+
- Docker & Docker Compose
- Gemini API Key ([발급받기](https://makersuite.google.com/app/apikey))

## 환경 설정

### 백엔드 (.env)

```bash
cd backend
# .env 파일이 이미 있습니다
# GEMINI_API_KEY만 수정하세요
```

`backend/.env` 파일에서 다음을 수정:

```env
GEMINI_API_KEY="your-actual-api-key-here"
```

### 프론트엔드 (.env.local)

이미 설정되어 있습니다. 변경 불필요.

## 문서

- 📖 [실행 가이드](RUNNING.md) - 상세한 실행 및 설정 방법
- 🧪 [테스트 가이드](TESTING.md) - 테스트 실행 방법
- 📝 [TDD 가이드](TEST_GUIDE.md) - 테스트 주도 개발 워크플로우

## 기술 스택

### 백엔드
- NestJS 10 (Node.js 프레임워크)
- Prisma ORM (PostgreSQL)
- Gemini API (테스트 생성)
- Playwright (브라우저 자동화)
- Winston (로깅)
- WebSocket (실시간 업데이트)

### 프론트엔드
- Next.js 14 (React 프레임워크)
- TypeScript
- TailwindCSS (스타일링)
- SWR (데이터 페칭)
- Socket.IO Client (실시간 통신)

### 데이터베이스
- PostgreSQL 15
- Prisma Schema (7개 모델)

## 프로젝트 구조

```
QAgent/
├── backend/              # NestJS 백엔드
│   ├── src/
│   │   ├── modules/     # 비즈니스 로직 모듈
│   │   │   ├── prd/
│   │   │   ├── testcases/
│   │   │   ├── webservices/
│   │   │   ├── sessions/
│   │   │   └── reports/
│   │   ├── common/      # 공통 유틸리티
│   │   └── prisma/      # Prisma 설정
│   ├── test/
│   │   └── templates/   # 테스트 템플릿
│   └── prisma/
│       └── schema.prisma
├── frontend/            # Next.js 프론트엔드
│   ├── app/            # App Router 페이지
│   │   ├── prd/
│   │   ├── testcases/
│   │   ├── webservices/
│   │   ├── sessions/
│   │   └── reports/
│   └── src/
│       └── components/  # React 컴포넌트
├── shared/             # 공유 타입
└── specs/             # 기능 스펙 및 계획
```

## 개발 워크플로우

### 1. 새 기능 개발

```bash
# 1. 브랜치 생성
git checkout -b feature/new-feature

# 2. 테스트 작성 (TDD)
cd backend
cp test/templates/service.spec.template.ts src/modules/mymodule/myservice.spec.ts
npm test -- myservice.spec.ts

# 3. 코드 구현
# ... 코드 작성 ...

# 4. 테스트 통과 확인
npm test

# 5. 커밋
git add .
git commit -m "feat: Add new feature"
```

### 2. 데이터베이스 스키마 변경

```bash
cd backend

# 1. schema.prisma 수정
# 2. 마이그레이션 생성
npx prisma migrate dev --name add_new_field

# 3. Prisma Client 재생성
npx prisma generate
```

### 3. 테스트 실행

```bash
# 백엔드
cd backend
npm test              # 단위 테스트
npm run test:e2e      # E2E 테스트
npm run test:cov      # 커버리지

# 프론트엔드
cd frontend
npm test              # 컴포넌트 테스트
npm run test:coverage # 커버리지
```

## 사용 방법

### 1단계: PRD 업로드
- http://localhost:3001/prd 접속
- Markdown 또는 PDF PRD 업로드
- Gemini AI가 자동으로 테스트 케이스 생성 (5-10개)

### 2단계: 테스트 케이스 확인
- http://localhost:3001/testcases 접속
- 생성된 테스트 케이스 확인
- 필요시 AI 증강으로 edge case 추가

### 3단계: 웹 서비스 설정
- http://localhost:3001/webservices 접속
- 테스트할 웹 서비스 URL 및 로그인 정보 입력
- 암호화되어 안전하게 저장

### 4단계: 테스트 실행
- http://localhost:3001/sessions 접속
- 웹 서비스 선택
- 실행할 테스트 케이스 선택
- "Start Test Session" 클릭
- 실시간으로 진행 상황 확인

### 5단계: 리포트 확인
- 테스트 완료 후 자동으로 리포트 페이지로 이동
- 성공률, 실패 원인, 스크린샷 확인

## 문제 해결

### Docker 연결 안 됨
```bash
# WSL2에서 Docker Desktop 통합 활성화
# Settings > Resources > WSL Integration > Ubuntu 활성화
# 또는 PostgreSQL 직접 설치
```

### 포트 충돌
```bash
# 3000 포트 사용 중인 프로세스 확인
lsof -i :3000
# 종료 후 재시작
```

### 마이그레이션 오류
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
```

자세한 문제 해결은 [RUNNING.md](RUNNING.md) 참조

## 애플리케이션 종료

```bash
./stop.sh
```

또는:

```bash
# Ctrl+C로 프로세스 종료
# Docker 컨테이너 종료
docker-compose down
```

## 개발 상태

현재 MVP (Phase 3 - User Story 1) 완료:
- ✅ PRD 업로드 및 파싱
- ✅ Gemini AI 테스트 생성
- ✅ 웹 서비스 설정
- ✅ Playwright 테스트 실행
- ✅ QA 리포트 생성
- ✅ 30일 데이터 보관

다음 단계 (Phase 4-7):
- ⏳ AI 증강 UI
- ⏳ 실시간 모니터링 (WebSocket)
- ⏳ 파일 임포트/익스포트
- ⏳ 성능 최적화

## 라이선스

ISC

## 기여

이슈 및 PR 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 연락처

프로젝트 링크: https://github.com/onetop21/qagent
