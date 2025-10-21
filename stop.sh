#!/bin/bash

# Gemini Web QA Tool - 종료 스크립트

echo "애플리케이션 종료 중..."

# 백엔드 프로세스 종료
pkill -f "nest start" || true
pkill -f "npm run start:dev" || true

# 프론트엔드 프로세스 종료
pkill -f "next dev" || true
pkill -f "npm run dev" || true

# Docker 컨테이너 종료 (선택)
read -p "Docker 컨테이너도 종료하시겠습니까? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose down
    echo "✓ Docker 컨테이너 종료됨"
fi

echo "✓ 애플리케이션이 종료되었습니다"
