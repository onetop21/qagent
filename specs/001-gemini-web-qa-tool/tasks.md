# Tasks: Gemini 웹 QA 자동화 도구

**Input**: Design documents from `/specs/001-gemini-web-qa-tool/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED per Constitution Principle I (테스트 우선 개발 - 필수). All test tasks follow TDD: write test → verify failure → implement → verify pass. Test tasks are now included based on FR-028, FR-029, FR-030.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions
- Web app structure: `backend/src/`, `frontend/src/`
- Backend modules: `backend/src/modules/[module-name]/`
- Frontend pages: `frontend/src/app/[page]/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure per plan.md

- [X] T001 Create project directory structure (frontend/, backend/, shared/)
- [X] T002 [P] Initialize frontend with NextJS 14, React 18, TailwindCSS, TypeScript in frontend/
- [X] T003 [P] Initialize backend with NestJS 10, Prisma, TypeScript in backend/
- [X] T004 [P] Install Gemini API SDK (@google/generative-ai) in backend/
- [X] T005 [P] Install Playwright in backend/
- [X] T006 [P] Install WebSocket dependencies (@nestjs/websockets, socket.io) in backend/
- [X] T007 [P] Configure ESLint and Prettier for frontend/
- [X] T008 [P] Configure ESLint and Prettier for backend/
- [X] T009 Create shared types directory in shared/types/
- [X] T010 Setup environment configuration (.env template) in backend/ and frontend/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T011 Create Prisma schema from data-model.md in backend/src/prisma/schema.prisma
- [X] T012 Run Prisma migrations to initialize database schema
- [X] T013 Generate Prisma Client
- [X] T014 [P] Create base error handling filter in backend/src/common/filters/http-exception.filter.ts
- [X] T015 [P] Create logging interceptor using Winston in backend/src/common/interceptors/logging.interceptor.ts
- [X] T016 [P] Implement AES-256-GCM encryption service in backend/src/modules/auth/auth.service.ts
- [X] T017 [P] Create DTO validation pipes in backend/src/common/pipes/validation.pipe.ts
- [X] T018 Setup CORS and global middleware in backend/src/main.ts
- [X] T019 [P] Create shared TypeScript types for API contracts in shared/types/api.types.ts
- [X] T020 [P] Create frontend API client utility in frontend/src/lib/api-client.ts
- [X] T021 [P] Setup SWR configuration in frontend/src/lib/swr-config.ts
- [X] T022 Create base layout component in frontend/src/app/layout.tsx
- [X] T023 [P] Setup Jest test infrastructure for backend in backend/jest.config.js
- [ ] T024 [P] Setup Supertest for API contract testing in backend/tests/setup.ts
- [ ] T025 [P] Setup test database configuration in backend/tests/test-db.config.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - PRD 기반 자동 테스트 실행 (Priority: P1) 🎯 MVP

**Goal**: QA 엔지니어는 PRD 문서를 업로드하면, 자동으로 테스트 케이스가 생성되고, 웹 서비스에 대한 QA 테스트가 실행되어 결과 리포트를 받습니다.

**Independent Test**: PRD 문서를 업로드하고, 대상 웹 서비스 URL과 로그인 정보를 입력한 후, "테스트 실행" 버튼을 클릭하면 테스트가 완료되고 리포트가 생성되는지 확인합니다.

### Tests for User Story 1 (TDD - Write First, Verify Fail, Then Implement)

**Unit Tests (FR-028)**:
- [ ] T026 [P] [US1] Write unit tests for PRD parsers (markdown, PDF) in backend/tests/unit/prd/
- [ ] T027 [P] [US1] Write unit tests for PrdService in backend/tests/unit/prd/prd.service.spec.ts
- [ ] T028 [P] [US1] Write unit tests for GeminiService in backend/tests/unit/testcases/gemini.service.spec.ts
- [ ] T029 [P] [US1] Write unit tests for TestCasesService in backend/tests/unit/testcases/testcases.service.spec.ts
- [ ] T030 [P] [US1] Write unit tests for PlaywrightService in backend/tests/unit/sessions/playwright.service.spec.ts
- [ ] T031 [P] [US1] Write unit tests for SessionsService in backend/tests/unit/sessions/sessions.service.spec.ts
- [ ] T032 [P] [US1] Write unit tests for ReportsService in backend/tests/unit/reports/reports.service.spec.ts

