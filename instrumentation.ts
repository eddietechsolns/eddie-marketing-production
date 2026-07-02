/**
 * Next.js instrumentation hook — runs once when the Node.js server starts.
 * Used here to bootstrap the first Super Administrator if none exists.
 *
 * This file must live at the project root (next to next.config.ts).
 * Instrumentation is stable in Next.js 15 — no experimental flag required.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { ensureSuperAdmin } = await import("./lib/bootstrap");
    await ensureSuperAdmin().catch((err) => {
      console.error("[bootstrap] ensureSuperAdmin failed:", err);
    });
  }
}
