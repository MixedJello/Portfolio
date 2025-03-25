# Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build
CMD ["npm", "start"]
EXPOSE 3000

# Build backend
FROM golang:1.23.4-alpine AS backend-builder
WORKDIR /app/backend
RUN apk add --no-cache gcc musl-dev git
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Final stage with Nginx
FROM nginx:alpine
WORKDIR /app
RUN apk add --no-cache nodejs npm supervisor tini
COPY --from=frontend-builder /app/frontend/.next/standalone /app/frontend
COPY --from=frontend-builder /app/frontend/.next/static /app/frontend/.next/static
COPY --from=frontend-builder /app/frontend/public /app/frontend/public
COPY --from=backend-builder /app/backend/main /app/backend/main
COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisord.conf
EXPOSE 8080
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]