**Contract Tests (FR-029)**:
- [ ] T033 [P] [US1] Write contract tests for PRD endpoints in backend/tests/contract/prd.contract.spec.ts
- [ ] T034 [P] [US1] Write contract tests for TestCases endpoints in backend/tests/contract/testcases.contract.spec.ts
- [ ] T035 [P] [US1] Write contract tests for WebServices endpoints in backend/tests/contract/webservices.contract.spec.ts
- [ ] T036 [P] [US1] Write contract tests for Sessions endpoints in backend/tests/contract/sessions.contract.spec.ts
- [ ] T037 [P] [US1] Write contract tests for Reports endpoints in backend/tests/contract/reports.contract.spec.ts

**Integration Tests (FR-030)**:
- [ ] T038 [US1] Write E2E test for PRD upload → test case generation workflow in backend/tests/integration/prd-to-testcases.spec.ts
- [ ] T039 [US1] Write E2E test for test execution → report generation workflow in backend/tests/integration/execution-to-report.spec.ts

### Backend Implementation for User Story 1

#### PRD Module (FR-001, FR-002)

- [ ] T040 [P] [US1] Create Prd entity model (already in Prisma schema, verify)
- [ ] T041 [P] [US1] Create PRD DTOs in backend/src/modules/prd/dto/create-prd.dto.ts
- [ ] T042 [P] [US1] Create PRD response DTOs in backend/src/modules/prd/dto/prd-response.dto.ts
- [ ] T043 [US1] Implement markdown parser utility in backend/src/modules/prd/utils/markdown-parser.ts (verify T026 passes)
- [ ] T044 [US1] Implement PDF parser utility in backend/src/modules/prd/utils/pdf-parser.ts (verify T026 passes)
- [ ] T045 [US1] Implement PrdService with file upload and parsing in backend/src/modules/prd/prd.service.ts (verify T027 passes)
- [ ] T046 [US1] Implement PRD controller with POST /prds endpoint in backend/src/modules/prd/prd.controller.ts (verify T033 passes)
- [ ] T047 [US1] Implement GET /prds and GET /prds/:prdId endpoints in backend/src/modules/prd/prd.controller.ts
- [ ] T048 [US1] Create PRD module and register dependencies in backend/src/modules/prd/prd.module.ts

#### TestCases Module - Basic Generation (FR-002)

- [ ] T049 [P] [US1] Create TestCase entity model (already in Prisma schema, verify)
- [ ] T050 [P] [US1] Create TestStep entity model (already in Prisma schema, verify)
- [ ] T051 [P] [US1] Create TestCase DTOs in backend/src/modules/testcases/dto/testcase.dto.ts
- [ ] T052 [US1] Implement Gemini API client service in backend/src/modules/testcases/gemini.service.ts (verify T028 passes)
- [ ] T053 [US1] Implement basic test case generation from PRD in backend/src/modules/testcases/testcases.service.ts (verify T029 passes)
- [ ] T054 [US1] Implement GET /test-cases endpoint in backend/src/modules/testcases/testcases.controller.ts (verify T034 passes)
- [ ] T055 [US1] Create TestCases module and register dependencies in backend/src/modules/testcases/testcases.module.ts

#### WebServices Module (FR-005, FR-017, FR-018)

- [ ] T039 [P] [US1] Create WebService entity model (already in Prisma schema, verify)
- [ ] T040 [P] [US1] Create WebService DTOs in backend/src/modules/webservices/dto/webservice.dto.ts
- [ ] T041 [US1] Implement WebService CRUD service with encryption in backend/src/modules/webservices/webservices.service.ts
- [ ] T042 [US1] Implement POST /web-services and GET /web-services endpoints in backend/src/modules/webservices/webservices.controller.ts
- [ ] T043 [US1] Create WebServices module in backend/src/modules/webservices/webservices.module.ts

#### Sessions Module - Test Execution (FR-005, FR-006, FR-007, FR-021, FR-022, FR-025, FR-026, FR-027)

