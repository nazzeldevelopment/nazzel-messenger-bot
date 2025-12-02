# Nazzel Messenger User-Bot Dockerfile
# Multi-stage build for optimized production image

# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ ffmpeg

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build TypeScript
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

# Install pnpm and runtime dependencies
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate
RUN apk add --no-cache ffmpeg

# Create non-root user for security
RUN addgroup -g 1001 -S nazzel && \
    adduser -S nazzel -u 1001

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config.json ./config.json

# Create necessary directories
RUN mkdir -p logs music && \
    chown -R nazzel:nazzel /app

# Switch to non-root user
USER nazzel

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the application
CMD ["node", "dist/main.js"]
