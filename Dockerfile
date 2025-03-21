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
RUN apk add --no-cache gcc musl-dev git
COPY backend/ .
RUN go mod download && \
    CGO_ENABLED=0 GOOS=linux go build -o main .

# Final stage with Nginx
FROM nginx:alpine
WORKDIR /app

# Install Node.js and necessary tools
RUN apk add --no-cache nodejs npm supervisor

# Copy frontend build
COPY --from=frontend-builder /app/frontend/.next/standalone /app/frontend
COPY --from=frontend-builder /app/frontend/.next/static /app/frontend/.next/static
COPY --from=frontend-builder /app/frontend/public /app/frontend/public

# Copy backend binary
COPY --from=backend-builder /app/backend/main /app/backend/main

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisord.conf

# Expose port
EXPOSE 3000

# Start supervisor which will manage both frontend and backend
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"] 