- [ ] T044 [P] [US1] Create TestSession entity model (already in Prisma schema, verify)
- [ ] T045 [P] [US1] Create TestResult entity model (already in Prisma schema, verify)
- [ ] T046 [P] [US1] Create Session DTOs in backend/src/modules/sessions/dto/session.dto.ts
- [ ] T047 [US1] Implement Playwright service for browser control in backend/src/modules/sessions/playwright.service.ts
- [ ] T048 [US1] Implement login automation logic in backend/src/modules/sessions/playwright.service.ts
- [ ] T049 [US1] Implement test step execution with 30s timeout in backend/src/modules/sessions/playwright.service.ts
- [ ] T050 [US1] Implement screenshot capture on failure in backend/src/modules/sessions/playwright.service.ts
- [ ] T051 [US1] Implement SessionsService with test execution orchestration in backend/src/modules/sessions/sessions.service.ts
- [ ] T052 [US1] Implement single session enforcement (FR-021, FR-022) in backend/src/modules/sessions/sessions.service.ts
- [ ] T053 [US1] Implement POST /sessions endpoint in backend/src/modules/sessions/sessions.controller.ts
- [ ] T054 [US1] Implement GET /sessions and GET /sessions/:sessionId endpoints in backend/src/modules/sessions/sessions.controller.ts
- [ ] T055 [US1] Create Sessions module in backend/src/modules/sessions/sessions.module.ts

#### Reports Module (FR-008, FR-009)

- [ ] T056 [P] [US1] Create QaReport entity model (already in Prisma schema, verify)
- [ ] T057 [P] [US1] Create Report DTOs in backend/src/modules/reports/dto/report.dto.ts
- [ ] T058 [US1] Implement ReportsService for report generation in backend/src/modules/reports/reports.service.ts
- [ ] T059 [US1] Implement GET /reports/:sessionId endpoint in backend/src/modules/reports/reports.controller.ts
- [ ] T060 [US1] Create Reports module in backend/src/modules/reports/reports.module.ts

#### Data Retention (FR-023, FR-024)

- [ ] T061 [US1] Implement cron job for 30-day data cleanup in backend/src/modules/sessions/sessions.cleanup.service.ts
- [ ] T062 [US1] Register cleanup service in Sessions module

### Frontend Implementation for User Story 1

#### PRD Upload Page

- [ ] T063 [P] [US1] Create PRD upload page in frontend/src/app/prd/page.tsx
- [ ] T064 [P] [US1] Create file upload component in frontend/src/components/prd/FileUpload.tsx
- [ ] T065 [US1] Implement PRD upload API integration using SWR in frontend/src/app/prd/page.tsx
- [ ] T066 [US1] Add validation for file types (Markdown, PDF) in frontend/src/components/prd/FileUpload.tsx
- [ ] T067 [US1] Display generated test cases after PRD upload in frontend/src/app/prd/page.tsx

#### Test Cases List Page

- [ ] T068 [P] [US1] Create test cases list page in frontend/src/app/testcases/page.tsx
- [ ] T069 [P] [US1] Create test case card component in frontend/src/components/testcases/TestCaseCard.tsx
- [ ] T070 [US1] Fetch and display test cases using SWR in frontend/src/app/testcases/page.tsx
- [ ] T071 [US1] Add test case selection checkboxes in frontend/src/components/testcases/TestCaseCard.tsx

#### Web Service Configuration Page

- [ ] T072 [P] [US1] Create web service configuration form in frontend/src/app/webservices/page.tsx
- [ ] T073 [P] [US1] Create form component for URL and login credentials in frontend/src/components/webservices/WebServiceForm.tsx
- [ ] T074 [US1] Implement web service creation API integration in frontend/src/app/webservices/page.tsx
- [ ] T075 [US1] Add form validation for URL format and required fields in frontend/src/components/webservices/WebServiceForm.tsx

#### Test Execution Page

- [ ] T076 [P] [US1] Create test execution page in frontend/src/app/sessions/page.tsx
- [ ] T077 [P] [US1] Create "Run Test" button component in frontend/src/components/sessions/RunTestButton.tsx
- [ ] T078 [US1] Implement test session start API integration in frontend/src/app/sessions/page.tsx
- [ ] T079 [US1] Handle active session conflict (FR-022) in frontend/src/app/sessions/page.tsx

#### QA Report Page

- [ ] T080 [P] [US1] Create QA report page in frontend/src/app/reports/[sessionId]/page.tsx
- [ ] T081 [P] [US1] Create report summary component in frontend/src/components/reports/ReportSummary.tsx
- [ ] T082 [P] [US1] Create failed tests detail component in frontend/src/components/reports/FailedTestsDetail.tsx
- [ ] T083 [US1] Fetch and display report using SWR in frontend/src/app/reports/[sessionId]/page.tsx
- [ ] T084 [US1] Display screenshots for failed tests in frontend/src/components/reports/FailedTestsDetail.tsx

