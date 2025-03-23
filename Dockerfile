# Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
RUN npm install axios
COPY frontend/ .
RUN npm run build
# Debug: Show the server.js contents
RUN cat .next/standalone/server.js || echo "server.js not found"
# Attempt the patch
RUN sed -i "s/app.listen(port/app.listen(port, '0.0.0.0'/" .next/standalone/server.js || echo "sed failed"
# Debug: Verify the change
RUN grep "app.listen" .next/standalone/server.js || echo "No app.listen found after patch"

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