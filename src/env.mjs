import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

const optionalZodBoolean = z
  .string()
  .toLowerCase()
  .transform((x) => x === "true")
  .pipe(z.boolean())
  .optional()

export const env = createEnv({
  emptyStringAsUndefined: true,
  // TODO: Temporary skip validation because of unknown error with detecting NextAuth env vars in Github Actions:
  // ❌ Invalid environment variables: { NEXTAUTH_SECRET: [ 'Required' ], NEXTAUTH_URL: [ 'Required' ] }
  skipValidation: true,

  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_URL: z.string().url(),
    NEXT_PUBLIC_NESHAN_KEY: z.string().url(),
    NEXT_OUTPUT: z.string().optional(),
    NEXT_IMAGES_UNOPTIMIZED: optionalZodBoolean.default(false),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    NEXT_RUNTIME: z.enum(["nodejs", "edge"]).default("nodejs"),
    SENTRY_AUTH_TOKEN: z.string().optional(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
  },
  /*
   * Environment variables available on the client (and server).
   * You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_APP_PUBLIC_URL: z.string().url(),
    NEXT_PUBLIC_BACKEND_URL: z.string().url(),
    NEXT_PUBLIC_STRAPI_URL: z.string().url(),
    NEXT_PUBLIC_PREVENT_UNUSED_FUNCTIONS_ERROR_LOGS: optionalZodBoolean,
    NEXT_PUBLIC_NODE_ENV: z.string().optional(),
    NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   * You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_NESHAN_KEY: process.env.NEXT_PUBLIC_NESHAN_KEY,
    NEXT_OUTPUT: process.env.NEXT_OUTPUT,
    NEXT_IMAGES_UNOPTIMIZED: process.env.NEXT_IMAGES_UNOPTIMIZED,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_PUBLIC_URL: process.env.NEXT_PUBLIC_APP_PUBLIC_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
    NEXT_PUBLIC_PREVENT_UNUSED_FUNCTIONS_ERROR_LOGS:
      process.env.NEXT_PUBLIC_PREVENT_UNUSED_FUNCTIONS_ERROR_LOGS,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
  },
})