#### Error Handling & Retry Logic (FR-019, FR-020)

- [ ] T085 [US1] Implement Gemini API retry logic with exponential backoff in backend/src/modules/testcases/gemini.service.ts
- [ ] T086 [US1] Add fallback to basic test cases on Gemini API failure in backend/src/modules/testcases/testcases.service.ts
- [ ] T087 [US1] Display warning message to user on API failure in frontend/src/app/testcases/page.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can upload PRD, generate test cases, run tests, and view reports.

---

## Phase 4: User Story 2 - AI 기반 테스트 케이스 증강 및 관리 (Priority: P2)

**Goal**: QA 엔지니어는 기본 테스트 케이스에 AI가 생성한 추가 테스트 케이스와 엣지 케이스를 확인하고, 필요에 따라 수정, 추가, 삭제할 수 있습니다.

**Independent Test**: PRD로부터 생성된 기본 테스트 케이스 목록을 확인하고, "AI 증강" 버튼을 클릭하여 추가 테스트 케이스와 엣지 케이스가 생성되는지, 그리고 이를 편집/삭제할 수 있는지 확인합니다.

### Tests for User Story 2 (TDD - Write First, Verify Fail, Then Implement)

**Unit Tests (FR-028)**:
- [ ] T088 [P] [US2] Write unit tests for AI augmentation logic in backend/tests/unit/testcases/gemini-augment.spec.ts
- [ ] T089 [P] [US2] Write unit tests for edge case generation in backend/tests/unit/testcases/gemini-edge-case.spec.ts
- [ ] T090 [P] [US2] Write unit tests for test case CRUD operations in backend/tests/unit/testcases/testcases-crud.service.spec.ts

**Contract Tests (FR-029)**:
- [ ] T091 [P] [US2] Write contract test for POST /test-cases/augment endpoint in backend/tests/contract/testcases-augment.contract.spec.ts
- [ ] T092 [P] [US2] Write contract tests for CRUD endpoints (POST, PUT, DELETE /test-cases) in backend/tests/contract/testcases-crud.contract.spec.ts

**Integration Tests (FR-030)**:
- [ ] T093 [US2] Write E2E test for AI augmentation workflow in backend/tests/integration/ai-augmentation.spec.ts

### Backend Implementation for User Story 2

#### AI Augmentation (FR-003)

- [ ] T094 [P] [US2] Implement AI augmentation for additional test cases in backend/src/modules/testcases/gemini.service.ts (verify T088 passes)
- [ ] T095 [P] [US2] Implement edge case generation in backend/src/modules/testcases/gemini.service.ts (verify T089 passes)
- [ ] T096 [US2] Implement POST /test-cases/augment endpoint in backend/src/modules/testcases/testcases.controller.ts (verify T091 passes)
- [ ] T097 [US2] Add augmentation type parameter (additional vs edge_case) in backend/src/modules/testcases/dto/augment.dto.ts

#### Test Case CRUD (FR-004)

- [ ] T098 [P] [US2] Implement POST /test-cases endpoint for manual creation in backend/src/modules/testcases/testcases.controller.ts (verify T092 passes)
- [ ] T099 [P] [US2] Implement PUT /test-cases/:testCaseId endpoint for editing in backend/src/modules/testcases/testcases.controller.ts (verify T092 passes)
- [ ] T100 [P] [US2] Implement DELETE /test-cases/:testCaseId endpoint in backend/src/modules/testcases/testcases.controller.ts (verify T092 passes)
- [ ] T101 [US2] Add test case CRUD operations in backend/src/modules/testcases/testcases.service.ts (verify T090 passes)

### Frontend Implementation for User Story 2

#### AI Augmentation UI

- [ ] T102 [P] [US2] Add "AI 증강" button to test cases page in frontend/src/app/testcases/page.tsx
- [ ] T103 [P] [US2] Add "엣지 케이스 생성" button in frontend/src/app/testcases/page.tsx
- [ ] T104 [US2] Implement augmentation API call in frontend/src/app/testcases/page.tsx
- [ ] T105 [US2] Display newly generated test cases with source label in frontend/src/components/testcases/TestCaseCard.tsx
- [ ] T106 [US2] Show loading state during AI generation in frontend/src/app/testcases/page.tsx

