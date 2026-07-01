-- User Management module: adds role, isActive, lastLoginAt to User
-- and creates the UserActivity table.
-- All statements use IF NOT EXISTS / conditional logic — safe on any database state.

-- ─── Add missing User columns ─────────────────────────────────────────────────
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role"        TEXT      NOT NULL DEFAULT 'admin';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isActive"    BOOLEAN   NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);

-- ─── Indexes on new User columns ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS "User_role_idx"     ON "User"("role");
CREATE INDEX IF NOT EXISTS "User_isActive_idx" ON "User"("isActive");

-- ─── UserActivity table ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "UserActivity" (
    "id"        SERIAL        NOT NULL,
    "userId"    INTEGER       NOT NULL,
    "action"    TEXT          NOT NULL,
    "detail"    TEXT,
    "ip"        TEXT,
    "createdAt" TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "UserActivity_userId_idx"    ON "UserActivity"("userId");
CREATE INDEX IF NOT EXISTS "UserActivity_createdAt_idx" ON "UserActivity"("createdAt");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'UserActivity_userId_fkey') THEN
    ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
