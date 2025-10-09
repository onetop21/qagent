# 웹서비스 QA 테스트 케이스: MCP Hub Router

## 사용자 관리
- [ ] [TC-001] 유효한 정보로 회원가입
    - **Test Step:** 1. `/api/users/register` 엔드포인트에 POST 요청<br>2. Body: `{"email": "test@example.com", "username": "testuser", "password": "password123"}`
    - **Expected Result:** 201 Created 응답을 받는다.
- [ ] [TC-002] 이미 존재하는 이메일로 회원가입
    - **Test Step:** 1. `/api/users/register` 엔드포인트에 POST 요청<br>2. Body: `{"email": "test@example.com", "username": "newuser", "password": "password123"}`
    - **Expected Result:** 409 Conflict 또는 유사한 에러 응답과 함께 '이미 존재하는 이메일입니다.' 메시지를 받는다.
- [ ] [TC-003] 짧은 비밀번호로 회원가입 (6자 미만)
    - **Test Step:** 1. `/api/users/register` 엔드포인트에 POST 요청<br>2. Body: `{"email": "shortpw@example.com", "username": "shortpw", "password": "12345"}`
    - **Expected Result:** 400 Bad Request 응답과 함께 '비밀번호는 6자 이상이어야 합니다.' 메시지를 받는다.
- [ ] [TC-004] 유효한 정보로 로그인
    - **Test Step:** 1. `/api/users/login` 엔드포인트에 POST 요청<br>2. Body: `{"email": "test@example.com", "password": "password123"}`
    - **Expected Result:** 200 OK 응답과 함께 `userId`, `username`, `token`, `expiresAt`이 포함된 JSON 객체를 받는다.
- [ ] [TC-005] 유효하지 않은 비밀번호로 로그인
    - **Test Step:** 1. `/api/users/login` 엔드포인트에 POST 요청<br>2. Body: `{"email": "test@example.com", "password": "wrongpassword"}`
    - **Expected Result:** 401 Unauthorized 응답과 함께 '이메일 또는 비밀번호가 올바르지 않습니다.' 메시지를 받는다.

## 인증/권한
- [ ] [TC-006] 인증 토큰 없이 보호된 API 접근
    - **Test Step:** 1. `/api/users/me` 엔드포인트에 `Authorization` 헤더 없이 GET 요청
    - **Expected Result:** 401 Unauthorized 응답을 받는다.
- [ ] [TC-007] 유효한 인증 토큰으로 보호된 API 접근
    - **Test Step:** 1. 로그인하여 JWT 토큰 획득<br>2. `/api/users/me` 엔드포인트에 `Authorization: Bearer <JWT>` 헤더를 포함하여 GET 요청
    - **Expected Result:** 200 OK 응답과 함께 현재 사용자 정보를 받는다.

## 서버 관리
- [ ] [TC-008] 유효한 정보로 서버 등록
    - **Test Step:** 1. 로그인하여 JWT 토큰 획득<br>2. `/api/servers` 엔드포인트에 POST 요청<br>3. Body: `{"name": "My Test Server", "protocol": "http", "config": {"url": "http://localhost:8080"}}`
    - **Expected Result:** 201 Created 응답과 함께 생성된 서버 정보를 받는다.
- [ ] [TC-009] 등록된 서버 목록 조회
    - **Test Step:** 1. 로그인하여 JWT 토큰 획득<br>2. `/api/servers` 엔드포인트에 GET 요청
    - **Expected Result:** 200 OK 응답과 함께 사용자가 등록한 서버 정보 배열을 받는다.
- [ ] [TC-010] 특정 서버 정보 조회
    - **Test Step:** 1. 로그인하여 JWT 토큰 획득 및 서버 등록<br>2. `/api/servers/{serverId}` 엔드포인트에 GET 요청
    - **Expected Result:** 200 OK 응답과 함께 해당 `serverId`의 상세 정보를 받는다.
