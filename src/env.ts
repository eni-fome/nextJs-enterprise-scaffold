/**
 * ============================================================================
 * ENVIRONMENT CONFIGURATION (Type-Safe)
 * ============================================================================
 *
 * This is the SINGLE SOURCE OF TRUTH for all environment variables.
 *
 * ⚠️  IMPORTANT FOR DEVELOPERS:
 *     When adding a new environment variable:
 *     1. Add it to the appropriate schema below (server or client)
 *     2. Add it to the runtimeEnv object
 *     3. Add it to your .env.local file
 *
 *     Do NOT use process.env directly in your code.
 *     Import from this file instead: import { env } from "@/env"
 *
 * @see https://env.t3.gg/docs/nextjs
 */

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables schema.
   * These variables are ONLY available on the server.
   * They will NOT be exposed to the client bundle.
   *
   * @example
   * server: {
   *   DATABASE_URL: z.string().url(),
   *   API_SECRET_KEY: z.string().min(32),
   * }
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DATABASE_URL: z.string().url().optional(),
    API_SECRET_KEY: z.string().min(1).optional(),
  },

  /**
   * Client-side environment variables schema.
   * These variables are exposed to the browser.
   *
   * ⚠️  MUST be prefixed with NEXT_PUBLIC_
   *
   * @example
   * client: {
   *   NEXT_PUBLIC_API_URL: z.string().url(),
   *   NEXT_PUBLIC_ANALYTICS_ID: z.string(),
   * }
   */
  client: {
    NEXT_PUBLIC_API_URL: z.string().url().optional(),
    NEXT_PUBLIC_APP_NAME: z.string().default("NES App"),
  },

  /**
   * Runtime environment variables.
   * Maps the actual process.env values to the schema.
   *
   * ⚠️  Every variable in server/client schemas MUST be listed here.
   */
  runtimeEnv: {
    // Server
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    API_SECRET_KEY: process.env.API_SECRET_KEY,
    // Client
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },

  /**
   * Skip validation in certain environments.
   * Useful for Docker builds where env vars aren't available at build time.
   *
   * Set SKIP_ENV_VALIDATION=1 to bypass validation.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Treat empty strings as undefined.
   * Prevents "" from passing validation for required fields.
   */
  emptyStringAsUndefined: true,
});
