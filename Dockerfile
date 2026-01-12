# ==============================================================================
# STAGE 1: Dependency Installation (Polyglot)
# ==============================================================================
FROM node:20-alpine AS deps
WORKDIR /app

# Install package managers (pnpm, yarn, bun)
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm install -g bun

# Copy all possible lockfiles and package.json
COPY package.json ./
COPY package-lock.json* yarn.lock* pnpm-lock.yaml* bun.lockb* ./

# Polyglot install: detect lockfile and run appropriate install command
RUN \
  if [ -f "bun.lockb" ]; then \
    echo "📦 Detected bun.lockb - using Bun" && \
    bun install --frozen-lockfile; \
  elif [ -f "pnpm-lock.yaml" ]; then \
    echo "📦 Detected pnpm-lock.yaml - using pnpm" && \
    pnpm install --frozen-lockfile; \
  elif [ -f "yarn.lock" ]; then \
    echo "📦 Detected yarn.lock - using Yarn" && \
    yarn install --frozen-lockfile; \
  elif [ -f "package-lock.json" ]; then \
    echo "📦 Detected package-lock.json - using npm" && \
    npm ci; \
  else \
    echo "⚠️ No lockfile found - defaulting to npm install" && \
    npm install; \
  fi

# ==============================================================================
# STAGE 2: Build
# ==============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

# Re-install package managers for build stage
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm install -g bun

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN \
  if [ -f "bun.lockb" ]; then \
    bun run build; \
  elif [ -f "pnpm-lock.yaml" ]; then \
    pnpm run build; \
  elif [ -f "yarn.lock" ]; then \
    yarn build; \
  else \
    npm run build; \
  fi

# ==============================================================================
# STAGE 3: Production Runner (Standalone)
# ==============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
