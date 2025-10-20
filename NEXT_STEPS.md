# 다음 작업 가이드

**작성일**: 2025-10-21
**현재 상태**: Phase 1, 2 완료 (23/191 작업, 12%)
**다음 단계**: Phase 3 - User Story 1 (MVP) 구현

---

## 🎯 다음 작업: Phase 3 - MVP 구현

### 목표
PRD 업로드 → 테스트 케이스 자동 생성 → 웹 서비스 테스트 실행 → QA 리포트 생성

**전체**: 87개 작업 (T026-T112)

---

## 🚀 즉시 시작하기

### 1단계: 환경 설정 완료 (5분)

```bash
# 1. PostgreSQL 시작
cd /home/onetop21/workspace/QAgent
docker-compose up -d postgres

# 2. 데이터베이스 초기화
cd backend
npx prisma migrate dev --name init

# 3. 백엔드 실행 확인
npm run start:dev
# 브라우저에서 http://localhost:3000/api/health 확인

# 4. 프론트엔드 실행 (새 터미널)
cd ../frontend
npm run dev
# 브라우저에서 http://localhost:3001 확인
```

### 2단계: Gemini API 키 설정

```bash
# backend/.env 파일 수정
GEMINI_API_KEY="실제-Gemini-API-키-입력"
```

### 3단계: 첫 번째 작업 시작 (T026)

**파일 위치**: `backend/tests/unit/prd/markdown-parser.spec.ts`

---

## 📝 Phase 3 작업 순서 (TDD 방식)

### Week 1: PRD 모듈 + TestCases 모듈 기초

#### Day 1-2: PRD 파싱 (테스트 → 구현)
```
✅ 우선순위: 높음
□ T026 [테스트] PRD 파서 단위 테스트
  파일: backend/tests/unit/prd/markdown-parser.spec.ts
  파일: backend/tests/unit/prd/pdf-parser.spec.ts

□ T027 [테스트] PrdService 단위 테스트
  파일: backend/tests/unit/prd/prd.service.spec.ts

□ T033 [테스트] PRD 엔드포인트 계약 테스트
  파일: backend/tests/contract/prd.contract.spec.ts

□ T043 [구현] Markdown 파서 구현
  파일: backend/src/modules/prd/utils/markdown-parser.ts

□ T044 [구현] PDF 파서 구현
  파일: backend/src/modules/prd/utils/pdf-parser.ts
  npm install pdf-parse markdown-it

□ T040-T042 [구현] PRD DTOs
  파일: backend/src/modules/prd/dto/create-prd.dto.ts
  파일: backend/src/modules/prd/dto/prd-response.dto.ts

□ T045 [구현] PrdService
  파일: backend/src/modules/prd/prd.service.ts

□ T046-T048 [구현] PRD Controller & Module
  파일: backend/src/modules/prd/prd.controller.ts
  파일: backend/src/modules/prd/prd.module.ts
```

#### Day 3-4: TestCases 모듈 (Gemini 통합)
```
□ T028 [테스트] GeminiService 단위 테스트
  파일: backend/tests/unit/testcases/gemini.service.spec.ts

□ T029 [테스트] TestCasesService 단위 테스트
  파일: backend/tests/unit/testcases/testcases.service.spec.ts

□ T034 [테스트] TestCases 엔드포인트 계약 테스트
  파일: backend/tests/contract/testcases.contract.spec.ts

□ T051 [구현] TestCase DTOs
  파일: backend/src/modules/testcases/dto/testcase.dto.ts

□ T052 [구현] Gemini API 클라이언트
  파일: backend/src/modules/testcases/gemini.service.ts

□ T053 [구현] 테스트 케이스 생성 로직
  파일: backend/src/modules/testcases/testcases.service.ts

□ T054-T055 [구현] Controller & Module
  파일: backend/src/modules/testcases/testcases.controller.ts
  파일: backend/src/modules/testcases/testcases.module.ts
```

#### Day 5: E2E 테스트
```
□ T038 [테스트] PRD → 테스트케이스 워크플로우
  파일: backend/tests/integration/prd-to-testcases.spec.ts
```

---

### Week 2: WebServices + Sessions 모듈

