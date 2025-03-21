# Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Build backend
FROM golang:1.21-alpine AS backend-builder
WORKDIR /app/backend
# Install build dependencies
RUN apk add --no-cache gcc musl-dev
# Copy the entire backend directory
COPY backend/ .
# Download dependencies and build
RUN go mod download && \
    CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Final stage
FROM alpine:latest
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache ca-certificates tzdata nodejs npm

# Copy frontend build
COPY --from=frontend-builder /app/frontend/.next/standalone ./frontend
COPY --from=frontend-builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# Copy backend binary
COPY --from=backend-builder /app/backend/main ./backend/main

# Create non-root user
RUN adduser -D -g '' appuser && \
    chown -R appuser:appuser /app
USER appuser

# Expose ports
EXPOSE 3000
EXPOSE 8000

# Copy and set up start script
COPY start.sh ./
RUN chmod +x start.sh
CMD ["./start.sh"] 