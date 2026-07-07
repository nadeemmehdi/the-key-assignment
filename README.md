# Saved Posts Demo

Monorepo with:

- `web-server`: Elysia + PostgreSQL + Drizzle
- `web-client`: Next.js App Router + React Query

## Requirements

- Node `24.15.0`
- pnpm `11.x`
- Docker

## Setup

```bash
cp .env.example .env
docker compose up -d
pnpm install
pnpm db:setup
pnpm dev
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:3001`

## Test

```bash
pnpm test
```

