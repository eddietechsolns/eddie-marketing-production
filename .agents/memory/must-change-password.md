---
name: mustChangePassword enforcement
description: Bootstrap super-admin forced password change on first login — complete flow and implementation details.
---

## Flow
1. **Seeding** (`lib/bootstrap.ts`): creates `admin@eddietechsolns.com` with `mustChangePassword: true` and password `ChangeMe123!` if no super_admin exists.
2. **Login** (`app/auth/login/route.ts`): reads the flag via `$queryRawUnsafe` (bypasses Prisma ORM validator) with a bcrypt fallback (compares against `ChangeMe123!`) and embeds `mustChangePassword: true/false` in the JWT via `createToken`.
3. **Middleware** (`middleware.ts`): if `payload.mustChangePassword === true` and path ≠ `/admin/change-password`, issues 307 redirect to `/admin/change-password`.
4. **Change-password page** (`app/admin/change-password/page.tsx`): glassmorphism UI, posts to `/api/admin/change-password`.
5. **Change-password API** (`app/api/admin/change-password/route.ts`): updates password hash, sets `mustChangePassword = false` in DB (via Prisma update, wrapped in `.catch(() => {})`), issues new JWT with `mustChangePassword: false`.

## Detection strategy (two layers)
- **Layer 1** — `$queryRawUnsafe`: bypasses the Prisma singleton's in-memory schema validator, which rejects new columns when the singleton was created before the column was added.
- **Layer 2** — bcrypt compare with `ChangeMe123!`: immune to DB column availability; if the bootstrap admin hasn't changed their password, bcrypt compare returns true.

## DB schema
Column: `User.mustChangePassword Boolean @default(false)` — added via `prisma db push`. Production SQL in `prisma/user-management-schema.sql`.

## Why $queryRawUnsafe instead of Prisma ORM where-clause
`prisma.user.findFirst({ where: { mustChangePassword: true } })` threw a JS error at the Prisma client level (no SQL generated) when the singleton was initialised before the schema update. `$queryRawUnsafe` sends SQL directly to PostgreSQL, bypassing the in-memory validator entirely.
