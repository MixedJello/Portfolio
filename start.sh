#!/bin/sh

# Start backend in background
cd /app/backend
./main &

# Wait a moment for backend to initialize
sleep 2

# Start frontend
cd /app/frontend
exec node server.js 