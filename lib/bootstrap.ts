import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const BOOTSTRAP_ROLE = "super_admin";
const BOOTSTRAP_NAME = "System Administrator";

/**
 * Ensures exactly one Super Administrator exists.
 *
 * Called once during server startup via instrumentation.ts.
 * Fully idempotent — exits immediately if a super_admin already exists.
 * Gracefully skips if the role/isActive/mustChangePassword columns have not
 * yet been added to the production database (applies the SQL script first).
 *
 * Credentials are loaded from environment variables:
 *   BOOTSTRAP_ADMIN_EMAIL    — the administrator e-mail address
 *   BOOTSTRAP_ADMIN_PASSWORD — the temporary password (must be changed on first login)
 *
 * If either variable is absent, bootstrap creation is skipped with a warning.
 */
export async function ensureSuperAdmin(): Promise<void> {
  const bootstrapEmail    = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const bootstrapPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!bootstrapEmail || !bootstrapPassword) {
    console.warn(
      "[bootstrap] Skipping super-admin creation: " +
      "BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD must both be set."
    );
    return;
  }

  try {
    // If the role column doesn't exist this throws → caught below → skip.
    const existing = await prisma.user.findFirst({
      where: { role: BOOTSTRAP_ROLE },
      select: { id: true },
    });

    if (existing) {
      // A super_admin already exists — nothing to do.
      return;
    }
  } catch {
    // role column not present yet — bootstrap requires the schema additions.
    // Run prisma/user-management-schema.sql on the production DB first.
    return;
  }

  // No super_admin found — create the bootstrap administrator.
  const hashedPassword = await bcrypt.hash(bootstrapPassword, 12);

  try {
    // Attempt with all extended fields available.
    await prisma.user.create({
      data: {
        name:               BOOTSTRAP_NAME,
        email:              bootstrapEmail,
        password:           hashedPassword,
        role:               BOOTSTRAP_ROLE,
        isActive:           true,
        mustChangePassword: true,
      },
    });
    return;
  } catch {
    // mustChangePassword column may not exist yet — retry without it.
  }

  try {
    await prisma.user.create({
      data: {
        name:     BOOTSTRAP_NAME,
        email:    bootstrapEmail,
        password: hashedPassword,
        role:     BOOTSTRAP_ROLE,
        isActive: true,
      },
    });
  } catch {
    // Possible causes: email unique violation (user exists under a different role),
    // or isActive column missing. Either way, silently skip.
  }
}
