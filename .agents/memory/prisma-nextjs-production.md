---
name: Prisma + Next.js 15 production fix
description: Required config to prevent Prisma wasm engine from being broken by webpack in production builds
---

## The Rule

Two changes are always required for Prisma to work in a Next.js 15 production build:

1. `next.config.ts` must declare `serverExternalPackages: ['@prisma/client', 'prisma']`
2. `package.json` build script must prepend `prisma generate &&` → `"build": "prisma generate && next build"`

**Why:** Prisma 6.x uses a WebAssembly-based query engine. Next.js webpack tries to bundle `@prisma/client` into the server bundle, but cannot include the wasm engine files correctly. At runtime, Prisma can't find its engine and every query throws — which surfaces as `{"error":"Server error"}` from any caught route handler. `serverExternalPackages` tells webpack to leave `@prisma/client` unmodified so Node.js resolves it from the filesystem at runtime. `prisma generate` ensures the client is always regenerated for the current schema before webpack runs.

**How to apply:** Any time a new Next.js project uses Prisma, apply both changes before first deployment. The symptom without this fix: DB queries silently throw in production but work perfectly in dev (Turbopack doesn't have this bundling issue).

**Diagnostic:** The definitive test — call the login endpoint with a non-existent email. If it returns `{"error":"Server error"}` (500) instead of `{"error":"Invalid email or password"}` (401), Prisma is broken in production (bcrypt is never even reached for a null user).
