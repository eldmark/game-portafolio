# Build stage for dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared/package.json packages/shared/package.json

# Install only necessary dependencies for building
RUN npm ci

# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# Build shared package and backend
RUN npm run build --workspace @portfolio/shared
RUN npm run prisma:generate --workspace @portfolio/backend
RUN npm run build --workspace @portfolio/backend

# Development stage
FROM node:20-alpine AS development
WORKDIR /app
ENV NODE_ENV=development
RUN apk add --no-cache openssl
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
COPY --from=builder /app ./
RUN chown -R expressjs:nodejs /app
RUN chmod -R 775 /app/node_modules
USER expressjs
EXPOSE 4000
CMD ["sh", "-c", "npm run db:deploy --workspace @portfolio/backend && npm run dev --workspace @portfolio/backend"]

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install openssl for Prisma
RUN apk add --no-cache openssl

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

# Copy only the necessary files from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

# Prune dev dependencies to save space and memory
# Note: we moved prisma to dependencies in package.json to ensure it's available for migrations
RUN npm prune --production --workspace @portfolio/backend --workspace @portfolio/shared

# Fix permissions for the entire app directory and specifically node_modules for Prisma
RUN chown -R expressjs:nodejs /app
RUN chmod -R 775 /app/node_modules

USER expressjs

EXPOSE 4000

CMD ["sh", "-c", "npm run db:deploy --workspace @portfolio/backend && npm run start --workspace @portfolio/backend"]
