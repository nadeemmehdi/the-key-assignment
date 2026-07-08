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

## Vercel Deployment

This repo deploys as two separate Vercel projects:

- `web-server`
- `web-client`

### `web-server`

Deploy from the `web-server` directory:

```bash
vercel --prod --cwd web-server
```

Required production environment variables:

```env
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require&uselibpqcompat=true
CORS_ALLOWED_ORIGINS=https://YOUR_FRONTEND_URL.vercel.app
```

After pointing `DATABASE_URL` at a new hosted Postgres database, initialize schema and seed data from your machine:

```bash
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require&uselibpqcompat=true pnpm --filter web-server db:push
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require&uselibpqcompat=true pnpm --filter web-server db:seed
```

### `web-client`

Deploy from the `web-client` directory:

```bash
vercel --prod --cwd web-client
```

Required production environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://YOUR_BACKEND_URL.vercel.app
NEXT_PUBLIC_DEMO_USER_ID=student-1
NEXT_PUBLIC_DEMO_USER_ROLE=student
```

### Notes

- Keep local Docker credentials in `.env` aligned with `.env.example`.
- Keep production secrets in Vercel project environment variables, not in local `.env`.
- If the frontend URL changes, update `CORS_ALLOWED_ORIGINS` for `web-server` and redeploy.

## Test

```bash
pnpm test
```
