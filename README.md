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

## Database Configuration

For local Docker development, the app builds the PostgreSQL connection string from `.env`:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=saved_posts
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

If you are deploying to a hosted environment such as Vercel, you can alternatively set a full:

```env
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DBNAME
```

`DATABASE_URL` takes precedence over the component-based `POSTGRES_*` values.

## Test

```bash
pnpm test
```
