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
RUN /app/node_modules/.bin/tsc --skipLibCheck --noEmitOnError false || true && \
    if [ ! -d "dist" ]; then echo "ERROR: dist folder not created after tsc"; exit 1; fi

# Production stage
FROM node:20-slim

WORKDIR /app/deploy

RUN corepack enable pnpm

# Copy only built app
COPY --from=builder /app/apps/translation-api ./

# Remove "type": "module" from package.json for CommonJS compatibility
RUN node -e "const fs=require('fs');const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));delete pkg.type;fs.writeFileSync('package.json',JSON.stringify(pkg,null,2));"

# Install production dependencies with build scripts enabled
RUN pnpm config set enable-pre-post-scripts true && \
    pnpm install --prod --ignore-scripts=false && \
    pnpm rebuild sharp onnxruntime-node && \
    pnpm store prune && \
    rm -rf /root/.local/share/pnpm/store

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/server.js"]