#### Day 1: WebServices 모듈
```
□ T035 [테스트] WebServices 계약 테스트
  파일: backend/tests/contract/webservices.contract.spec.ts

□ T040 [구현] WebService DTOs
  파일: backend/src/modules/webservices/dto/webservice.dto.ts

□ T041 [구현] WebServicesService (암호화 통합)
  파일: backend/src/modules/webservices/webservices.service.ts
  # AuthService 주입하여 loginUsername/Password 암호화

□ T042-T043 [구현] Controller & Module
  파일: backend/src/modules/webservices/webservices.controller.ts
  파일: backend/src/modules/webservices/webservices.module.ts
```

#### Day 2-4: Sessions 모듈 (Playwright 통합) ⭐ 핵심
```
□ T030 [테스트] PlaywrightService 단위 테스트
  파일: backend/tests/unit/sessions/playwright.service.spec.ts

□ T031 [테스트] SessionsService 단위 테스트
  파일: backend/tests/unit/sessions/sessions.service.spec.ts

□ T036 [테스트] Sessions 계약 테스트
  파일: backend/tests/contract/sessions.contract.spec.ts

□ T046 [구현] Session DTOs
  파일: backend/src/modules/sessions/dto/session.dto.ts

□ T047-T050 [구현] PlaywrightService
  파일: backend/src/modules/sessions/playwright.service.ts
  # Playwright 브라우저 제어
  # 로그인 자동화
  # 테스트 실행 (30초 타임아웃)
  # 스크린샷 캡처

□ T051-T052 [구현] SessionsService
  파일: backend/src/modules/sessions/sessions.service.ts
  # 단일 세션 제어 (FR-021, FR-022)
  # 테스트 오케스트레이션

□ T053-T055 [구현] Controller & Module
  파일: backend/src/modules/sessions/sessions.controller.ts
  파일: backend/src/modules/sessions/sessions.module.ts
```

#### Day 5: Reports 모듈
```
□ T032 [테스트] ReportsService 단위 테스트
  파일: backend/tests/unit/reports/reports.service.spec.ts

□ T037 [테스트] Reports 계약 테스트
  파일: backend/tests/contract/reports.contract.spec.ts

□ T057 [구현] Report DTOs
  파일: backend/src/modules/reports/dto/report.dto.ts

□ T058 [구현] ReportsService
  파일: backend/src/modules/reports/reports.service.ts

□ T059-T060 [구현] Controller & Module
  파일: backend/src/modules/reports/reports.controller.ts
  파일: backend/src/modules/reports/reports.module.ts
```

---

### Week 3: 프론트엔드 페이지

#### Day 1: PRD 업로드 페이지
```
□ T063-T067 [구현] PRD 업로드
  파일: frontend/src/app/prd/page.tsx
  파일: frontend/src/components/prd/FileUpload.tsx
  # 파일 업로드 UI
  # Markdown/PDF 검증
  # 생성된 테스트 케이스 표시
```

#### Day 2: 테스트 케이스 목록
```
□ T068-T071 [구현] 테스트 케이스 목록
  파일: frontend/src/app/testcases/page.tsx
  파일: frontend/src/components/testcases/TestCaseCard.tsx
  # SWR로 데이터 페칭
  # 체크박스 선택
```

#### Day 3: 웹 서비스 설정
```
□ T072-T075 [구현] 웹 서비스 설정
  파일: frontend/src/app/webservices/page.tsx
  파일: frontend/src/components/webservices/WebServiceForm.tsx
  # URL, 로그인 정보 입력
  # 폼 검증
```

#### Day 4: 테스트 실행
```
□ T076-T079 [구현] 테스트 실행
  파일: frontend/src/app/sessions/page.tsx
  파일: frontend/src/components/sessions/RunTestButton.tsx
  # 테스트 시작
  # 활성 세션 충돌 처리
```

#### Day 5: QA 리포트
```
□ T080-T084 [구현] QA 리포트
  파일: frontend/src/app/reports/[sessionId]/page.tsx
  파일: frontend/src/components/reports/ReportSummary.tsx
  파일: frontend/src/components/reports/FailedTestsDetail.tsx
  # 리포트 요약
  # 실패 테스트 상세
  # 스크린샷 표시
```

---

### Week 4: 완성 및 테스트

