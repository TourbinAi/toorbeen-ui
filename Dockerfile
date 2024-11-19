# This is a PRODUCTION Dockerfile for a standalone Next.js app.

FROM node:20-alpine AS base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat vips-dev

# Don't run production as root
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Set working directory
WORKDIR /app

# -------------------------- stage installer ---------------------------------
FROM base AS installer

# Copy package.json and lock file for dependency installation
COPY package.json yarn.lock ./

# Install dependencies with Yarn (caching for faster builds)
RUN \
    --mount=type=cache,target=/usr/local/share/.cache/yarn/v6,sharing=locked \
    yarn install --frozen-lockfile --prefer-offline

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# -------------------------- stage runner ---------------------------------
FROM base AS runner
ENV NODE_ENV=production

WORKDIR /app

# Copy production dependencies and build output
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/.next ./.next
COPY --from=installer /app/package.json ./package.json
COPY --from=installer /app/public ./public
COPY --from=installer /app/next.config.mjs ./next.config.mjs

# Expose the port the app runs on
EXPOSE ${PORT:-3000}

# Start the application
CMD ["yarn", "start"]
