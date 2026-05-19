# Sharjeel's boilerplate

Production-oriented monorepo starter for **React + Vite + Hono + Neon + Firebase + Ollama Cloud**.

## Architecture

```txt
apps/
  web/      React Vite frontend (TanStack Query, React Hook Form, Firebase client auth)
  api/      Hono TypeScript API (Zod validation, CORS, Firebase token verification)
packages/
  db/       Drizzle ORM schema + migrations for Neon Postgres
  shared/   Shared validators/types
  ai/       Ollama Cloud client + retry + mock mode + vector memory abstraction
```

Desktop/mobile targets are intentionally excluded by default; add Tauri/React Native only when requested by client scope.

## Setup

1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Fill all required values in `.env`.
3. Install dependencies:
   ```bash
   npm install
   ```

## Run locally

- Web:
  ```bash
  npm run dev:web
  ```
- API:
  ```bash
  npm run dev:api
  ```

## Build, lint, typecheck, test

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Database (Neon + Drizzle)

- Schema: `packages/db/src/schema.ts`
- Migration SQL: `packages/db/migrations/0000_init.sql`

Commands:

```bash
npm run db:generate -w packages/db
npm run db:migrate -w packages/db
```

## API response format

- Success: `{ "success": true, "data": ... }`
- Error: `{ "success": false, "error": { "code": "...", "message": "..." } }`

## Environment variables

All required variables are listed in `.env.example`, including:
- app URLs
- Neon `DATABASE_URL`
- Firebase client and admin vars
- Ollama Cloud vars (`OLLAMA_API_KEY`, `OLLAMA_BASE_URL`, `OLLAMA_MODEL`)
- `MOCK_OLLAMA` for local/test mode

## Notes

- Backend verifies Firebase ID tokens for protected routes.
- App-specific profile table is `user_profiles`, keyed by Firebase UID.
- Ollama API keys are server-side only. Never expose `OLLAMA_API_KEY` in frontend code.