#### Day 1-2: 에러 처리 & 데이터 정리
```
□ T085-T087 [구현] Gemini API 재시도 로직
  파일: backend/src/modules/testcases/gemini.service.ts (수정)
  # 지수 백오프 재시도
  # 기본 테스트 케이스로 폴백
  # 프론트엔드 경고 표시

□ T061-T062 [구현] 데이터 정리 Cron Job
  파일: backend/src/modules/sessions/sessions.cleanup.service.ts
  # 30일 이상 세션 자동 삭제
  # Sessions Module에 등록
```

#### Day 3: E2E 통합 테스트
```
□ T039 [테스트] 테스트 실행 → 리포트 워크플로우
  파일: backend/tests/integration/execution-to-report.spec.ts
```

#### Day 4-5: 전체 테스트 및 버그 수정
```
□ 모든 테스트 실행 및 통과 확인
□ 성능 테스트 (50개 테스트 케이스)
□ 버그 수정
□ tasks.md 체크마크 업데이트
```

---

## 📋 작업별 체크리스트 (tasks.md 업데이트)

tasks.md 파일에서 완료된 작업을 `[X]`로 표시하세요:

```bash
# 예시
- [X] T026 PRD 파서 단위 테스트 작성
- [X] T043 Markdown 파서 구현
```

---

## 🔧 필요한 추가 패키지

작업 중 설치해야 할 패키지들:

```bash
# 백엔드
cd backend
npm install pdf-parse markdown-it @nestjs/schedule  # PDF, Markdown 파서, Cron
npm install --save-dev @types/pdf-parse @types/markdown-it

# 프론트엔드 (필요시)
cd frontend
npm install react-dropzone  # 파일 업로드 UI
```

---

## 📊 진행 상황 추적

### tasks.md 업데이트
- 완료된 작업: `- [X] T026 ...`
- 진행 중: `- [진행중] T027 ...` (선택사항)

### IMPLEMENTATION_STATUS.md 업데이트
- Phase 3 진행 상황 기록
- 발견된 이슈 기록

---

## 🎯 Phase 3 완료 기준

다음이 모두 가능해야 Phase 3 완료:

1. ✅ PRD 파일 (Markdown 또는 PDF) 업로드
2. ✅ Gemini AI로 테스트 케이스 자동 생성
3. ✅ 웹 서비스 URL 및 로그인 정보 입력
4. ✅ 선택한 테스트 케이스로 테스트 실행
5. ✅ 브라우저에서 Playwright 테스트 실행 확인
6. ✅ 성공/실패 테스트 결과가 포함된 QA 리포트 확인
7. ✅ 실패한 테스트의 스크린샷 확인
8. ✅ 모든 단위/계약/통합 테스트 통과

---

## 💡 개발 팁

### TDD 워크플로우
```bash
# 1. 테스트 작성
npm run test -- prd.service.spec.ts

# 2. 실패 확인 (Red)
# Expected: FAIL

# 3. 구현
# prd.service.ts 작성

# 4. 성공 확인 (Green)
npm run test -- prd.service.spec.ts
# Expected: PASS

# 5. 리팩토링
# 코드 개선

# 6. 전체 테스트 확인
npm run test
```

### 디버깅
```bash
# 백엔드 디버깅
npm run start:debug

# 프론트엔드 디버깅
npm run dev
# Chrome DevTools 사용

# Playwright 디버깅
PWDEBUG=1 npm run test:e2e
```

---

## 📚 참고 문서

- **작업 목록**: `specs/001-gemini-web-qa-tool/tasks.md`
- **데이터 모델**: `specs/001-gemini-web-qa-tool/data-model.md`
- **API 계약**: `specs/001-gemini-web-qa-tool/contracts/`
- **구현 상태**: `IMPLEMENTATION_STATUS.md`
- **빠른 시작**: `specs/001-gemini-web-qa-tool/quickstart.md`

---

## ✅ 시작 전 체크리스트

- [ ] PostgreSQL 실행 중 (`docker-compose ps`)
- [ ] Gemini API 키 설정 완료
- [ ] 백엔드 서버 정상 실행 (`http://localhost:3000/api/health`)
- [ ] 프론트엔드 서버 정상 실행 (`http://localhost:3001`)
- [ ] Git branch 확인 (`001-gemini-web-qa-tool`)

**모두 확인되면 T026부터 시작하세요!**

---

**마지막 업데이트**: 2025-10-21
**다음 업데이트 예정**: Phase 3 완료 시
