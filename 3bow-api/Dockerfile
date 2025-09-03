# Simple production Dockerfile (optional)
FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm i -g pnpm || true

FROM base AS deps
RUN if [ -f yarn.lock ]; then yarn --frozen-lockfile;     elif [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile;     else npm ci; fi

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm i -g @nestjs/cli && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY package.json .
CMD ["node", "dist/main.js"]
