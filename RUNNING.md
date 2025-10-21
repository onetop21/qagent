# 애플리케이션 실행 가이드

이 문서는 Gemini Web QA Tool을 로컬 환경에서 실행하는 방법을 설명합니다.

## 목차
1. [사전 요구사항](#사전-요구사항)
2. [빠른 시작](#빠른-시작)
3. [단계별 설정](#단계별-설정)
4. [문제 해결](#문제-해결)

---

## 사전 요구사항

다음 소프트웨어가 설치되어 있어야 합니다:

- **Node.js** 20.x 이상
- **npm** 또는 **yarn**
- **Docker** 및 **Docker Compose** (PostgreSQL용)
- **Gemini API Key** ([Google AI Studio](https://makersuite.google.com/app/apikey)에서 발급)

---

## 빠른 시작

### 1. 데이터베이스 실행

```bash
# 프로젝트 루트에서
docker-compose up -d
```

PostgreSQL이 포트 5432에서 실행됩니다.

### 2. 백엔드 실행

```bash
cd backend

# 의존성 설치 (처음 한 번만)
npm install

# Prisma 마이그레이션 (처음 한 번만)
npx prisma migrate dev

# 백엔드 실행
npm run start:dev
```

백엔드가 http://localhost:3000 에서 실행됩니다.

### 3. 프론트엔드 실행

**새 터미널 창을 열고:**

```bash
cd frontend

# 의존성 설치 (처음 한 번만)
npm install

# 프론트엔드 실행
npm run dev
```

프론트엔드가 http://localhost:3001 에서 실행됩니다.

### 4. 브라우저에서 접속

```
http://localhost:3001
```

---

## 단계별 설정

### Step 1: 환경 변수 설정

#### 백엔드 (.env)

`backend/.env` 파일이 이미 생성되어 있습니다. **Gemini API Key만 설정하면 됩니다:**

```bash
cd backend
```

`.env` 파일을 열고 다음 값을 수정:

```env
# Gemini API Key 설정 (필수!)
GEMINI_API_KEY="실제-API-키를-여기에-입력"
```

**Gemini API Key 발급 방법:**
1. https://makersuite.google.com/app/apikey 접속
2. Google 계정으로 로그인
3. "Create API Key" 클릭
4. 생성된 키를 복사하여 `.env`에 붙여넣기

#### 프론트엔드 (.env.local)

이미 설정되어 있습니다. 변경할 필요 없습니다:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Step 2: PostgreSQL 데이터베이스 실행

```bash
# 프로젝트 루트에서
docker-compose up -d
```

**확인:**
```bash
docker-compose ps
```

다음과 같이 표시되면 정상:
```
NAME                  IMAGE         STATUS
qagent-postgres-1    postgres:15   Up
```

**데이터베이스 접속 정보:**
- Host: localhost
- Port: 5432
- Database: qagent_db
- Username: qagent
- Password: qagent_dev

### Step 3: 백엔드 설정 및 실행

```bash
cd backend

# 1. 의존성 설치
npm install

# 2. Prisma Client 생성
npx prisma generate

# 3. 데이터베이스 마이그레이션
npx prisma migrate dev

# 4. 백엔드 실행 (개발 모드)
npm run start:dev
```

**성공 메시지:**
```
[Nest] INFO  Application is running on: http://localhost:3000
```

**API 엔드포인트 확인:**
- PRDs: http://localhost:3000/api/prds
- Test Cases: http://localhost:3000/api/test-cases
- Web Services: http://localhost:3000/api/web-services
- Sessions: http://localhost:3000/api/sessions
- Reports: http://localhost:3000/api/reports

### Step 4: 프론트엔드 설정 및 실행

**새 터미널 창 열기**

```bash
cd frontend

# 1. 의존성 설치
npm install

# 2. 프론트엔드 실행 (개발 모드)
npm run dev
```

**성공 메시지:**
```
- ready started server on 0.0.0.0:3001, url: http://localhost:3001
```

**접속:**
브라우저에서 http://localhost:3001 열기

---

## 개발 모드 명령어

### 백엔드

```bash
cd backend

# 개발 모드 (자동 재시작)
npm run start:dev

# 일반 실행
npm run start

# 디버그 모드
npm run start:debug

# 프로덕션 빌드
npm run build
npm run start:prod
```

### 프론트엔드

```bash
cd frontend

# 개발 모드 (Hot Reload)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm run start
```

### 데이터베이스

```bash
# 시작
docker-compose up -d

# 중지
docker-compose down

# 중지 및 데이터 삭제
docker-compose down -v

# 로그 확인
docker-compose logs -f postgres
```

---

## Prisma 유틸리티

```bash
cd backend

# Prisma Studio (데이터베이스 GUI)
npx prisma studio
# http://localhost:5555 에서 열림

# 마이그레이션 생성
npx prisma migrate dev --name migration-name

# 마이그레이션 적용 (프로덕션)
npx prisma migrate deploy

# 데이터베이스 리셋 (개발용)
npx prisma migrate reset

# Prisma Client 재생성
npx prisma generate
```

---

## 전체 실행 스크립트

한 번에 모든 것을 실행하려면:

```bash
# 1. 터미널 1: PostgreSQL
docker-compose up

# 2. 터미널 2: 백엔드
cd backend && npm run start:dev

# 3. 터미널 3: 프론트엔드
cd frontend && npm run dev
```

또는 tmux/screen 사용:

```bash
# tmux 설치
sudo apt-get install tmux

# 새 세션 생성
tmux new -s qagent

# 창 분할 (Ctrl+B 후 %)
# 각 창에서 실행:
# 창 1: docker-compose up
# 창 2: cd backend && npm run start:dev
# 창 3: cd frontend && npm run dev
```

---

## 문제 해결

### 1. PostgreSQL 연결 실패

**증상:**
```
Error: Can't reach database server at localhost:5432
```

**해결:**
```bash
# Docker가 실행 중인지 확인
docker ps

# PostgreSQL 컨테이너 확인
docker-compose ps

# PostgreSQL 재시작
docker-compose restart postgres

# 로그 확인
docker-compose logs postgres
```

### 2. 포트 충돌

**증상:**
```
Error: Port 3000 is already in use
```

**해결:**
```bash
# 포트 사용 확인
lsof -i :3000
# 또는
netstat -tulpn | grep 3000

# 프로세스 종료
kill -9 <PID>

# 또는 .env에서 포트 변경
PORT=3002
```

### 3. Prisma 마이그레이션 오류

**증상:**
```
Error: P1001: Can't reach database server
```

**해결:**
```bash
# 데이터베이스 연결 확인
cd backend
npx prisma db push

# 마이그레이션 리셋
npx prisma migrate reset

# 다시 마이그레이션
npx prisma migrate dev
```

### 4. 백엔드 의존성 오류

**증상:**
```
Error: Cannot find module '@nestjs/core'
```

**해결:**
```bash
cd backend

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install

# Prisma 재생성
npx prisma generate
```

### 5. 프론트엔드 빌드 오류

**증상:**
```
Error: Module not found
```

**해결:**
```bash
cd frontend

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json .next
npm install
```

### 6. Gemini API 오류

**증상:**
```
Error: Invalid API key
```

**해결:**
```bash
# backend/.env 파일 확인
cd backend
cat .env | grep GEMINI_API_KEY

# API 키가 올바른지 확인
# https://makersuite.google.com/app/apikey 에서 재발급
```

### 7. CORS 오류

**증상:**
```
Access to fetch at 'http://localhost:3000/api/...' has been blocked by CORS
```

**해결:**
```bash
# backend/.env 확인
CORS_ORIGIN="http://localhost:3001"

# 백엔드 재시작
```

---

## 개발 워크플로우

### 새로운 기능 개발 시

1. **데이터베이스 스키마 변경**
   ```bash
   # backend/prisma/schema.prisma 수정 후
   cd backend
   npx prisma migrate dev --name add-new-feature
   ```

2. **백엔드 코드 작성**
   ```bash
   # Watch 모드로 실행 중이면 자동 재시작됨
   npm run start:dev
   ```

3. **프론트엔드 코드 작성**
   ```bash
   # Hot Reload로 자동 반영됨
   npm run dev
   ```

4. **테스트 실행**
   ```bash
   # 백엔드
   cd backend && npm test

   # 프론트엔드
   cd frontend && npm test
   ```

### 데이터베이스 초기화

개발 중 데이터베이스를 깨끗하게 초기화하고 싶을 때:

```bash
cd backend

# 모든 데이터 삭제 및 재마이그레이션
npx prisma migrate reset

# 또는 Docker 볼륨까지 삭제
docker-compose down -v
docker-compose up -d
npx prisma migrate dev
```

---

## 프로덕션 배포

### 백엔드

```bash
cd backend

# 환경 변수 설정 (.env.production)
DATABASE_URL="production-database-url"
GEMINI_API_KEY="production-api-key"
NODE_ENV=production

# 빌드
npm run build

# 마이그레이션 (한 번만)
npx prisma migrate deploy

# 실행
npm run start:prod
```

### 프론트엔드

```bash
cd frontend

# 환경 변수 설정 (.env.production)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api

# 빌드
npm run build

# 실행
npm run start
```

---

## 유용한 링크

- **백엔드 API**: http://localhost:3000/api
- **프론트엔드**: http://localhost:3001
- **Prisma Studio**: http://localhost:5555 (npx prisma studio 실행 시)
- **PostgreSQL**: localhost:5432

---

## 다음 단계

애플리케이션이 실행되었다면:

1. **PRD 업로드**: http://localhost:3001/prd
2. **테스트 케이스 확인**: http://localhost:3001/testcases
3. **웹 서비스 설정**: http://localhost:3001/webservices
4. **테스트 세션 실행**: http://localhost:3001/sessions
5. **리포트 확인**: 세션 완료 후 자동으로 생성됨

---

**문제가 있나요?**
- 이슈: https://github.com/onetop21/qagent/issues
- 테스트 가이드: `TESTING.md`
- TDD 가이드: `TEST_GUIDE.md`
