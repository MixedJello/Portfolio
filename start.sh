#!/bin/sh

# Start backend
cd /app/backend
./main &

# Start frontend
cd /app/frontend
node server.js 