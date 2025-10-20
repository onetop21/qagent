# Research: Gemini 웹 QA 자동화 도구

**Date**: 2025-10-21
**Feature**: Gemini 웹 QA 자동화 도구
**Phase**: 0 - Outline & Research

## Overview

이 문서는 NextJS, NestJS, PostgreSQL을 사용한 Gemini 웹 QA 자동화 도구 개발을 위한 기술 연구 결과를 정리합니다.

## Technology Stack Decisions

### 1. 프론트엔드: NextJS 14

**Decision**: NextJS 14 with App Router 사용

**Rationale**:
- **Server Components**: 초기 페이지 로드 성능 최적화
- **App Router**: 파일 기반 라우팅으로 구조화된 페이지 관리
- **Built-in Optimizations**: 이미지, 폰트, 스크립트 자동 최적화
- **TypeScript 지원**: 타입 안전성 보장
- **SWR 통합**: 데이터 페칭 및 캐싱 간소화

**Alternatives Considered**:
- **Vite + React**: 빌드 속도는 빠르지만 SSR 설정이 복잡함
- **Create React App**: 더 이상 유지보수되지 않음
- **Remix**: 데이터 로딩은 강력하지만 생태계가 NextJS보다 작음

**Best Practices**:
- Server Components를 기본으로 사용하고 클라이언트 상태가 필요한 경우만 'use client' 지시어 사용
- SWR을 활용한 낙관적 UI 업데이트
- TailwindCSS로 일관된 스타일링

### 2. 백엔드: NestJS 10

**Decision**: NestJS 10 프레임워크 사용

**Rationale**:
- **TypeScript Native**: 프론트엔드와 동일한 언어로 타입 공유
- **Modular Architecture**: 기능별 모듈 분리로 유지보수성 향상
- **Dependency Injection**: 테스트 가능한 코드 작성 용이
- **Built-in Support**: WebSocket, Validation, Logging 등 내장 기능
- **Prisma 통합**: ORM 연동이 간단하고 타입 안전성 보장

**Alternatives Considered**:
- **Express.js**: 가볍지만 구조화 부족, 보일러플레이트 코드 증가
- **Fastify**: 성능은 우수하지만 생태계가 작음
- **Koa.js**: 미들웨어 아키텍처가 유연하지만 기능이 부족함

**Best Practices**:
- 기능별 모듈 분리 (PRD, TestCases, Sessions, Reports)
- DTO(Data Transfer Objects)로 요청/응답 검증
- Interceptor로 공통 로깅 및 에러 처리
- WebSocket Gateway로 실시간 진행 상황 전송

### 3. 데이터베이스: PostgreSQL 15 + Prisma ORM

**Decision**: PostgreSQL 15 + Prisma ORM

**Rationale**:
- **Relational Data**: 테스트 케이스, 세션, 결과 간의 관계가 명확함
- **ACID 보장**: 데이터 무결성 중요 (테스트 결과 신뢰성)
- **JSON Support**: PRD 파싱 결과 등 유연한 데이터 저장 가능
- **Prisma Benefits**:
  - 타입 안전한 쿼리
  - 자동 마이그레이션
  - 직관적인 스키마 정의
  - N+1 쿼리 문제 자동 해결

**Alternatives Considered**:
- **MongoDB**: 스키마 유연성은 좋지만 관계형 데이터 처리가 복잡함
- **MySQL**: PostgreSQL보다 JSON 지원이 약함
- **TypeORM**: Prisma보다 타입 안전성이 낮고 복잡함

**Best Practices**:
- 인덱스 전략: 자주 조회되는 필드 (session_id, created_at)에 인덱스 추가
- 정기 삭제: 30일 이상 된 데이터 자동 삭제 (cron job)
- Connection Pooling: Prisma의 기본 커넥션 풀 활용

### 4. Gemini API 통합

**Decision**: @google/generative-ai SDK 사용

**Rationale**:
- **공식 SDK**: Google 공식 지원으로 안정성 보장
- **TypeScript 지원**: 타입 정의 포함
- **Streaming 지원**: 대규모 테스트 케이스 생성 시 진행 상황 표시 가능

**Alternatives Considered**:
- **직접 REST API 호출**: SDK가 제공하는 편의 기능 부족
- **LangChain**: 과도한 추상화, 단순 API 호출에는 오버킬

**Best Practices**:
- **Retry Logic**: 지수 백오프(exponential backoff)로 재시도
- **Rate Limiting**: API 호출 제한 준수 (분당 60회)
- **Error Handling**: API 실패 시 기본 테스트 케이스로 폴백
- **Prompt Engineering**:
  - Few-shot learning으로 테스트 케이스 형식 유도
  - 구조화된 출력 요청 (JSON 형식)

### 5. Playwright 통합

**Decision**: Playwright (headless/headed 모드 전환 가능)

**Rationale**:
- **Cross-Browser**: Chromium, Firefox, WebKit 지원
- **Auto-Wait**: 요소가 준비될 때까지 자동 대기
- **Screenshot/Video**: 실패 시 자동 캡처
- **Network Interception**: API 호출 모니터링 가능
- **Trace Viewer**: 디버깅 용이

**Alternatives Considered**:
- **Puppeteer**: Chromium만 지원, API가 제한적
- **Selenium**: 느리고 복잡한 설정
- **Cypress**: 브라우저 내에서 실행되어 제약이 많음

**Best Practices**:
- **Headed 모드**: 사용자가 브라우저 화면을 볼 수 있도록 설정
- **Page Object Model**: 재사용 가능한 페이지 클래스 작성
- **Timeout 설정**: 각 action에 30초, 전체 테스트에 5분 타임아웃
- **Trace 저장**: 실패한 테스트의 trace 파일 자동 저장