#### Test Case CRUD UI

- [ ] T107 [P] [US2] Create test case edit modal component in frontend/src/components/testcases/EditTestCaseModal.tsx
- [ ] T108 [P] [US2] Create test case creation form in frontend/src/components/testcases/CreateTestCaseForm.tsx
- [ ] T109 [US2] Add "편집" button to each test case card in frontend/src/components/testcases/TestCaseCard.tsx
- [ ] T110 [US2] Add "삭제" button to each test case card in frontend/src/components/testcases/TestCaseCard.tsx
- [ ] T111 [US2] Implement edit API integration in frontend/src/components/testcases/EditTestCaseModal.tsx
- [ ] T112 [US2] Implement delete API integration with confirmation in frontend/src/components/testcases/TestCaseCard.tsx
- [ ] T113 [US2] Add "새 테스트 케이스 추가" button in frontend/src/app/testcases/page.tsx
- [ ] T114 [US2] Implement create API integration in frontend/src/components/testcases/CreateTestCaseForm.tsx
- [ ] T115 [US2] Add optimistic updates using SWR mutate in frontend/src/app/testcases/page.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can augment test cases with AI and manage them manually.

---

## Phase 5: User Story 3 - 실시간 테스트 진행 상황 모니터링 (Priority: P3)

**Goal**: QA 엔지니어는 테스트 실행 중 웹 브라우저 화면을 통해 현재 어떤 테스트가 진행 중인지, 각 단계별 실행 상태를 실시간으로 확인할 수 있습니다.

**Independent Test**: 테스트를 실행한 후, 진행 상황 화면에서 현재 실행 중인 테스트 케이스 번호, 진행률, 각 단계의 성공/실패 상태가 실시간으로 표시되는지 확인합니다.

### Tests for User Story 3 (TDD - Write First, Verify Fail, Then Implement)

**Unit Tests (FR-028)**:
- [ ] T116 [P] [US3] Write unit tests for WebSocket event emission logic in backend/tests/unit/sessions/gateway-events.spec.ts
- [ ] T117 [P] [US3] Write unit tests for session cancellation logic in backend/tests/unit/sessions/session-cancel.spec.ts

**Contract Tests (FR-029)**:
- [ ] T118 [P] [US3] Write WebSocket contract tests for join/leave/cancel events in backend/tests/contract/sessions-websocket.contract.spec.ts
- [ ] T119 [P] [US3] Write contract test for DELETE /sessions/:sessionId endpoint in backend/tests/contract/sessions-delete.contract.spec.ts

**Integration Tests (FR-030)**:
- [ ] T120 [US3] Write E2E test for real-time progress update workflow in backend/tests/integration/realtime-progress.spec.ts
- [ ] T121 [US3] Write E2E test for WebSocket event sequence (session-started → test-started → test-completed → session-completed) in backend/tests/integration/websocket-lifecycle.spec.ts

### Backend Implementation for User Story 3

#### WebSocket Gateway (FR-010, FR-011)

- [ ] T122 [P] [US3] Create WebSocket gateway in backend/src/modules/sessions/sessions.gateway.ts
- [ ] T123 [P] [US3] Implement join-session and leave-session handlers in backend/src/modules/sessions/sessions.gateway.ts
- [ ] T124 [P] [US3] Implement cancel-session handler in backend/src/modules/sessions/sessions.gateway.ts (verify T117, T118 pass)
- [ ] T125 [US3] Implement session-started event emission in backend/src/modules/sessions/sessions.gateway.ts (verify T116 passes)
- [ ] T126 [US3] Implement test-started event emission in backend/src/modules/sessions/sessions.gateway.ts (verify T116 passes)
- [ ] T127 [US3] Implement test-step-started event emission in backend/src/modules/sessions/sessions.gateway.ts (verify T116 passes)
- [ ] T128 [US3] Implement test-step-completed event emission in backend/src/modules/sessions/sessions.gateway.ts (verify T116 passes)
- [ ] T129 [US3] Implement test-completed event emission in backend/src/modules/sessions/sessions.gateway.ts (verify T116 passes)
- [ ] T130 [US3] Implement progress-update event emission (every 5 seconds) in backend/src/modules/sessions/sessions.gateway.ts (verify T116 passes)
- [ ] T131 [US3] Implement session-completed event emission in backend/src/modules/sessions/sessions.gateway.ts (verify T116 passes)
- [ ] T132 [US3] Implement error event emission in backend/src/modules/sessions/sessions.gateway.ts (verify T116 passes)
- [ ] T133 [US3] Integrate gateway events into SessionsService test execution loop in backend/src/modules/sessions/sessions.service.ts

