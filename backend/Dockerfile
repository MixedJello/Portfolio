FROM golang:1.23-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache gcc musl-dev

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN go build -o main .

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["./main"] 