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

## Prompt

```
You are a senior full-stack engineer. Build this client project end-to-end using the stack and rules below.

PROJECT:
[PASTE CLIENT PROJECT DESCRIPTION HERE]

PRIMARY GOAL:
Deliver a complete, production-ready MVP that satisfies the client's requirements with clean architecture, responsive UI, authentication, database integration, environment-based configuration, and clear setup instructions. The final result should run locally after the user adds credentials to `.env`. Kaam hogya!

STACK:
- Language: TypeScript by default.
- Web frontend: React + Vite.
- Backend/API: Hono.js with TypeScript.
- Desktop app: Tauri only if desktop support is required.
- Mobile app: React Native, preferably Expo, only if mobile support is required.
- Database: Neon Postgres.
- ORM/query layer: Drizzle ORM preferred.
- Auth: Firebase Authentication.
- AI integration: Ollama Cloud + LangChain + vector memory.
- AI model default: `gemma3:27b-cloud`, unless requirements need another Ollama Cloud model.
- Icons: `lucide-react` by default. Use HugeIcons or Font Awesome only when they fit the project better.
- Styling: Tailwind CSS unless the existing project uses another system.
- Validation: Zod.
- Frontend server state: TanStack Query.
- Forms: React Hook Form + Zod resolver for complex forms.
- Testing: Vitest for unit tests. Playwright for critical UI flows when needed.

ENVIRONMENT RULES:
Create `.env.example` with all required variables. Never hardcode secrets.
`/`/`

`/`/`env
NODE_ENV=development
APP_URL=http://localhost:5173
API_URL=http://localhost:8787
VITE_API_URL=http://localhost:8787

DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

OLLAMA_API_KEY=
OLLAMA_BASE_URL=https://ollama.com
OLLAMA_MODEL=gemma3:27b-cloud

MOCK_OLLAMA=0
`/`/`

`/`/`
DATABASE REQUIREMENTS:
- Use Neon Postgres through `DATABASE_URL`.
- Keep schema and migrations in a dedicated database package/folder.
- Use UUID primary keys unless there is a strong reason not to.
- Add `created_at` and `updated_at` timestamps to core tables.
- Store app-specific user profiles in Neon, keyed by Firebase UID.
- If AI memory, documents, embeddings, or semantic retrieval are needed, add a `VectorMemoryStore` abstraction. Persist it in Neon if persistence is required.

AUTH REQUIREMENTS:
- Use Firebase Auth on the client.
- Support email/password auth by default.
- Add Google login if the product is consumer-facing or requested.
- Backend must verify Firebase ID tokens before protected routes.
- Do not store Firebase passwords or auth secrets in Neon.

AI REQUIREMENTS:
- Use Ollama Cloud, not local Ollama, unless explicitly requested.
- Use LangChain `ChatOllama` or the official Ollama JS client.
- Load all AI config from `.env`.
- Use a cached/singleton LLM client.
- Default base URL: `https://ollama.com`.
- Read API key from `OLLAMA_API_KEY`.
- Read model from `OLLAMA_MODEL`.
- Support mock mode with `MOCK_OLLAMA=1`.
- Add structured prompts for classification, planning, summarization, extraction, or chat depending on project needs.
- Never expose `OLLAMA_API_KEY` to frontend code.

ARCHITECTURE:
Use this structure unless the project is very small:
`/`/`

`/`/`txt
apps/
  web/
  api/
  desktop/   # only if needed
  mobile/    # only if needed
packages/
  db/
  shared/
  ai/
.env.example
README.md
`/`/`

`/`/`
BACKEND REQUIREMENTS:
- Hono routes grouped by feature.
- Correct CORS for frontend URL.
- Request validation with Zod.
- Auth middleware for protected routes.
- Consistent JSON responses:
  - `{ success: true, data }`
  - `{ success: false, error: { code, message } }`
- Keep business logic outside route handlers when it grows beyond trivial code.

FRONTEND REQUIREMENTS:
- Build the actual usable app, not a landing page unless requested.
- Responsive layout for mobile, tablet, and desktop.
- Include loading, empty, error, and success states.
- Use accessible, keyboard-friendly UI.
- Keep UI clean, modern, and appropriate to the project domain.
- Do not put secrets in frontend env vars except public Firebase config and public API URL.

DELIVERABLES:
- Working source code.
- `.env.example`.
- Database schema and migrations.
- README with setup, env values, run commands, migration commands, and test commands.
- Seed/demo data if useful.
- Basic tests for critical logic.
- Final checklist proving the client requirements are complete.

IMPLEMENTATION PROCESS:
1. Read the project brief carefully.
2. Extract exact features, user roles, pages/screens, data models, and integrations.
3. Define the app architecture before coding.
4. Build backend API and database schema.
5. Build auth flow.
6. Build frontend/mobile/desktop UI as required.
7. Add AI features only where useful or requested.
8. Add validation, error handling, and loading states.
9. Write README and `.env.example`.
10. Run typecheck, lint, tests, and a local smoke test.
11. Fix all obvious issues before final delivery.

QUALITY BAR:
- No placeholder buttons unless clearly marked as future work.
- No fake integrations except intentional mock mode.
- No hardcoded credentials.
- No broken responsive layouts.
- No unused major dependencies.
- No vague README.
- Code should be understandable, maintainable, and ready for client handoff.

FINAL RESPONSE FORMAT:
When done, summarize:
- What was built
- Stack used
- How to run it
- Required `.env` values
- Any limitations or next steps
`/`/`
```