#### Session Cancellation (FR-014)

- [ ] T134 [US3] Implement DELETE /sessions/:sessionId endpoint in backend/src/modules/sessions/sessions.controller.ts (verify T119 passes)
- [ ] T135 [US3] Add session cancellation logic in backend/src/modules/sessions/sessions.service.ts (verify T117 passes)
- [ ] T136 [US3] Update session status to "cancelled" and stop test execution in backend/src/modules/sessions/sessions.service.ts

### Frontend Implementation for User Story 3

#### Real-time Progress UI

- [ ] T137 [P] [US3] Create WebSocket hook in frontend/src/hooks/useTestSession.ts
- [ ] T138 [P] [US3] Create progress bar component in frontend/src/components/sessions/ProgressBar.tsx
- [ ] T139 [P] [US3] Create current test display component in frontend/src/components/sessions/CurrentTest.tsx
- [ ] T140 [P] [US3] Create test step status component in frontend/src/components/sessions/TestStepStatus.tsx
- [ ] T141 [US3] Integrate WebSocket hook into sessions page in frontend/src/app/sessions/[sessionId]/page.tsx
- [ ] T142 [US3] Display overall progress (X/Y tests, percentage) in frontend/src/app/sessions/[sessionId]/page.tsx
- [ ] T143 [US3] Display current test case information in frontend/src/app/sessions/[sessionId]/page.tsx
- [ ] T144 [US3] Display step-by-step execution status in frontend/src/app/sessions/[sessionId]/page.tsx
- [ ] T145 [US3] Show failure message on error events in frontend/src/app/sessions/[sessionId]/page.tsx

#### Browser Display (FR-011)

- [ ] T146 [US3] Add browser screen viewer area in frontend/src/app/sessions/[sessionId]/page.tsx
- [ ] T147 [US3] Display Playwright browser window information in frontend/src/components/sessions/BrowserDisplay.tsx

#### Test Cancellation UI

- [ ] T148 [P] [US3] Add "테스트 중단" button in frontend/src/app/sessions/[sessionId]/page.tsx
- [ ] T149 [US3] Implement cancel session API call in frontend/src/app/sessions/[sessionId]/page.tsx
- [ ] T150 [US3] Show confirmation dialog before cancellation in frontend/src/components/sessions/CancelConfirmDialog.tsx

**Checkpoint**: All user stories 1, 2, and 3 should now be independently functional. Real-time monitoring enhances the user experience.

---

## Phase 6: User Story 4 - 외부 테스트 케이스 파일 가져오기 및 포맷 변환 (Priority: P4)

**Goal**: QA 엔지니어는 기존에 작성한 테스트 케이스 파일(Excel, CSV, JSON 등)을 도구에 업로드하면, 자동으로 도구의 표준 포맷으로 변환되어 테스트를 실행할 수 있습니다.

**Independent Test**: 기존 Excel 또는 CSV 형식의 테스트 케이스 파일을 업로드하고, 변환된 테스트 케이스가 도구 내에서 정상적으로 표시되고 실행 가능한지 확인합니다.

### Tests for User Story 4 (TDD - Write First, Verify Fail, Then Implement)

**Unit Tests (FR-028)**:
- [ ] T151 [P] [US4] Write unit tests for Excel parser in backend/tests/unit/testcases/excel-parser.spec.ts
- [ ] T152 [P] [US4] Write unit tests for CSV parser in backend/tests/unit/testcases/csv-parser.spec.ts
- [ ] T153 [P] [US4] Write unit tests for JSON parser in backend/tests/unit/testcases/json-parser.spec.ts
- [ ] T154 [P] [US4] Write unit tests for file format detection in backend/tests/unit/testcases/file-format-detection.spec.ts
- [ ] T155 [P] [US4] Write unit tests for column mapping logic in backend/tests/unit/testcases/column-mapping.spec.ts

