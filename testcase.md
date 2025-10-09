# 웹서비스 QA 테스트 케이스: MCP Hub Router

| ID | 기능 분류 | 테스트 항목 | 실행 절차 | 예상 결과 | 결과 (Pass/Fail/Blocked) | 비고 (실패 시 상세 내용) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [TC-001] | 사용자 관리 | 유효한 정보로 회원가입 | 1. `/api/users/register` 엔드포인트로 POST 요청<br>2. Request Body: `{ "email": "test@example.com", "username": "testuser", "password": "password123" }` | `201 Created` 응답을 받는다. | | |
| [TC-002] | 사용자 관리 | 중복된 이메일로 회원가입 | 1. `/api/users/register` 엔드포인트로 POST 요청<br>2. Request Body: `{ "email": "test@example.com", "username": "newuser", "password": "password123" }` | `409 Conflict` 응답과 함께 "이미 존재하는 이메일입니다." 메시지를 받는다. | | |
| [TC-003] | 사용자 관리 | 짧은 비밀번호로 회원가입 | 1. `/api/users/register` 엔드포인트로 POST 요청<br>2. Request Body: `{ "email": "shortpw@example.com", "username": "shortpw", "password": "pw" }` | `400 Bad Request` 응답과 함께 "비밀번호는 6자 이상이어야 합니다." 메시지를 받는다. | | |
| [TC-004] | 사용자 관리 | 유효한 정보로 로그인 | 1. `/api/users/login` 엔드포인트로 POST 요청<br>2. Request Body: `{ "email": "test@example.com", "password": "password123" }` | `200 OK` 응답과 함께 JWT 토큰 정보를 받는다. (`{ userId, username, token, expiresAt }`) | | |
| [TC-005] | 사용자 관리 | 유효하지 않은 비밀번호로 로그인 | 1. `/api/users/login` 엔드포인트로 POST 요청<br>2. Request Body: `{ "email": "test@example.com", "password": "wrongpassword" }` | `401 Unauthorized` 응답을 받는다. | | |
| [TC-006] | 인증/권한 | 유효한 토큰으로 보호된 API 접근 | 1. 로그인하여 JWT 토큰 획득<br>2. `/api/users/me` 엔드포인트로 GET 요청<br>3. `Authorization: Bearer <JWT>` 헤더 포함 | `200 OK` 응답과 함께 사용자 정보를 받는다. | | |
| [TC-007] | 인증/권한 | 유효하지 않은 토큰으로 보호된 API 접근 | 1. `/api/users/me` 엔드포인트로 GET 요청<br>2. `Authorization: Bearer <INVALID_JWT>` 헤더 포함 | `401 Unauthorized` 응답을 받는다. | | |
| [TC-008] | 인증/권한 | 토큰 없이 보호된 API 접근 | 1. `/api/users/me` 엔드포인트로 GET 요청 | `401 Unauthorized` 응답을 받는다. | | |
| [TC-009] | 서버 관리 | 새로운 서버 등록 | 1. 로그인하여 JWT 토큰 획득<br>2. `/api/servers` 엔드포인트로 POST 요청<br>3. Request Body: `{ "name": "My Test Server", "protocol": "stdio", "config": { "command": "my-cli" } }` | `201 Created` 응답과 함께 생성된 서버 정보를 받는다. | | |
| [TC-010] | 서버 관리 | 등록된 서버 목록 조회 | 1. 로그인하여 JWT 토큰 획득<br>2. `/api/servers` 엔드포인트로 GET 요청 | `200 OK` 응답과 함께 서버 목록 배열을 받는다. | | |
| [TC-011] | 서버 관리 | 특정 서버 정보 조회 | 1. 로그인 및 서버 등록 후 `serverId` 획득<br>2. `/api/servers/:serverId` 엔드포인트로 GET 요청 | `200 OK` 응답과 함께 해당 서버의 상세 정보를 받는다. | | |
| [TC-012] | 서버 관리 | 서버 정보 수정 | 1. 로그인 및 서버 등록 후 `serverId` 획득<br>2. `/api/servers/:serverId` 엔드포인트로 PUT 요청<br>3. Request Body: `{ "name": "Updated Server Name" }` | `200 OK` 응답과 함께 수정된 서버 정보를 받는다. | | |
| [TC-013] | 서버 관리 | 서버 삭제 | 1. 로그인 및 서버 등록 후 `serverId` 획득<br>2. `/api/servers/:serverId` 엔드포인트로 DELETE 요청 | `204 No Content` 응답을 받는다. | | |
| [TC-014] | 서버 관리 | 존재하지 않는 서버 조회 | 1. 로그인하여 JWT 토큰 획득<br>2. `/api/servers/invalid-server-id` 엔드포인트로 GET 요청 | `404 Not Found` 응답을 받는다. | | |
| [TC-015] | 라우팅 규칙 | 라우팅 규칙 조회 | 1. 로그인 및 그룹 생성 후 `groupId` 획득<br>2. `/api/groups/:groupId/routing-rules` 엔드포인트로 GET 요청 | `200 OK` 응답과 함께 해당 그룹의 라우팅 규칙 목록을 받는다. (초기에는 비어있음) | | |
| [TC-016] | 라우팅 규칙 | 라우팅 규칙 수정(생성) | 1. 로그인 및 그룹/서버 생성 후 `groupId`, `serverId` 획득<br>2. `/api/groups/:groupId/routing-rules` 엔드포인트로 PUT 요청<br>3. Request Body: `[{ "condition": { "toolName": "my-tool" }, "targetServerId": "...", "priority": 1, "enabled": true }]` | `200 OK` 응답과 함께 수정된 라우팅 규칙 정보를 받는다. | | |
| [TC-017] | 헬스체크 | 서버 헬스체크 | 1. 로그인 및 서버 등록 후 `serverId` 획득<br>2. `/api/servers/:serverId/health` 엔드포인트로 GET 요청 | `200 OK` 응답과 함께 서버 상태 정보를 받는다. (예: `{ "status": "healthy" }`) | | |
| [TC-018] | API 키 | API 키 발급 | 1. 로그인하여 JWT 토큰 획득<br>2. `/api/users/api-keys` 엔드포인트로 POST 요청<br>3. Request Body: `{ "name": "My Test Key" }` | `201 Created` 응답과 함께 생성된 API 키 정보를 받는다. | | |
| [TC-019] | API 키 | API 키 목록 조회 | 1. 로그인 및 API 키 발급 후<br>2. `/api/users/api-keys` 엔드포인트로 GET 요청 | `200 OK` 응답과 함께 API 키 목록 배열을 받는다. | | |
| [TC-020] | API 키 | API 키 폐기 | 1. 로그인 및 API 키 발급 후 `keyId` 획득<br>2. `/api/users/api-keys/:keyId` 엔드포인트로 DELETE 요청 | `204 No Content` 응답을 받는다. | | |
