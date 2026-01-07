FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/app/package.json ./packages/app/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/api/package.json ./packages/api/package.json

RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for Next.js static generation
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_PAYPAL_CLIENT_ID
ARG NEXT_PUBLIC_MAPBOX_TOKEN
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID=$NEXT_PUBLIC_PAYPAL_CLIENT_ID
ENV NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN

RUN npm run build --workspace=packages/app

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/packages/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/app/.next/static ./packages/app/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/packages/app/public ./packages/app/public

# Create data directories and set permissions
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data
RUN mkdir -p /app/packages/app/public/uploads && chown nextjs:nodejs /app/packages/app/public/uploads

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "packages/app/server.js"]
