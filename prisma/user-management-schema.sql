-- =============================================================================
-- User Management Schema Additions
-- =============================================================================
-- Run this script on the production database to unlock the full
-- User Management feature (role-based access, account status, activity log,
-- password-change enforcement, and the bootstrap Super Administrator).
--
-- All statements are idempotent — safe to run multiple times.
-- No existing data is modified or deleted.
-- After running, restart the application — the bootstrap administrator will be
-- created automatically on the next server startup if no super_admin exists.
-- =============================================================================

-- 1. Add role column (defaults every existing user to 'admin')
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'admin';

-- 2. Add isActive flag (defaults every existing user to active)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;

-- 3. Add lastLoginAt timestamp (nullable — no backfill required)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);

-- 4. Add mustChangePassword flag (defaults to false for existing users)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "mustChangePassword" BOOLEAN NOT NULL DEFAULT false;

-- 5. Indexes on the new User columns
CREATE INDEX IF NOT EXISTS "User_role_idx"     ON "User"("role");
CREATE INDEX IF NOT EXISTS "User_isActive_idx" ON "User"("isActive");

-- 6. UserActivity audit table
CREATE TABLE IF NOT EXISTS "UserActivity" (
    "id"        SERIAL       NOT NULL,
    "userId"    INTEGER      NOT NULL,
    "action"    TEXT         NOT NULL,
    "detail"    TEXT,
    "ip"        TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "UserActivity_userId_idx"    ON "UserActivity"("userId");
CREATE INDEX IF NOT EXISTS "UserActivity_createdAt_idx" ON "UserActivity"("createdAt");

-- 7. Foreign key from UserActivity → User (cascade on delete)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'UserActivity_userId_fkey'
  ) THEN
    ALTER TABLE "UserActivity"
      ADD CONSTRAINT "UserActivity_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- =============================================================================
-- After running this script:
--   1. Restart the application server.
--   2. The bootstrap administrator is created automatically on startup
--      (only if no user with role='super_admin' already exists).
--   3. Log in with:  admin@eddietechsolns.com  /  ChangeMe123!
--   4. You will be forced to change the password before accessing the dashboard.
-- =============================================================================
