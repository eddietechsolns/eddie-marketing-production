---
name: Next.js App Router route locations
description: Actual file paths for route handlers in this project — critical because Turbopack silently ignores edits to the wrong file.
---

## Rule
Before editing any route handler, verify its actual location by checking `.next/server/app/` or by grepping the compiled chunks.

## Key locations confirmed
- **Login**: `app/auth/login/route.ts` → served at `/auth/login`
  - NOT `app/api/auth/login/route.ts` (that path is never compiled)
- **Change-password API**: `app/api/admin/change-password/route.ts` → served at `/api/admin/change-password`

## Why this matters
Turbopack caches compiled chunks in `.next/server/chunks/` and `.next/server/app/`. If you edit a file at the wrong path, Turbopack compiles the old file and the new edits are silently ignored — the response will still come from the stale compiled chunk even after restarting. No error is shown.

## How to verify
```bash
# Check what compiled routes exist for a path segment
find .next/server/app -name "route.js" | head -20
# Check what source a compiled chunk references
grep -n "createToken\|POST\|findUnique" .next/server/app/<path>/route.js
```
