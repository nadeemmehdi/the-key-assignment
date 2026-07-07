# Notes

## Setup steps

```bash
# install
pnpm install

# create schema and seed data
docker compose up -d
pnpm db:setup

# start the API
pnpm --filter web-server dev

# start the UI
pnpm --filter web-client dev

# run unit + API tests
pnpm test
```

The project also supports starting both apps together with:

```bash
pnpm dev
```

## Key decisions

- Used a `pnpm` workspace with `web-client` and `web-server` to keep frontend and backend isolated while sharing Node and TypeScript configuration.
- Stub authentication is handled at the API boundary from request headers. Authorization rules stay in the service layer so a real token/session provider can replace only the auth resolution step later.
- Saved posts use a single record per `(userId, postId)` with `deletedAt` soft delete semantics. Re-saving reactivates the existing row instead of creating a duplicate.
- Feed and saved-list responses return `hasSaved` and `savesCount` from the backend so UI components stay presentation-focused.
- Client strings live in a simple catalog with English and Spanish, including pluralized save-count labels.

## Trade-offs

- The demo uses `drizzle-kit push` plus a seed script instead of a fuller migration history workflow.
- Authentication is intentionally stubbed through headers rather than session or signed token verification.
- Pagination is included in the API contract but kept minimal in the UI.
- Next.js is configured to run with Webpack in dev/build because Turbopack workspace-root resolution was unstable in this local setup.

## If I had another day

- Add cursor-based pagination and richer optimistic updates.
- Add confirmation UX and audit metadata around moderator post removal.
- Tighten i18n further by driving document metadata and route-level language from locale selection.
- Extract shared API schemas into a third workspace package if cross-app duplication grows.
