# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable pnpm

COPY . .

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/frontend
RUN pnpm vite build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
