# Gemini Web QA Tool

Automated web QA testing with Gemini AI and Playwright MCP

## Overview

The Gemini Web QA Tool automates the process of web application testing by:
1. **Uploading PRD documents** (Markdown or PDF format)
2. **Generating test cases** automatically using Gemini AI
3. **Executing tests** on target web services using Playwright
4. **Generating comprehensive QA reports** with screenshots and failure details

## Implementation Status

✅ **Foundation Complete** - Phases 1 & 2 (23/191 tasks, 12% complete)
- Project structure initialized
- NestJS 10 backend with Prisma ORM
- NextJS 14 frontend with TailwindCSS
- Core services (encryption, logging, validation)
- Database schema ready
- API types and shared infrastructure

See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for details.

## Getting Started

See [quickstart.md](./specs/001-gemini-web-qa-tool/quickstart.md) for complete setup instructions.

**Quick Start**:
```bash
# 1. Setup database
docker-compose up -d postgres

# 2. Backend setup
cd backend && npm install
npx prisma migrate dev --name init
npm run start:dev

# 3. Frontend setup (new terminal)
cd frontend && npm install
npm run dev
```

Access at http://localhost:3001

## Documentation

- [Feature Specification](./specs/001-gemini-web-qa-tool/spec.md)
- [Implementation Plan](./specs/001-gemini-web-qa-tool/plan.md)
- [Task Breakdown](./specs/001-gemini-web-qa-tool/tasks.md)
- [Implementation Status](./IMPLEMENTATION_STATUS.md)

## License

ISC