**Contract Tests (FR-029)**:
- [ ] T156 [P] [US4] Write contract test for POST /test-cases/import endpoint in backend/tests/contract/testcases-import.contract.spec.ts

**Integration Tests (FR-030)**:
- [ ] T157 [US4] Write E2E test for file import workflow (upload → parse → display) in backend/tests/integration/file-import.spec.ts

### Backend Implementation for User Story 4

#### File Import (FR-012, FR-013)

- [ ] T158 [P] [US4] Implement Excel parser utility in backend/src/modules/testcases/utils/excel-parser.ts (verify T151 passes)
- [ ] T159 [P] [US4] Implement CSV parser utility in backend/src/modules/testcases/utils/csv-parser.ts (verify T152 passes)
- [ ] T160 [P] [US4] Implement JSON parser utility in backend/src/modules/testcases/utils/json-parser.ts (verify T153 passes)
- [ ] T161 [US4] Implement file format detection in backend/src/modules/testcases/testcases.service.ts (verify T154 passes)
- [ ] T162 [US4] Implement column mapping logic (testId, description, steps, expected) in backend/src/modules/testcases/testcases.service.ts (verify T155 passes)
- [ ] T163 [US4] Implement POST /test-cases/import endpoint in backend/src/modules/testcases/testcases.controller.ts (verify T156 passes)
- [ ] T164 [US4] Add import validation and error handling in backend/src/modules/testcases/testcases.service.ts

### Frontend Implementation for User Story 4

#### File Import UI

- [ ] T165 [P] [US4] Create import file upload component in frontend/src/components/testcases/ImportTestCases.tsx
- [ ] T166 [P] [US4] Create import preview modal in frontend/src/components/testcases/ImportPreviewModal.tsx
- [ ] T167 [US4] Add "파일 가져오기" button to test cases page in frontend/src/app/testcases/page.tsx
- [ ] T168 [US4] Implement file upload and format detection in frontend/src/components/testcases/ImportTestCases.tsx
- [ ] T169 [US4] Display import preview with column mapping in frontend/src/components/testcases/ImportPreviewModal.tsx
- [ ] T170 [US4] Implement "가져오기 완료" action in frontend/src/components/testcases/ImportPreviewModal.tsx
- [ ] T171 [US4] Add imported test cases to list using SWR mutate in frontend/src/app/testcases/page.tsx

**Checkpoint**: All 4 user stories should now be independently functional. External test case import enables legacy workflow integration.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Missing Features from Analysis

- [ ] T172 [P] Implement test case export functionality - POST /test-cases/export endpoint in backend/src/modules/testcases/testcases.controller.ts (FR-015)
- [ ] T173 [P] Add export format selector (JSON, CSV, Excel) in backend/src/modules/testcases/export.service.ts (FR-015)
- [ ] T174 [P] Create export button and format selector in frontend/src/app/testcases/page.tsx (FR-015)
- [ ] T175 [P] Create test history page with timeline view in frontend/src/app/history/page.tsx (FR-016)
- [ ] T176 [P] Add session comparison feature in frontend/src/components/history/SessionComparison.tsx (FR-016)
- [ ] T177 [US1] Implement access control validation for encrypted credentials in backend/src/modules/webservices/webservices.service.ts (FR-018)

### General Polish

- [ ] T178 [P] Create API documentation page using OpenAPI spec in frontend/src/app/docs/page.tsx
- [ ] T179 [P] Add global error boundary in frontend/src/app/error.tsx
- [ ] T180 [P] Add loading states for all API calls across frontend
- [ ] T181 [P] Add toast notifications for success/error messages in frontend/src/components/common/Toast.tsx
- [ ] T182 [P] Implement pagination for PRD list, session list, and report list
- [ ] T183 [P] Add search and filter functionality for test cases in frontend/src/app/testcases/page.tsx
- [ ] T184 [P] Optimize database queries with proper indexing (verify indexes from data-model.md)
- [ ] T185 [P] Add structured logging for all critical operations - PRD parsing, Gemini API calls, test execution, Playwright actions (Constitution IV - 관찰 가능성)
- [ ] T186 [P] Create Docker Compose setup for PostgreSQL in docker-compose.yml
- [ ] T187 [P] Create development quickstart script based on quickstart.md
- [ ] T188 Run validation against quickstart.md setup instructions
- [ ] T189 [P] Add security headers and rate limiting middleware in backend/src/main.ts
- [ ] T190 Code cleanup and refactoring across all modules
- [ ] T191 Performance testing with 50 test cases (SC-006 validation)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P2): Can start after Foundational - No dependencies on other stories (but naturally builds on US1)
  - User Story 3 (P3): Can start after Foundational - Integrates with US1 session execution
  - User Story 4 (P4): Can start after Foundational - No dependencies on other stories
