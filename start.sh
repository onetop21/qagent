#!/bin/bash

# Gemini Web QA Tool - 통합 실행 스크립트

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로고 출력
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║   Gemini Web QA Tool                  ║"
echo "║   Automated Testing Platform          ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# 함수: 체크 마크
check_mark() {
    echo -e "${GREEN}✓${NC} $1"
}

# 함수: 경고 마크
warning_mark() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 함수: 에러 마크
error_mark() {
    echo -e "${RED}✗${NC} $1"
}

# 함수: 정보 출력
info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# 1. 환경 체크
echo ""
info "환경 체크 중..."

# Node.js 체크
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    check_mark "Node.js $NODE_VERSION"
else
    error_mark "Node.js가 설치되지 않았습니다"
    exit 1
fi

# npm 체크
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    check_mark "npm $NPM_VERSION"
else
    error_mark "npm이 설치되지 않았습니다"
    exit 1
fi

# Docker 체크
if command -v docker &> /dev/null && docker ps &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | tr -d ',')
    check_mark "Docker $DOCKER_VERSION"
    DOCKER_AVAILABLE=true
else
    warning_mark "Docker를 사용할 수 없습니다"
    DOCKER_AVAILABLE=false
fi

# 2. 환경 변수 체크
echo ""
info "환경 변수 체크 중..."

if [ -f "backend/.env" ]; then
    check_mark "backend/.env 파일 존재"

    # Gemini API Key 체크
    if grep -q "GEMINI_API_KEY=\"your-gemini-api-key-here\"" backend/.env; then
        warning_mark "Gemini API Key가 설정되지 않았습니다!"
        echo "   backend/.env 파일에서 GEMINI_API_KEY를 설정해주세요"
        echo "   발급: https://makersuite.google.com/app/apikey"
    else
        check_mark "Gemini API Key 설정됨"
    fi
else
    error_mark "backend/.env 파일이 없습니다"
    exit 1
fi

if [ -f "frontend/.env.local" ]; then
    check_mark "frontend/.env.local 파일 존재"
else
    warning_mark "frontend/.env.local 파일이 없습니다 (선택사항)"
fi

# 3. PostgreSQL 시작
echo ""
info "데이터베이스 준비 중..."

if [ "$DOCKER_AVAILABLE" = true ]; then
    # Docker로 PostgreSQL 실행
    if docker-compose ps | grep -q "postgres.*Up"; then
        check_mark "PostgreSQL 이미 실행 중"
    else
        echo "   PostgreSQL 컨테이너 시작 중..."
        docker-compose up -d postgres

        echo "   PostgreSQL 준비 대기 중 (최대 30초)..."
        for i in {1..30}; do
            if docker-compose exec -T postgres pg_isready -U qagent &> /dev/null; then
                check_mark "PostgreSQL 준비 완료"
                break
            fi
            sleep 1
            if [ $i -eq 30 ]; then
                error_mark "PostgreSQL 시작 실패"
                exit 1
            fi
        done
    fi
else
    warning_mark "Docker를 사용할 수 없습니다"
    echo ""
    echo "PostgreSQL을 수동으로 설정해주세요:"
    echo "  1. PostgreSQL 15 설치"
    echo "  2. 데이터베이스 생성: qagent_db"
    echo "  3. 사용자 생성: qagent / qagent_dev"
    echo "  또는 Docker Desktop에서 WSL 통합 활성화"
    echo ""
    read -p "PostgreSQL이 준비되었나요? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 4. 백엔드 설정
echo ""
info "백엔드 설정 중..."

cd backend

# 의존성 체크
if [ ! -d "node_modules" ]; then
    echo "   백엔드 의존성 설치 중..."
    npm install
    check_mark "백엔드 의존성 설치 완료"
else
    check_mark "백엔드 의존성 이미 설치됨"
fi

# Prisma 클라이언트 생성
if [ ! -d "node_modules/@prisma/client" ] || [ ! -d "node_modules/.prisma" ]; then
    echo "   Prisma Client 생성 중..."
    npx prisma generate
    check_mark "Prisma Client 생성 완료"
else
    check_mark "Prisma Client 이미 생성됨"
fi

# 마이그레이션 체크
if [ "$DOCKER_AVAILABLE" = true ] || [ "$REPLY" = "y" ] || [ "$REPLY" = "Y" ]; then
    echo "   데이터베이스 마이그레이션 확인 중..."
    if npx prisma migrate status 2>&1 | grep -q "Database schema is up to date"; then
        check_mark "데이터베이스 마이그레이션 완료됨"
    else
        echo "   마이그레이션 실행 중..."
        npx prisma migrate dev --name init
        check_mark "마이그레이션 완료"
    fi
fi

cd ..

# 5. 프론트엔드 설정
echo ""
info "프론트엔드 설정 중..."

cd frontend

# 의존성 체크
if [ ! -d "node_modules" ]; then
    echo "   프론트엔드 의존성 설치 중..."
    npm install
    check_mark "프론트엔드 의존성 설치 완료"
else
    check_mark "프론트엔드 의존성 이미 설치됨"
fi

cd ..

# 6. 실행
echo ""
info "애플리케이션 시작 중..."
echo ""

# 백엔드 실행
echo "백엔드 시작 (http://localhost:3000)"
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..

# 잠시 대기 (백엔드가 먼저 시작되도록)
sleep 3

# 프론트엔드 실행
echo "프론트엔드 시작 (http://localhost:3001)"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# 종료 핸들러
cleanup() {
    echo ""
    info "애플리케이션 종료 중..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup INT TERM

# 완료 메시지
echo ""
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════╗"
echo "║  ✓ 애플리케이션이 시작되었습니다!       ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo "접속 URL:"
echo "  - 프론트엔드: ${BLUE}http://localhost:3001${NC}"
echo "  - 백엔드 API: ${BLUE}http://localhost:3000/api${NC}"
echo ""
echo "종료하려면 Ctrl+C를 누르세요"
echo ""

# 로그 출력 (옵션)
read -p "실시간 로그를 보시겠습니까? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # 백엔드와 프론트엔드 로그를 함께 출력
    tail -f backend/logs/*.log frontend/.next/trace 2>/dev/null || wait
else
    # 백그라운드에서 실행
    wait
fi