### 6. 로그인 정보 암호화

**Decision**: AES-256-GCM 암호화 + 환경 변수 키 관리

**Rationale**:
- **AES-256-GCM**: 업계 표준 암호화 알고리즘, 인증 태그로 무결성 보장
- **환경 변수**: 암호화 키를 코드와 분리하여 관리
- **Node.js crypto 모듈**: 별도 라이브러리 없이 사용 가능

**Alternatives Considered**:
- **bcrypt**: 단방향 해싱으로 복호화 불가능 (테스트 실행 시 필요)
- **외부 시크릿 관리**: AWS Secrets Manager 등은 MVP에 과도한 복잡도

**Best Practices**:
- IV(Initialization Vector) 매번 랜덤 생성
- 암호화된 데이터에 IV와 인증 태그 함께 저장
- 환경 변수로 ENCRYPTION_KEY 관리 (.env 파일, 프로덕션은 시크릿 관리 서비스)

### 7. 실시간 진행 상황 업데이트

**Decision**: WebSocket (Socket.IO)

**Rationale**:
- **양방향 통신**: 서버에서 클라이언트로 푸시 가능
- **NestJS 통합**: @nestjs/websockets 모듈로 간단히 구현
- **자동 재연결**: 연결 끊김 시 자동 복구
- **Room 지원**: 사용자별 격리된 이벤트 전송

**Alternatives Considered**:
- **Server-Sent Events**: 단방향만 지원
- **Polling**: 네트워크 오버헤드가 크고 실시간성 낮음

**Best Practices**:
- **Room 분리**: 각 테스트 세션을 별도 room으로 관리
- **Heartbeat**: 주기적 ping/pong으로 연결 유지
- **에러 처리**: WebSocket 연결 실패 시 폴링으로 폴백

## File Upload & Parsing

### Markdown 파싱

**Decision**: markdown-it 라이브러리 사용

**Rationale**:
- 가벼우면서 확장 가능
- 플러그인 시스템으로 커스터마이징 용이
- CommonMark 표준 준수

**Best Practices**:
- Heading 기반 섹션 파싱
- 테이블 파싱 플러그인 사용

### PDF 파싱

**Decision**: pdf-parse 라이브러리 사용

**Rationale**:
- Pure JavaScript, 별도 바이너리 불필요
- 텍스트 추출에 집중 (이미지 OCR 제외)

**Best Practices**:
- 페이지별 텍스트 추출 후 Gemini API로 구조화
- 대용량 파일은 스트리밍 처리

### Excel/CSV 파싱

**Decision**: xlsx (Excel), papaparse (CSV)

**Rationale**:
- xlsx: 가장 널리 사용되는 Excel 파서
- papaparse: RFC 4180 표준 준수, 스트리밍 지원

**Best Practices**:
- 첫 행을 헤더로 간주
- 헤더명 기반 컬럼 매핑 (testId, description, steps, expected)

## Testing Strategy

### 단위 테스트 (Jest)

**Coverage Goals**: 80% 이상

**Focus Areas**:
- Service 레이어 로직
- 유틸리티 함수
- DTO 검증

**Mocking**:
- Gemini API: mock responses
- Playwright: mock browser interactions
- Prisma: jest-mock-extended 사용

### 통합 테스트 (Supertest + Playwright Test)

**Focus Areas**:
- API 엔드포인트 (Supertest)
- Gemini API 통합 (실제 API 호출, quota 주의)
- Playwright 브라우저 제어

### 계약 테스트

**Tool**: OpenAPI Spec + Supertest

**Focus Areas**:
- Request/Response 스키마 검증
- 엔드포인트 존재 여부 확인

## Performance Optimizations

### 프론트엔드

- **Code Splitting**: 동적 import로 페이지별 번들 분리
- **Image Optimization**: next/image 컴포넌트 사용
- **Caching**: SWR의 stale-while-revalidate 전략

### 백엔드

- **Database Indexing**: 자주 조회되는 필드에 인덱스
- **Query Optimization**: Prisma의 include 최소화
- **Caching**: 테스트 케이스 목록은 Redis 캐싱 (선택적)

## Deployment Considerations

### 개발 환경

- Docker Compose: PostgreSQL, 백엔드, 프론트엔드 컨테이너화
- Hot Reload: 코드 변경 시 자동 재시작

### 프로덕션 환경 (향후)

- **프론트엔드**: Vercel 또는 Docker 컨테이너
- **백엔드**: Docker + Kubernetes 또는 VM
- **데이터베이스**: Managed PostgreSQL (AWS RDS, Google Cloud SQL)

## Security Considerations

- **Input Validation**: class-validator로 모든 입력 검증
- **SQL Injection**: Prisma의 parameterized queries로 방어
- **XSS**: React의 기본 이스케이프 활용
- **CORS**: 특정 도메인만 허용
- **Rate Limiting**: API 엔드포인트별 요청 제한

## Monitoring & Logging

- **Logging**: Winston (구조화된 로그)
- **Error Tracking**: Sentry (선택적)
- **APM**: 프로덕션 환경에서 필요 시 추가

## Summary

모든 기술 선택은 헌법 원칙(테스트 우선, 간결성, 통합 테스팅, 관찰 가능성)과 부합합니다. NextJS + NestJS + PostgreSQL 스택은 타입 안전성, 유지보수성, 확장성을 제공하며, Gemini API와 Playwright 통합으로 핵심 기능을 구현할 수 있습니다.