- **Polish (Phase 7)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on test case infrastructure from US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Enhances US1 test execution with real-time updates
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Adds alternative test case input method

### Within Each User Story

- Backend models before services
- Services before controllers
- Controllers before modules
- Backend APIs before frontend integration
- Frontend components before page integration
- Core implementation before integration with other stories

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Within each user story, tasks marked [P] can run in parallel
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all entity verifications together:
Task: T023 "Verify Prd entity model in Prisma schema"
Task: T032 "Verify TestCase entity model in Prisma schema"
Task: T033 "Verify TestStep entity model in Prisma schema"
Task: T039 "Verify WebService entity model in Prisma schema"
Task: T044 "Verify TestSession entity model in Prisma schema"
Task: T045 "Verify TestResult entity model in Prisma schema"
Task: T056 "Verify QaReport entity model in Prisma schema"

# Launch all DTO creations together:
Task: T024 "Create PRD DTOs"
Task: T034 "Create TestCase DTOs"
Task: T040 "Create WebService DTOs"
Task: T046 "Create Session DTOs"
Task: T057 "Create Report DTOs"

# Launch all frontend component creations together:
Task: T064 "Create file upload component"
Task: T069 "Create test case card component"
Task: T073 "Create form component for web service"
Task: T077 "Create run test button component"
Task: T081 "Create report summary component"
Task: T082 "Create failed tests detail component"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently - full flow from PRD upload to report generation
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - core value!)
3. Add User Story 2 → Test independently → Deploy/Demo (AI augmentation and manual editing)
4. Add User Story 3 → Test independently → Deploy/Demo (real-time monitoring)
5. Add User Story 4 → Test independently → Deploy/Demo (legacy file import)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Backend PRD + TestCases + Sessions + Reports)
   - Developer B: User Story 1 (Frontend pages and components)
   - After US1 complete, Developer A: User Story 2, Developer B: User Story 3
3. Stories complete and integrate independently

---

## Task Summary

- **Total Tasks**: 191 tasks (comprehensive with tests and missing features)
- **Phase 1 (Setup)**: 10 tasks
- **Phase 2 (Foundational)**: 15 tasks (12 original + 3 test infrastructure) - BLOCKING
- **Phase 3 (User Story 1 - P1)**: 87 tasks (14 tests + 73 implementation) - MVP
- **Phase 4 (User Story 2 - P2)**: 28 tasks (6 tests + 22 implementation)
- **Phase 5 (User Story 3 - P3)**: 35 tasks (6 tests + 29 implementation)
- **Phase 6 (User Story 4 - P4)**: 21 tasks (7 tests + 14 implementation)
- **Phase 7 (Polish)**: 20 tasks (6 missing features + 14 general polish)

**MVP Scope**: Phases 1-3 (112 tasks) deliver the complete core workflow with comprehensive testing

**Test Coverage**: ~25% of tasks are tests (33 test tasks out of 191 total) per Constitution Principle I requirement
- Unit Tests: 20 tasks
- Contract Tests: 10 tasks
- Integration/E2E Tests: 6 tasks

**Parallel Opportunities**: Many tasks marked [P] can run in parallel within their phases

**Test Distribution by User Story**:
- US1: 14 test tasks (7 unit, 5 contract, 2 E2E)
- US2: 6 test tasks (3 unit, 2 contract, 1 E2E)
- US3: 6 test tasks (2 unit, 2 contract, 2 E2E)
- US4: 7 test tasks (5 unit, 1 contract, 1 E2E)

---

## Notes

- [P] tasks = different files, no dependencies within the phase
- [Story] label (US1, US2, US3, US4) maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **Tests are REQUIRED** per Constitution Principle I - write tests first, verify failure, then implement
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Follow constitution principles strictly: test-driven development (MUST), simplicity, integration testing, observability
- Test tasks added: Unit tests (FR-028), Contract tests (FR-029), E2E tests (FR-030)
- Missing features added: Export (FR-015), History UI (FR-016), Access control (FR-018)
