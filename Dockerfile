# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies based on the package lock
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Run the build
RUN npm run build

# Stage 2: Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create nextuser to avoid running container as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets and standalone build output
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Start server using the standalone node server script
CMD ["node", "server.js"]