- [ ] [TC-011] 서버 정보 수정
    - **Test Step:** 1. 로그인하여 JWT 토큰 획득 및 서버 등록<br>2. `/api/servers/{serverId}` 엔드포인트에 PUT 요청<br>3. Body: `{"name": "Updated Server Name"}`
    - **Expected Result:** 200 OK 응답과 함께 수정된 서버 정보를 받는다.
- [ ] [TC-012] 서버 삭제
    - **Test Step:** 1. 로그인하여 JWT 토큰 획득 및 서버 등록<br>2. `/api/servers/{serverId}` 엔드포인트에 DELETE 요청
    - **Expected Result:** 204 No Content 응답을 받는다.
- [ ] [TC-013] 존재하지 않는 서버 조회
    - **Test Step:** 1. 로그인하여 JWT 토큰 획득<br>2. `/api/servers/invalid-server-id` 엔드포인트에 GET 요청
    - **Expected Result:** 404 Not Found 응답을 받는다.

## 라우팅 규칙
- [ ] [TC-014] 라우팅 규칙 조회
    - **Test Step:** 1. 로그인하여 JWT 토큰 획득<br>2. `/api/groups/{groupId}/routing-rules` 엔드포인트에 GET 요청
    - **Expected Result:** 200 OK 응답과 함께 해당 그룹의 라우팅 규칙 배열을 받는다. (초기에는 비어있을 수 있음)
- [ ] [TC-015] 라우팅 규칙 수정 (업데이트)
    - **Test Step:** 1. 로그인하여 JWT 토큰 획득<br>2. `/api/groups/{groupId}/routing-rules` 엔드포인트에 PUT 요청<br>3. Body: `[{"id": "rule1", "condition": {"toolName": "tool_a"}, "targetServerId": "server1", "priority": 100, "enabled": true}]`
    - **Expected Result:** 200 OK 응답과 함께 업데이트된 전체 라우팅 규칙 배열을 받는다.
- [ ] [TC-016] 비정상 형식으로 라우팅 규칙 수정
    - **Test Step:** 1. 로그인하여 JWT 토큰 획득<br>2. `/api/groups/{groupId}/routing-rules` 엔드포인트에 PUT 요청<br>3. Body: `{"invalid": "rule"}` (배열이 아닌 객체)
    - **Expected Result:** 400 Bad Request 응답을 받는다.

## API 키
- [ ] [TC-017] API 키 발급
    - **Test Step:** 1. 로그인하여 JWT 토큰 획득<br>2. `/api/users/api-keys` 엔드포인트에 POST 요청<br>3. Body: `{"name": "My Test Key"}`
    - **Expected Result:** 201 Created 응답과 함께 생성된 API 키 정보를 받는다. (키 값 포함)
- [ ] [TC-018] API 키 목록 조회
    - **Test Step:** 1. 로그인하여 JWT 토큰 획득 및 API 키 생성<br>2. `/api/users/api-keys` 엔드포인트에 GET 요청
    - **Expected Result:** 200 OK 응답과 함께 발급된 API 키 목록 배열을 받는다. (키 값은 마스킹되거나 없을 수 있음)
- [ ] [TC-019] API 키 폐기
    - **Test Step:** 1. 로그인하여 JWT 토큰 획득 및 API 키 생성<br>2. `/api/users/api-keys/{keyId}` 엔드포인트에 DELETE 요청
    - **Expected Result:** 204 No Content 응답을 받는다.

## 일반
- [ ] [TC-020] Health Check 엔드포인트 확인
    - **Test Step:** 1. `/health` 엔드포인트에 GET 요청
    - **Expected Result:** 200 OK 응답과 함께 서비스 상태 정보를 받는다. (예: `{"status": "ok"}`)
- [ ] [TC-021] Swagger API 문서 확인
    - **Test Step:** 1. 웹 브라우저에서 `/api-docs` 경로로 접속
    - **Expected Result:** Swagger UI 페이지가 정상적으로 로드되고 API 명세가 표시된다.