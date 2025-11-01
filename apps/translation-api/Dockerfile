# Build stage
FROM node:20-slim AS builder

WORKDIR /app

RUN corepack enable pnpm

# Copy only translation-api workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/translation-api/package.json ./apps/translation-api/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/translation-api ./apps/translation-api

# Build
WORKDIR /app/apps/translation-api
RUN pnpm tsc || true

# Production stage
FROM node:20-slim

WORKDIR /app/deploy

RUN corepack enable pnpm

# Copy only built app using pnpm deploy
COPY --from=builder /app/apps/translation-api ./

# Install production dependencies only for this workspace
RUN pnpm install --prod --no-optional && \
    pnpm store prune && \
    rm -rf /root/.local/share/pnpm/store

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/server.js"]
