# Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY Portfolio/frontend/package*.json ./
RUN npm install
COPY Portfolio/frontend/ .
RUN npm run build

# Build backend
FROM golang:1.23-alpine AS backend-builder
WORKDIR /app/backend
RUN apk add --no-cache gcc musl-dev git
COPY Portfolio/backend/go.mod Portfolio/backend/go.sum ./
RUN go mod download
COPY Portfolio/backend/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Final stage with Nginx
FROM nginx:alpine
WORKDIR /app
RUN apk add --no-cache nodejs npm supervisor
COPY --from=frontend-builder /app/frontend/.next/standalone /app/frontend
COPY --from=frontend-builder /app/frontend/.next/static /app/frontend/.next/static
COPY --from=frontend-builder /app/frontend/public /app/frontend/public
COPY --from=backend-builder /app/backend/main /app/backend/main
COPY Portfolio/nginx.conf /etc/nginx/nginx.conf
COPY Portfolio/supervisord.conf /etc/supervisord.conf
EXPOSE 3000
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]